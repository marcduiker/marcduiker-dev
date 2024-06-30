export default defineNuxtConfig({
  extends: '@nuxt-themes/alpine',
  modules: [
    '@nuxtjs/plausible',
    ['@nuxtjs/google-fonts', {
      families: {
        'Open+Sans': true,
      }
    }],
  ],
  plausible: {
    domain: 'marcduiker.dev'
  },
  nitro: {
    prerender: {
      failOnError: false, 
      routes: ['/sitemap.xml']
    }
  },
})
