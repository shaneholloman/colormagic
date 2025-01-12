import { ObjectId, type AnyBulkWriteOperation, type Collection } from 'mongodb';
import type { PaletteTagEntity } from '../entities/palette.entity';

export class PaletteTagRepository {
  constructor(private readonly collection: Collection<PaletteTagEntity>) {}

  public async setup(): Promise<void> {
    await this.collection.createIndexes([{
      key: { tag: 1 }
    }, {
      key: { paletteIds: 1 }
    }], { background: true });
  }

  public async updatePalettesIdsByTag(tag: string, ids: string[]): Promise<void> {
    await this.collection.updateOne({ tag }, {
      $set: {
        paletteIds: ids.map(v => new ObjectId(v))
      }
    });
  }

  public async bulkWrite(ops: Array<AnyBulkWriteOperation<PaletteTagEntity>>): Promise<void> {
    await this.collection.bulkWrite(ops);
  }

  public async listPaletteIdsByTag(page: number, size: number, tags: string[]): Promise<ObjectId[]> {
    const entities = await this.collection
      .find({ tag: { $in: tags } }, { projection: { paletteIds: 1 } })
      .toArray();

    if (entities.length === 0) {
      return [];
    }

    const idsArrays = entities.map(result => result.paletteIds ?? []);
    const intersectedIds = idsArrays.reduce((intersection, ids) =>
      intersection.filter(id => ids.some(otherId => otherId.equals(id)))
    );

    return intersectedIds.slice(page * size, (page * size) + size);
  }
}
