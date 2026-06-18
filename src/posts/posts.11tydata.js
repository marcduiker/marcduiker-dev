import {getExcerpt} from '../_config/utils/excerpt.js';

export default {
  layout: 'post',
  tags: 'posts',
  permalink: '/articles/{{ title | slugify }}/index.html',
  eleventyComputed: {
    // Use an explicit frontmatter `description` when present and non-empty;
    // otherwise derive one from the post body; finally fall back to the site description.
    description: data => {
      const explicit = (data.description || '').trim();
      if (explicit) return explicit;
      const derived = getExcerpt(data.page && data.page.rawInput);
      return derived || data.meta.siteDescription;
    }
  }
};
