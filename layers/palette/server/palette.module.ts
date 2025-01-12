import { type Db } from 'mongodb';
import type { Logger } from 'pino';
import type { PaletteEntity, PaletteLikeEntity, PaletteTagEntity } from './entities/palette.entity';
import paletteConfig from './palette.config';
import { PaletteRepository } from './repositories/palette.repository';
import { PaletteService } from './services/palette.service';
import { PaletteValidation } from './validations/palette.validation';
import { PaletteLikeRepository } from './repositories/palette-like.repository';
import { PaletteLikeService } from './services/palette-like.service';
import { PaletteTagRepository } from './repositories/palette-tag.repository';
import { PaletteTagService } from './services/palette-tag.service';
import type { AIService } from '~/layers/ai/server/services/ai.service';

export interface PaletteModule {
  service: PaletteService
  validation: PaletteValidation
  like: {
    service: PaletteLikeService
  }
  tag: {
    service: PaletteTagService
  }
  setup: () => Promise<void>
}

/**
 * - loaded from main server initializer util in `~/server/utils/initialize-server.ts`
 * - can be used in api globally eg. `modules.notification.service.getById()`
 */

export function getPaletteModule(
  db: Db,
  logger: Logger,
  aiService: AIService
): PaletteModule {
  logger.info('initializing palette module');

  const likeCollection = db.collection<PaletteLikeEntity>(paletteConfig.likesCollectionName);
  const likeRepository = new PaletteLikeRepository(likeCollection);
  const likeService = new PaletteLikeService(likeRepository);

  const tagCollection = db.collection<PaletteTagEntity>(paletteConfig.tagCollectionName);
  const tagRepository = new PaletteTagRepository(tagCollection);
  const tagService = new PaletteTagService(tagRepository);

  const collection = db.collection<PaletteEntity>(paletteConfig.collectionName);
  const repository = new PaletteRepository(collection);
  const service = new PaletteService(repository, aiService, likeService, tagService);
  const validation = new PaletteValidation();

  return {
    service,
    validation,
    like: {
      service: likeService
    },
    tag: {
      service: tagService
    },
    setup: async () => {
      await Promise.all([
        repository.setup(),
        likeRepository.setup(),
        tagRepository.setup()
      ]);
    }
  };
}
