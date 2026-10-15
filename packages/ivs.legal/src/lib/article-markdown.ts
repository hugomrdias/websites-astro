// Fenced code blocks and inline code spans, which must stay verbatim.
const code = /(^```[\s\S]*?(?:^```[^\S\n]*$|(?![\s\S]))|`[^`\n]*`)/m
const voidTag = /<(br|hr|img|wbr)\b((?:[^<>/]|\/(?!>))*?)\s*>/gi

// Notion writes Shift+Enter line breaks as `<br>`. Notro compiles articles as
// MDX, which treats an unclosed `<br>` as JSX waiting for `</br>` and fails, so
// self-close void tags before rendering.
export function normalizeArticleMarkdown(markdown: string) {
  return markdown
    .split(code)
    .map((part, i) => (i % 2 === 1 ? part : part.replace(voidTag, '<$1$2 />')))
    .join('')
}
