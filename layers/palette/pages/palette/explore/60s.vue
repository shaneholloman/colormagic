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
const tags = ['60s'];

const { title, description } = useExploreSeo({ tags });
</script>
