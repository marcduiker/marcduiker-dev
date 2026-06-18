import Image from '@11ty/eleventy-img';
import path from 'node:path';

const stringifyAttributes = attributeMap => {
  return Object.entries(attributeMap)
    .map(([attribute, value]) => {
      if (typeof value === 'undefined') return '';
      return `${attribute}="${value}"`;
    })
    .join(' ');
};

const errorSrcRequired = shortcodeName => {
  throw new Error(`src parameter is required for {% ${shortcodeName} %} shortcode`);
};

// Guards against invalid `loading` values. A common mistake is passing a widths
// array (e.g. [960]) into the positional `loading` slot, which would emit an
// invalid loading="960". Anything that isn't exactly 'eager' becomes 'lazy'.
export const normalizeLoading = value => (value === 'eager' ? 'eager' : 'lazy');

// Handles image processing
const processImage = async options => {
  let {
    src,
    alt = '',
    caption = '',
    loading = 'lazy',
    containerClass,
    imageClass,
    widths = [650, 960, 1400],
    sizes,
    formats = ['avif', 'webp', 'jpeg']
  } = options;

  loading = normalizeLoading(loading);

  // Set sizes based on loading (if not provided)
  if (sizes == null) {
    sizes = loading === 'lazy' ? 'auto' : '100vw';
  }

  // Prepend "./src" if not present
  if (!src.startsWith('./src')) {
    src = `./src${src}`;
  }

  const metadata = await Image(src, {
    widths: [...widths],
    formats: [...formats],
    urlPath: '/assets/images/',
    outputDir: './dist/assets/images/',
    // Preserve animation for animated sources (e.g. .gif). With `animated: true`,
    // eleventy-img reads every frame and auto-restricts the output of animated
    // images to animation-capable formats (webp/gif), dropping avif/jpeg. Static
    // images are unaffected. `limitInputPixels: false` allows large multi-frame GIFs.
    sharpOptions: {
      animated: true,
      limitInputPixels: false
    },
    filenameFormat: (id, src, width, format, options) => {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}-${width}w.${format}`;
    }
  });

  // Fallback <img src>: prefer a static raster format, but fall back to whatever
  // was generated (animated GIFs yield only webp, so metadata.jpeg is undefined).
  const fallbackFormat = metadata.jpeg || metadata.png || metadata.webp || Object.values(metadata)[0];
  const lowsrc = fallbackFormat[fallbackFormat.length - 1];

  const imageSources = Object.values(metadata)
    .map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat
        .map(entry => entry.srcset)
        .join(', ')}" sizes="${sizes}">`;
    })
    .join('\n');

  const imageAttributes = stringifyAttributes({
    'src': lowsrc.url,
    'width': lowsrc.width,
    'height': lowsrc.height,
    alt,
    loading,
    'decoding': loading === 'eager' ? 'sync' : 'async',
    ...(imageClass && {class: imageClass}),
    'eleventy:ignore': ''
  });

  const pictureElement = `<picture> ${imageSources}<img ${imageAttributes}></picture>`;

  return caption
    ? `<figure slot="image"${containerClass ? ` class="${containerClass}"` : ''}>${pictureElement}<figcaption>${caption}</figcaption></figure>`
    : `<picture slot="image"${containerClass ? ` class="${containerClass}"` : ''}>${imageSources}<img ${imageAttributes}></picture>`;
};

// Positional parameters (legacy)
// NOTE: parameter order matches this site's historical `{% image %}` call sites
// (src, alt, caption, loading, className, sizes, widths, formats) so existing
// markdown/njk usages keep working. Named params (imageKeys) use the new model.
export const imageShortcode = async (
  src,
  alt,
  caption,
  loading,
  className,
  sizes,
  widths,
  formats
) => {
  if (!src) {
    errorSrcRequired('image');
  }
  return processImage({
    src,
    alt,
    caption,
    loading,
    containerClass: className,
    widths,
    sizes,
    formats
  });
};

// Named parameters
export const imageKeysShortcode = async (options = {}) => {
  if (!options.src) {
    errorSrcRequired('imageKeys');
  }
  return processImage(options);
};
