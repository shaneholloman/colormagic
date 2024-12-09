/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useMutation, useQuery, useInfiniteQuery } from '@tanstack/vue-query';
import type { ClonePaletteInputParamsDto, ClonePaletteInputQueryDto, CountPaletteDto, CreatePaletteInputDto, ListPaletteDto, ListPaletteInputDto } from '../server/dtos/palette.dto';
import type { CreatePaletteLikeInputDto, DeletePaletteLikeInputDto } from '../server/dtos/palette-like.dto';
import type { PaletteModel } from '../models/palette.model';
import { PaletteSortBy } from '../types';
import { PlausibleEventName } from '~/layers/plausible/types';
import { sendPlausibleEvent } from '~/layers/plausible/utils/plausible.util';
import { useOptimisticMutation } from '~/layers/common/composables/optimistic.composable';

const PALETTE_ROOT_KEY = 'palette';

export function usePalette(id: Ref<string | undefined>) {
  return useQuery({
    queryKey: [PALETTE_ROOT_KEY, id],
    queryFn: async () => {
      const headers = useRequestHeaders(['cookie']);

      return await $fetch<PaletteModel>(`/api/palettes/${id.value}`, {
        method: 'GET',
        headers
      });
    }
  });
}

export type ListPaletteFilterParams = Pick<ListPaletteInputDto, 'sortBy'> & {
  tags?: string[]
};

export function useListPalettes(size: number, filter: ComputedRef<ListPaletteFilterParams | undefined>) {
  return useInfiniteQuery({
    queryKey: [PALETTE_ROOT_KEY, size, filter],
    queryFn: async ({ pageParam: page = 0 }) => {
      const headers = useRequestHeaders(['cookie']);

      const query: ListPaletteInputDto = {
        page: page.toString(),
        size: size?.toString(),
        tags: filter.value?.tags?.join(','),
        sortBy: filter.value?.sortBy ?? PaletteSortBy.RECENT
      };

      return await $fetch<ListPaletteDto>('/api/palettes', {
        method: 'GET',
        query,
        headers
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.items.length < size) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    }
  });
}

export function useListLikedPalettes(size: number = 10, retryCount?: number) {
  return useInfiniteQuery({
    queryKey: [PALETTE_ROOT_KEY, size, 'liked'],
    queryFn: async ({ pageParam: page = 0 }) => {
      const headers = useRequestHeaders(['cookie']);

      const query: ListPaletteInputDto = {
        page: page.toString(),
        size: size.toString(),
        sortBy: PaletteSortBy.RECENT
      };

      return await $fetch<ListPaletteDto>('/api/palettes/liked', {
        method: 'GET',
        query,
        headers
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.items.length < size) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
    retry: retryCount ?? 3
  });
}

export function useCreatePalette() {
  return useMutation({
    mutationFn: async (params: CreatePaletteInputDto) => {
      const response = await $fetch<PaletteModel>('/api/palettes', {
        method: 'PUT',
        query: {
          prompt: params.prompt,
          colors: params.colors
        }
      });

      sendPlausibleEvent(PlausibleEventName.COLOR_PALETTE_CREATED);

      return response;
    }
  });
}

export type ClonePaletteParams = ClonePaletteInputQueryDto & ClonePaletteInputParamsDto;

export function useClonePalette() {
  return useMutation({
    mutationFn: async (params: ClonePaletteParams) => {
      const response = await $fetch<PaletteModel>(`/api/palettes/${params.id}/clone`, {
        method: 'PUT',
        query: {
          colors: params.colors
        }
      });

      sendPlausibleEvent(PlausibleEventName.COLOR_PALETTE_CREATED);

      return response;
    }
  });
}

export function usePaletteCount(fromDate?: Date) {
  return useQuery({
    queryKey: [PALETTE_ROOT_KEY, 'count', fromDate],
    queryFn: async () => {
      return await $fetch<CountPaletteDto>('/api/palettes/count', {
        method: 'GET',
        query: {
          fromDate: fromDate?.toISOString()
        }
      });
    }
  });
}

export function useOptimisticCreatePaletteLike() {
  return useOptimisticMutation({
    queryKey: [PALETTE_ROOT_KEY],
    mutationFn: async (params: CreatePaletteLikeInputDto) => {
      await $fetch(`/api/palettes/${params.id}/like`, {
        method: 'PUT'
      });
    },
    updateQueryFn: (params: CreatePaletteLikeInputDto, old?: ListPaletteDto) => {
      if (old === undefined) {
        return undefined;
      }

      return {
        items: old.items.map((item) => ({
          ...item,
          isLiked: item.id === params.id ? true : item.isLiked
        }))
      };
    }
  });
}

export function useOptimisticDeletePaletteLike() {
  return useOptimisticMutation({
    queryKey: [PALETTE_ROOT_KEY],
    mutationFn: async (params: DeletePaletteLikeInputDto) => {
      await $fetch(`/api/palettes/${params.id}/like`, {
        method: 'DELETE'
      });
    },
    updateQueryFn: (params: DeletePaletteLikeInputDto, old?: ListPaletteDto) => {
      if (old === undefined) {
        return undefined;
      }

      return {
        items: old.items.map((item) => ({
          ...item,
          isLiked: item.id === params.id ? false : item.isLiked
        }))
      };
    }
  });
}
