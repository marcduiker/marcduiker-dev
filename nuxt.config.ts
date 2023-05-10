export default defineNuxtConfig({
  extends: '@nuxt-themes/alpine',
  modules: [
    '@nuxtjs/plausible'
  ],
  plausible: {
    domain: 'marcduiker.dev'
  },
  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    }
  }
})
