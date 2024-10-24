import { type Static, Type } from '@sinclair/typebox';

export const OgInputDtoSchema = Type.Object({
  colors: Type.String(),
  text: Type.String()
});

export type OgInputDto = Static<typeof OgInputDtoSchema>;

export const OgTagInputDtoSchema = Type.Object({
  tag: Type.String(),
  text: Type.String()
});

export type OgTagInputDto = Static<typeof OgTagInputDtoSchema>;
