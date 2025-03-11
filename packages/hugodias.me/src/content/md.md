# Markdown Reference

## Typography

The heading elements also have an increased top margin in order to break blocks of text up better.

# Heading 1

Dolor nisi magna do sint sit in esse ea Lorem dolore nisi incididunt culpa aute.

## Heading 2

Ullamco qui cupidatat minim consectetur eu ut excepteur cupidatat.

### Heading 3

Ullamco qui cupidatat minim consectetur eu ut excepteur cupidatat.

#### Heading 4

Ullamco qui cupidatat minim consectetur eu ut excepteur cupidatat.

##### Heading 5

Ullamco qui cupidatat minim consectetur eu ut excepteur cupidatat.

###### Heading 6

Ullamco qui cupidatat minim consectetur eu ut excepteur cupidatat.

There are a number of other typography elements that you can used. Some of the common ones are:

- All the standard stuff, like <strong>bold</strong>, <em>italic</em> and <u>underlined</u> text.
- <del>Deleted</del> text.
- <ins>Inserted</ins> text.
- <mark>Highlighted</mark> text.
- <small>Small</small> text.
- <sub>Subscript</sub> text.
- <sup>Superscript</sup> text.
- Abbreviations, like <abbr title="HyperText Markup Language">HTML</abbr> should be used with the <code>abbr</code> element.
- Citations, like <cite>&mdash; Mark Pilgrim (1956)</cite> should be used with the <code>cite</code> element.
- Definitions, like <dfn>HyperText Markup Language</dfn> should be used with the <code>dfn</code> element.
- <q>Quoted</q> text should be used with the <code>q</code> element.
- <var>Variable</var> text should be used with the <code>var</code> element.
- <kbd>ALT+F4</kbd> should be used with the <code>kbd</code> element.

> This is a blockquote.
> This is the second paragraph in the blockquote.
>
> -- This is a citation
>
> <footer>hello</footer>

## Divider `<hr/>`

---

## Lists

- George Washington
- John Adams
- Thomas Jefferson

---

1. James Madison
2. James Monroe
3. John Quincy Adams

---

1. First list item
   - First nested list item
     - Second nested list item

## GFM

### Autolink literals

www.example.com, https://example.com, and contact@example.com.

### Footnote

A note[^1]

[^1]: Big note.

Here's a simple footnote,[^2] and here's a longer one.[^bignote]

[^2]: This is the first footnote.

[^bignote]: Here's one with multiple paragraphs and code.

    Indent paragraphs to include them in the footnote.

    `{ my code }`

    Add as many paragraphs as you like.

### Table

| Syntax    | Description |   Test Text |
| :-------- | :---------: | ----------: |
| Header    |    Title    | Here's this |
| Paragraph |    Text     |    And more |

### Tasklist

- [ ] to do
- [x] done
- [ ] not done

## Github Alerts

> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

## Directives

### Badge

Hello this is a badge :badge[New]

### Figure and other

:::div{.Lightbox style="max-width: 100px; border-radius: 8px; border: 1px solid var(--border);"}
![A starry night sky.](../images/ucan.png 'UCAN logo')
:::

:::image-figure
![A starry night sky.](../images//lighthouse.png 'UCAN logo')
:::

## Code

```ts twoslash
// @errors: 2540
console.log((1 + 2 + 3 + 4).toFixed(2))
//                            ^|

/** A Basic Todo interface*/
interface Todo {
  title: string
}

const todo: Readonly<Todo> = {
  title: 'Delete inactive users',
  //  ^?
}

todo.title = 'Hello'
```
