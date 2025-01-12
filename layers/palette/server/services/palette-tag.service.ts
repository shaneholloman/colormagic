import { type AnyBulkWriteOperation } from 'mongodb';
import type { PaletteTagRepository } from '../repositories/palette-tag.repository';
import type { PaletteTagEntity } from '../entities/palette.entity';

export class PaletteTagService {
  constructor(
    private readonly repository: PaletteTagRepository
  ) {}

  public async bulkUpsert(tags: string[]): Promise<void> {
    const ops: Array<AnyBulkWriteOperation<PaletteTagEntity>> = tags.map(tag => ({
      updateOne: {
        filter: {
          tag: tag.toLowerCase()
        },
        update: {
          $set: {
            updatedAt: new Date()
          },
          $setOnInsert: {
            paletteIds: [],
            createdAt: new Date()
          }
        },
        upsert: true
      }
    }));

    await this.repository.bulkWrite(ops);
  }

  public async updatePaletteIds(tag: string, ids: string[]): Promise<void> {
    await this.repository.updatePalettesIdsByTag(tag, ids);
  }

  public async listPaletteIdsByTags(page: number, size: number, tags: string[]): Promise<string[]> {
    const entities = await this.repository.listPaletteIdsByTag(
      page,
      size,
      tags
    );

    return entities.map(v => v.toHexString());
  }
}
