import { TextFilter } from './text-filter.js'

if (!window.customElements.get(TextFilter.elementName)) {
    window.customElements.define(TextFilter.elementName, TextFilter, { extends: TextFilter.extendsElement })
}
