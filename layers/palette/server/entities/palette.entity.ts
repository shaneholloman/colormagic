import type { ObjectId } from 'mongodb';

export interface PaletteEntity {
  _id: ObjectId
  colors: [string, string, string, string, string]
  text: string
  tags?: string[]
  likesCount?: number
  createdAt: Date
}

export type CreatablePaletteEntity = Omit<PaletteEntity, '_id'>;

export interface PaletteLikeEntity {
  _id: ObjectId
  paletteId: ObjectId
  userId: ObjectId
  createdAt: Date
}

export type CreatablePaletteLikeEntity = Omit<PaletteLikeEntity, '_id'>;

export interface PaletteTagEntity {
  _id: ObjectId
  tag: string
  paletteIds: ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export type CreatablePaletteTagEntity = Omit<PaletteTagEntity, '_id'>;
