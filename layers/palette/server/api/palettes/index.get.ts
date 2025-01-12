import type { ListPaletteDto } from '../../dtos/palette.dto';

export default defineEventHandler(async (event): Promise<ListPaletteDto> => {
  const query = await modules.palette.validation.getListInputQuery(event);

  /** @descritpion as its a get request we must parse some numbers */
  const page = parseInt(query.page);
  const size = parseInt(query.size ?? '20');
  const tags = query.tags?.split(',') ?? undefined;

  let userId: string | undefined;

  /** @description if they are authed we should add userId so we can link their likes */
  try {
    const auth = await modules.auth.service.verify(event);
    userId = auth.userId;
  } catch {}

  if (tags !== undefined && tags.length > 0) {
    return await modules.palette.service.listByTags(page, size, {
      userId,
      tags
    });
  }

  return await modules.palette.service.list(page, size, {
    userId,
    sortBy: query.sortBy
  });
});
