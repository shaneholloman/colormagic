<template>
  <footer class="border-t mt-8 mb-44">
    <div class="max-w-3xl mx-auto px-4 py-8">
      <div class="mb-8 grid grid-cols-2 sm:grid-cols-[repeat(4,auto)] gap-4 justify-between">
        <!-- website -->
        <div>
          <p class="text-sm font-semibold mb-2">
            {{ $t('nav.website') }}
          </p>
          <ul class="flex flex-col gap-1">
            <li
              v-for="(item, index) in websiteLinks"
              :key="index"
            >
              <UButton
                :to="item.to"
                :label="item.label"
                :padded="false"
                active-class="text-primary"
                variant="soft"
                class="text-gray-400 hover:text-primary"
                size="md"
              />
            </li>
          </ul>
        </div>

        <!-- free tools -->
        <div>
          <p class="text-sm font-semibold mb-2">
            {{ $t('nav.freeColorTools') }}
          </p>
          <ul class="flex flex-col gap-1">
            <li
              v-for="(item, index) in toolsLinks"
              :key="index"
            >
              <UButton
                :to="item.to"
                :label="item.label"
                :padded="false"
                active-class="text-primary"
                variant="soft"
                class="text-gray-400 hover:text-primary"
                size="md"
              />
            </li>
          </ul>
        </div>

        <!-- more -->
        <div>
          <p class="text-sm font-semibold mb-2">
            {{ $t('nav.more') }}
          </p>
          <ul class="flex flex-col gap-1">
            <li
              v-for="(item, index) in moreLinks"
              :key="index"
            >
              <UButton
                :to="item.to"
                :label="item.label"
                :padded="false"
                active-class="text-primary"
                variant="soft"
                class="text-gray-400 hover:text-primary"
                size="md"
              />
            </li>
          </ul>
        </div>
      </div>

      <!-- copyright banner -->
      <div class="flex items-center gap-4 sm:justify-center flex-wrap">
        <!-- copyright label -->
        <p class="text-sm text-gray-400">
          © 2024 ColorMagic
        </p>

        <!-- languages -->
        <NuxtLink
          v-for="item in locales"
          :key="item.code"
          :to="switchLocalePath(item.code)"
          class="font-medium text-sm hover:text-primary"
          :class="{
            'text-black': locale === item.code,
            'text-gray-400': locale !== item.code
          }"
        >
          {{ item.flag }} {{ item.name }}
        </NuxtLink>
      </div>
    </div>

    <p class="text-center">
      Built by <a
        class="text-blue-400 underline"
        href="https://timb.com"
      >timb.com</a>
    </p>
  </footer>
</template>

<script setup lang="ts">
const { locales, locale, t } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();

const websiteLinks = computed(() => [
  {
    label: t('nav.home'),
    to: localePath('/')
  },
  {
    label: t('nav.explore'),
    to: localePath('/palette/explore')
  },
  {
    label: t('nav.exploreTags'),
    to: localePath('/palette/explore/tags')
  },
  {
    label: t('nav.liked'),
    to: localePath('/palette/liked')
  },
  {
    label: t('nav.shades'),
    to: localePath('/shades')
  },
  {
    label: t('nav.terms'),
    to: localePath('/terms')
  },
  {
    label: t('nav.privacy'),
    to: localePath('/privacy')
  }
]);

const toolsLinks = computed(() => [{
  to: localePath('/'),
  label: t('nav.colorPaletteGenrator')
},
{
  to: localePath('/random-color'),
  label: t('nav.randomColor')
},
{
  to: localePath('/image-color-picker'),
  label: t('nav.imageColorPicker')
},
{
  to: localePath('/contrast-checker'),
  label: t('nav.contrastChecker')
},
{
  to: localePath('/api'),
  label: t('nav.api')
}]);

const moreLinks = computed(() => [
  {
    label: 'Instagram',
    to: 'https://www.instagram.com/colormagic_app'
  },
  {
    label: t('nav.contact'),
    to: 'mailto:hello@colormagic.app'
  },
  {
    label: t('nav.suggestIdea'),
    to: 'https://colormagic.canny.io'
  },
  {
    label: 'GitHub',
    to: 'https://github.com/timb-103/colormagic'
  },
  {
    label: 'About',
    to: '/about'
  }
]);
</script>
