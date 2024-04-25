<template>
    <AppLayout>
      <NuxtPage />
    </AppLayout>
  </template>
  
  <style>
  html {
    font-family: 'Open Sans', ui-sans-serif;
  }

  iframe {
    min-height: 0%; /* To fix itch.io iframe height */
  }

  h1 {
    padding-bottom: 1rem;
    border-bottom: 3px solid var(--typography-color-primary-100);
  }

  h3.title {
    font-variant-caps: all-small-caps;
  }

  .card {
    border: 3px solid var(--typography-color-primary-100) !important;
  }

  .biopics {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  </style>