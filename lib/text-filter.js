const html = `<p>Hello</p>`

const css = `p { color: red; }`

export class TextFilter extends HTMLElement {
    static elementName = 'text-filter'

    static get observedAttributes() {
        return []
    }

    constructor() {
        super()

        this
            .attachShadow({ mode: 'open' })
            .innerHTML = `<style>${css}</style>${html}`
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name, oldValue, newValue) {

    }
}
