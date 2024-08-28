<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
  href: {
    type: String,
    default: "",
  },
  target: {
    type: String as PropType<
      | "_blank"
      | "_parent"
      | "_self"
      | "_top"
      | (string & object)
      | null
      | undefined
    >,
    default: undefined,
    required: false,
  },
});

const isExternal = props.href.startsWith("http");
</script>

<template>
  <a v-if="isExternal" :href="href" target="_blank" rel="noopener noreferrer">
    <slot
  /></a>
  <NuxtLink v-else :href="href" :target="target">
    <slot />
  </NuxtLink>
</template>
