export default defineNuxtConfig({
  extends: '@nuxt-themes/alpine',
  modules: ['@nuxtjs/plausible', '@nuxtjs/sitemap'],

  plausible: {
    domain: 'marcduiker.dev'
  }
})
