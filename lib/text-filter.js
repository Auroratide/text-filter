export class TextFilter extends HTMLInputElement {
    static elementName = 'text-filter'
    static extendsElement = 'input'
    static FILTER_COMPLETE_EVENT = 'text-filter:filter-complete'

    #memoizedTarget = undefined

    static get observedAttributes() {
        return ['for', 'value']
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

    get value() {
        return super.value
    }
    set value(v) {
        super.value = v
        this.doFilter()
    }

    target() {
        if (this.#memoizedTarget === undefined)
            this.#connectTarget(document.getElementById(this.for))
        return this.#memoizedTarget
    }

    doFilter = () => {
        Array.from(this.target()?.children ?? []).forEach(li => {
            li.hidden = !li.textContent.includes(this.value)
        })

        this.dispatchEvent(new CustomEvent(TextFilter.FILTER_COMPLETE_EVENT))
    }

    connectedCallback() {
        this.doFilter()
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'for') {
            const previousTarget = this.#memoizedTarget
            this.#disconnectTarget(previousTarget)

            this.#memoizedTarget = undefined
        }

        this.doFilter()
    }

    #connectTarget = (target) => {
        this.#memoizedTarget = target
    }

    #disconnectTarget = (target) => {
        this.#unfilterAll(target)
    }

    #unfilterAll = (target) => Array.from(target?.children ?? []).forEach(li => {
        li.hidden = false
    })
}
