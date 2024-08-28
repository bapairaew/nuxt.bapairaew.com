<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  class?: string;
  alt: string;
  src: string;
}>();

const imageProps = {
  ...props,
  class: `m-0 ${props.class || ""}`,
};
</script>

<template>
  <div class="aspect-[4/3] relative">
    <NuxtImg
      v-bind="imageProps"
      placeholder
      loading="lazy"
      fit="fill"
      class="absolute h-full w-full"
    />
  </div>
</template>
