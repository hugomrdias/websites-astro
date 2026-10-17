const notionHost = /(?:^|\.)notion\.(?:so|com|site)$/

// Notion page URLs end in the 32-hex page ID, optionally after a title slug,
// on any of Notion's hosts and with arbitrary query strings or block anchors.
export function notionPageId(url: string) {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return undefined
  }
  if (!notionHost.test(parsed.hostname)) return undefined
  return parsed.pathname
    .replace(/\/$/, '')
    .replaceAll('-', '')
    .match(/[0-9a-f]{32}$/i)?.[0]
    .toLowerCase()
}

// Notion sometimes stores pasted links as a Google search for the URL. Link to
// the cited source itself instead.
export function unwrapSearchLink(url: string) {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return url
  }
  const query = parsed.searchParams.get('q')?.trim()
  if (
    !/^(?:www\.)?google\.[a-z.]+$/.test(parsed.hostname) ||
    parsed.pathname !== '/search' ||
    !query ||
    !/^https?:\/\/\S+$/.test(query)
  )
    return url
  return query
}

export function articleIdKey(id: string) {
  return id.replaceAll('-', '').toLowerCase()
}
