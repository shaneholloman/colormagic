import { getAllPaletteFilters, getPaletteCombos } from '../../../utils/palette-filters.util';
import { PaletteSortBy } from '~/layers/palette/types';

export default defineTask({
  async run() {
    /** @description combine all tags to one array */
    const tags = [
      ...getAllPaletteFilters().map(v => v.id),
      ...getPaletteCombos().map(v => v.join('-'))
    ];

    /** @description upsert tags to db incase any new ones */
    await modules.palette.tag.service.bulkUpsert(tags);

    /** @description loop tags and update paletteIds */
    const paletteIdsLimit = 1000;

    for await (const tag of tags) {
      const palettes = await modules.palette.service.listByTag(
        tag,
        paletteIdsLimit,
        PaletteSortBy.POPULAR
      );

      const ids = palettes.items.map(v => v.id);

      await modules.palette.tag.service.updatePaletteIds(tag, ids);
    }

    return {
      result: 'Success'
    };
  }
});
