function quality(params: string[]) {
  const q = params.find((param) => param.trim().startsWith('q='))
  return q === undefined ? 1 : Number(q.trim().slice(2)) || 0
}

// The quality of the most specific range that matches, as RFC 9110 orders them.
function qualityOf(ranges: Map<string, number>, type: string) {
  return (
    ranges.get(type) ??
    ranges.get(`${type.split('/')[0]}/*`) ??
    ranges.get('*/*') ??
    0
  )
}

// True when the Accept header names Markdown and ranks it at least as high as
// HTML. Browsers never list text/markdown, so they keep getting HTML.
export function prefersMarkdown(accept: string | null) {
  const ranges = new Map<string, number>()
  for (const range of accept?.toLowerCase().split(',') ?? []) {
    const [type, ...params] = range.split(';')
    const name = type.trim()
    ranges.set(name, Math.max(ranges.get(name) ?? 0, quality(params)))
  }
  // A wildcard can make HTML acceptable, but only an explicit range asks for Markdown.
  const markdown = ranges.get('text/markdown') ?? 0
  return markdown > 0 && markdown >= qualityOf(ranges, 'text/html')
}
