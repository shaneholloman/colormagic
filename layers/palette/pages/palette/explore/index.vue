<template>
  <div>
    <!-- header-->
    <ExploreTagHeader
      :title="title"
      :description="description"
    />

    <!-- palettes -->
    <ExplorePalettes
      :tags="[]"
    />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const { title, description } = useExploreSeo({
  title: t('explore.title'),
  description: t('explore.seoDescription'),
  ogImageUrl: `${useRuntimeConfig().public.siteUrl}/img/og.png`
});
</script>
