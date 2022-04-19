# &lt;text-filter&gt; Input Element

Set up a text input to automatically filter a list of items live! When someone types into the input, the attached item list is filtered to only show items matching the text.

See the **[Live Demo](https://auroratide.github.io/text-filter/)** for some examples!

## Installation

You can import through CDN:

```html
<script type="module" src="https://unpkg.com/@auroratide/text-filter/lib/define.js"></script>
```

Or, you may install through [NPM](https://www.npmjs.com/package/@auroratide/text-filter) and include it as part of your build process:

```
$ npm i @auroratide/text-filter
```

```js
import '@auroratide/text-filter/lib/define.js'
```

## Usage

`text-filter` is a [customized built-in element](https://html.spec.whatwg.org/#custom-elements-customized-builtin-example) for the native `input` element.

```html
<input is="text-filter" for="my-list" type="text" />
<ul id="my-list">
    <li>An item</li>
    <li>Another item</li>
</ul>
```

The important thing is that the input is **linked** to a target list via the `for` attribute. This attribute should exactly equal the `id` value of the target list or table.

### All Attributes

| Attribute | Default | Description |
| ------------- | --------- | ------------- |
| for | - | The `id` of the target list or table |

## Javascript API

| Method | Description |
| ------------- | ------------- |
| doFilter | Force a refresh of the filter against the input text |

### Properties

* `for` - the id of the attached list or table
* `target` (readonly) - the attached list or table as an HTMLElement
* `itemMatches` - a function that determines whether a given list item matches the text
  * By default, this uses the `textContent` of the element

### Events

| Name | When Triggered |
| ------------- | ------------- |
| text-filter:filter-complete | Whenever the filter is finished processing after a change to either the input or attached list |

## Accessibility

Since this extends the native `input` element, `text-filter` inherits all the accessibility features of that element.
