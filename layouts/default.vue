<template>
  <!-- add padding at bottom for floating button -->
  <div>
    <NuxtLoadingIndicator color="#5576ff" />

    <div class="sticky top-0 z-10">
      <UButton
        to="https://instagram.com/colormagic_app"
        icon="fa6-brands-instagram"
        variant="soft"
        color="primary"
        class="rounded-none border-b"
        block
        target="_blank"
        size="md"
      >
        <span class="sm:hidden">Follow us on Instagram</span>
        <span class="hidden sm:inline-block">Follow us on Instagram for daily color palettes</span>
      </UButton>
    </div>

    <!-- nav -->
    <CommonNav />

    <!-- content -->
    <main>
      <div class="max-w-3xl mx-auto px-4 pt-8">
        <slot />
      </div>
    </main>

    <!-- footer -->
    <CommonFooter />

    <CarbonAdsStickyBar v-if="useRoute().path.includes('shade') === false" />

    <!-- global notifications -->
    <UNotifications>
      <template #description="{ description }">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="description" />
      </template>
    </UNotifications>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';

const { siteUrl } = useRuntimeConfig().public;
const { path } = useRoute();

const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
});

useHead({
  htmlAttrs: {
    lang: head.value.htmlAttrs.lang
  },
  link: [...(head.value.link ?? [])],
  meta: [...(head.value.meta ?? [])],
  script: [
    // { 'data-grow-initializer': '', children: '!(function(){window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),(window.growMe._=[]));var e=document.createElement("script");(e.type="text/javascript"),(e.src="https://faves.grow.me/main.js"),(e.defer=!0),e.setAttribute("data-grow-faves-site-id","U2l0ZTplMzFkMDUxNC0zOWE2LTRjZDMtOTE3NS0xNDEzMDBiNDRkMmU=");var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();' }
    // { src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6330271543159498', crossorigin: 'anonymous', async: true }
  ]
});

useServerSeoMeta({
  ogUrl: `${siteUrl}${path}`,
  ogType: 'website'
});

onMounted(() => {
  /** @description hack to always set to light mode until we add dark mode properly */
  const colorMode = useLocalStorage('nuxt-color-mode', 'light');
  colorMode.value = 'light';
  document.documentElement.classList.remove('dark');
});
</script>

<style>
#grow-me-root {
  display: none;
}
</style>
