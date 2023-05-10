export default defineNuxtConfig({
  extends: '@nuxt-themes/alpine',
  modules: [
    'nuxt-security',
    '@nuxtjs/plausible'
  ],
  security: {
    headers: {
      crossOriginEmbedderPolicy: 'unsafe-none',
      crossOriginOpenerPolicy: 'unsafe-none',
    }
  },
  plausible: {
    domain: 'marcduiker.dev'
  },
  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
    }
  }
})
