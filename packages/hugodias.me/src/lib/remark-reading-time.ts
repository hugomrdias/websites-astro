import getReadingTime from 'reading-time'
import { toString as mdastToString } from 'mdast-util-to-string'

export function remarkReadingTime() {
  return (
    tree: unknown,
    file: {
      data: {
        astro?: {
          headings?: unknown
          localImagePaths?: string[]
          remoteImagePaths?: string[]
          frontmatter?: Record<string, unknown>
        }
      }
    }
  ) => {
    const textOnPage = mdastToString(
      tree as Parameters<typeof mdastToString>[0]
    )
    const readingTime = getReadingTime(textOnPage)

    // readingTime.text will give us minutes read as a friendly string,
    // i.e. "3 min read"
    file.data.astro = {
      ...file.data.astro,
      frontmatter: {
        ...file.data.astro?.frontmatter,
        minutesRead: readingTime.text,
      },
    }
  }
}
