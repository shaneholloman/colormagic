<template>
  <div>
    <!-- header-->
    <ExploreTagHeader
      :title="title"
      :description="description"
      :tags="tags"
    />

    <!-- palettes -->
    <ExplorePalettes
      :tags="tags"
    />

    <!-- images -->
    <ExploreTagImages :tags="tags" />
  </div>
</template>

<script setup lang="ts">
const tags = ['light', 'spring'];

const { title, description } = useExploreSeo({ tags });
</script>
