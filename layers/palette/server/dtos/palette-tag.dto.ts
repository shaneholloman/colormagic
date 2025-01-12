import { type Static, Type } from '@sinclair/typebox';

export const PaletteTagDtoSchema = Type.Object({
  tag: Type.String(),
  paletteIds: Type.Array(Type.String({ pattern: '^[0-9a-fA-F]{24}$' }))
});

export type PaletteTagDto = Static<typeof PaletteTagDtoSchema>;

export const GetPaletteTagsInputDtoSchema = Type.Object({
  tag: Type.Array(Type.String())
});

export type GetPaletteTagsInputDto = Static<typeof GetPaletteTagsInputDtoSchema>;
