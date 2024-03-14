// https://nuxt.com/docs/api/configuration/nuxt-config
/** @type {import('tailwindcss').Config} */
export default defineNuxtConfig({
  modules: [
    '@nuxt/test-utils/module'
  ],
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
