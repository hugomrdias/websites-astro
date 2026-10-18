import { getImage } from 'astro:assets'
import type { ImageMetadata } from 'astro'
import defaultOgImage from '../images/og-image2.jpg'

// Astro hashes the processed file name, so JSON-LD must use this URL rather
// than a fixed path.
export async function ogImageUrl(
  site: URL | undefined,
  image: ImageMetadata = defaultOgImage
) {
  const { src } = await getImage({
    src: image,
    width: 1200,
    height: 630,
    fit: 'cover',
  })
  return new URL(src, site).href
}
