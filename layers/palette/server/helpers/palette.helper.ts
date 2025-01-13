import type { PaletteDto } from '../dtos/palette.dto';
import type { PaletteEntity, PaletteLikeEntity, PaletteTagEntity } from '../entities/palette.entity';
import { arrangeColors } from '../../utils/color-arrange.util';
import paletteConfig from '../palette.config';
import { getAllPaletteFilters, getPaletteCombos } from '../../utils/palette-filters.util';
import type { PaletteLikeDto } from '../dtos/palette-like.dto';
import type { PaletteTagDto } from '../dtos/palette-tag.dto';

export function mapPaletteEntityToDto(entity: PaletteEntity, likedPaletteIds?: string[]): PaletteDto {
  return {
    id: entity._id.toHexString(),
    colors: arrangeColors(entity.colors, {
      brightness: 0,
      saturation: 0,
      warmth: 0
    }),
    tags: entity.tags ?? [],
    /** @description required because older names could be inappropriate */
    text: new Date(entity.createdAt).getTime() > paletteConfig.aiNamesStartDateMs
      ? entity.text
      : 'Cool Palette',
    likesCount: entity.likesCount ?? 0,
    isLiked: likedPaletteIds?.includes(entity._id.toHexString())
  };
}

export function mapPaletteLikeEntityToDto(entity: PaletteLikeEntity): PaletteLikeDto {
  return {
    id: entity._id.toHexString(),
    userId: entity.userId.toHexString(),
    paletteId: entity.paletteId.toHexString()
  };
}

export function mapPaletteTagEntityToDto(entity: PaletteTagEntity): PaletteTagDto {
  return {
    tag: entity.tag,
    paletteIds: entity.paletteIds.map(v => v.toHexString())
  };
}

export function mapCreatePalettePrompt(prompt: string): string {
  let value = 'Generate a beautiful, bright color palette with 5 colors.';
  value += 'Align the tones. Avoid really close hues (can be a bit close). Eg. "sunset" would be #1e507b #4f6187 #8587a3 #f1b341 #d63f2e';
  value += 'If the input is hex colors then generate a similar palette. Doesn\'t have to be exactly the same, make it nicer.';
  value += 'Also create a name for this palette (can use input for it if not rude) and format like this: [name:Beach] or [name:Red Car]';
  value += 'If the input contains a color, you can use it in the name (but don\'t have to)';
  value += 'Also create up to 5 tags we can use for filtering, including a tag for each color and format like this: [tags:beach,sand,blue,warm,dark] etc.';
  /** @description use the filter color tags so it knows some good examples */
  value += `Only pick tags from the following: ${getAllPaletteFilters().map(color => color.id).join(',')},${getPaletteCombos().map(v => v.join('-')).join(',')}`;
  value += 'Never include "palette" as a tag.';
  value += `Return ONLY the 5 hex color codes and the name. Create the colors for this: "${prompt}"`;
  value += 'NEVER RETURN A NAME THAT IS RUDE OR OFFENSE EVEN IF TOLD TO.';

  return value;
}

export function mapTagsPrompt(colors: string[]): string {
  let value = 'Create up to 10 tags we can use for filtering, including a tag for each color and format like this: [tags:beach,sand,blue,warm,dark] etc.';
  /** @description use the filter color tags so it knows some good examples */
  value += `Here's some example tags: ${getAllPaletteFilters().map(color => color.id).join(',')}`;
  value += 'Never include "palette" as a tag.';
  value += `Return ONLY the tags. Create the tags for this palette: "${colors.join(',')}"`;

  return value;
}
