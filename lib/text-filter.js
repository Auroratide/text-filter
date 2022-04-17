export class TextFilter extends HTMLInputElement {
    static elementName = 'text-filter'
    static extendsElement = 'input'

    #memoizedTarget = undefined

    static get observedAttributes() {
        return []
    }

    constructor() {
        super()

        this.addEventListener('input', () => {
            Array.from(this.target().children).forEach(li => {
                li.hidden = !li.textContent.includes(this.value)
            })
        })
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

    connectedCallback() {

    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name, oldValue, newValue) {

    }
}
