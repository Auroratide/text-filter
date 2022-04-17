export class TextFilter extends HTMLInputElement {
    static elementName = 'text-filter'
    static extendsElement = 'input'

    #memoizedTarget = undefined

    static get observedAttributes() {
        return []
    }

    constructor() {
        super()

        this.addEventListener('input', this.doFilter)
    }

    get for() {
        return this.getAttribute('for')
    }
    set for(value) {
        this.setAttribute('for', value)
    }

    target() {
        if (this.#memoizedTarget === undefined)
            this.#memoizedTarget = document.getElementById(this.for)
        return this.#memoizedTarget
    }

    doFilter = () => {
        Array.from(this.target().children).forEach(li => {
            li.hidden = !li.textContent.includes(this.value)
        })
    }

    connectedCallback() {
        this.doFilter()
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name, oldValue, newValue) {

    }
}
