export default defineAppConfig({
  alpine: {
    title: 'Marc Duiker - My place on the web',
    description: 'I ❤️ Serverless, Event-Driven, DevCommunities, and Creative Coding.',
    image: {
      src: '/social-card-preview.png',
      alt: 'An image showcasing my project.',
      width: 400,
      height: 300
    },
    header: {
      position: 'right', // possible value are : | 'left' | 'center' | 'right'
      logo: {
        path: '/marcduiker_name_anim.gif', // path of the logo
        pathDark: '/marcduiker_name_anim.gif', // path of the logo in dark mode, leave this empty if you want to use the same logo
        alt: 'Marc Duiker' // alt of the logo
      }
    },
    footer: {
      credits: {
        enabled: false, // possible value are : true | false
        repository: 'https://www.github.com/nuxt-themes/alpine' // our github repository
      },
      navigation: true, // possible value are : true | false
      alignment: 'center', // possible value are : 'none' | 'left' | 'center' | 'right'
      message: 'Follow me on' // string that will be displayed in the footer (leave empty or delete to disable)
    },
    socials: {
      twitter: 'marcduiker',
      github: 'marcduiker',
      youtube: 'marcduiker',
      linkedin: {
        icon: 'uil:linkedin',
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/mduiker/'
      },
      mastodon: {
        icon: 'uil:comment',
        label: 'Mastodon',
        href: 'https://mstdn.social/@marcduiker'
      },
      devto: {
        icon: 'uil:pen',
        label: 'dev.to',
        href: 'https://dev.to/marcduiker'
      }
    },
    form: {
      successMessage: 'Message sent. Thank you!'
    }
  }
})
