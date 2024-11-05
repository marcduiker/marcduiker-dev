export default defineNuxtConfig({
  extends: '@nuxt-themes/alpine',

  modules: [
    '@nuxtjs/plausible',
    '@nuxthq/studio',
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

  compatibilityDate: '2024-11-04',
})