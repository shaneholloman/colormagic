<template>
  <!-- download landscape PNG -->
  <div class="mt-8">
    <h2 class="font-semibold text-lg capitalize">
      {{ $t('palette.png', { name }) }}
    </h2>

    <div class="relative">
      <img
        loading="lazy"
        :src="landscapeImageUrl"
        class="rounded-xl"
        :alt="`Download ${name.toLowerCase()} color palette PNG image (landscape)`"
      >
      <UButton
        label="Download PNG"
        class="absolute bottom-4 right-4"
        @click="downloadImage(landscapeImageUrl)"
      />
    </div>

    <div class="relative max-w-md w-full">
      <img
        loading="lazy"
        :src="squareImageUrl"
        class="rounded-xl w-full mt-4"
        :alt="`Download ${name.toLowerCase()} color palette PNG image (square)`"
      >
      <UButton
        label="Download PNG"
        class="absolute bottom-4 right-4"
        @click="downloadImage(squareImageUrl)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  tags: string[]
}

const props = defineProps<Props>();

const { t } = useI18n();

const name = props.tags.map(v => t(`colors.${v}`)).join(' ');

const landscapeImageUrl = `${useRuntimeConfig().public.siteUrl}/api/image/tag/${props.tags.join('-')}`;
const squareImageUrl = `${useRuntimeConfig().public.siteUrl}/api/image/tag/${props.tags.join('-')}?width=1080&height=1080`;
</script>
