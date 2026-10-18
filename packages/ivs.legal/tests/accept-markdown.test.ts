import assert from 'node:assert/strict'
import { test } from 'node:test'
import { prefersMarkdown } from '../src/lib/accept-markdown.ts'

test('Markdown only when it ranks at least as high as HTML', () => {
  assert.equal(prefersMarkdown('text/markdown'), true)
  assert.equal(prefersMarkdown('text/markdown, text/html;q=0.9'), true)
  assert.equal(prefersMarkdown('Text/Markdown;q=0.5, */*;q=0.1'), true)
  assert.equal(prefersMarkdown('text/html, text/markdown;q=0.9'), false)
  assert.equal(prefersMarkdown('text/markdown;q=0'), false)
  assert.equal(
    prefersMarkdown(
      'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    ),
    false
  )
  assert.equal(prefersMarkdown('*/*'), false)
  // Wildcards rank HTML unless a more specific HTML range overrides them.
  assert.equal(prefersMarkdown('text/markdown;q=0.5, */*;q=0.8'), false)
  assert.equal(prefersMarkdown('text/markdown;q=0.5, text/*;q=0.8'), false)
  assert.equal(
    prefersMarkdown('text/markdown;q=0.5, text/html;q=0.1, */*;q=0.8'),
    true
  )
  assert.equal(prefersMarkdown('text/markdown, */*;q=0.8'), true)
  assert.equal(prefersMarkdown(null), false)
})
