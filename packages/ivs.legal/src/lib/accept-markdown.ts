function quality(params: string[]) {
  const q = params.find((param) => param.trim().startsWith('q='))
  return q === undefined ? 1 : Number(q.trim().slice(2)) || 0
}

// True when the Accept header ranks Markdown at least as high as HTML.
// Browsers never list text/markdown, so they keep getting HTML.
export function prefersMarkdown(accept: string | null) {
  let markdown = 0
  let html = 0
  for (const range of accept?.toLowerCase().split(',') ?? []) {
    const [type, ...params] = range.split(';')
    if (type.trim() === 'text/markdown')
      markdown = Math.max(markdown, quality(params))
    if (type.trim() === 'text/html') html = Math.max(html, quality(params))
  }
  return markdown > 0 && markdown >= html
}
