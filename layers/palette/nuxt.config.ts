export default defineNuxtConfig({
  runtimeConfig: {
    palette: {
      collectionName: process.env.PALETTE_COLLECTION_NAME ?? 'palettes',
      likesCollectionName: process.env.LIKES_COLLECTION_NAME ?? 'palette_likes',
      tagCollectionName: process.env.TAG_COLLECTION_NAME ?? 'palette_tags',
      aiNamesStartDateMs: process.env.PALLETTE_AI_NAMES_START_DATE_MS !== undefined
        ? +process.env.PALLETTE_AI_NAMES_START_DATE_MS
        : 1729116912549
    }
  },
  nitro: {
    scheduledTasks: {
      /** @description runs at midnight every night */
      '0 * * * *': ['tags:update']
    }
  }
});
