import topLevelAwait from "vite-plugin-top-level-await";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/image", "@nuxt/content"],
  css: ["@/assets/css/global.css"],
  typescript: {
    typeCheck: true,
  },
  experimental: {
    componentIslands: true,
  },
  content: {
    markdown: {
      anchorLinks: false,
    },
  },
  vite: {
    plugins: [topLevelAwait()],
  },
});
