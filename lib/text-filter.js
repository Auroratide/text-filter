export class TextFilter extends HTMLInputElement {
    static elementName = 'text-filter'
    static extendsElement = 'input'
    static FILTER_COMPLETE_EVENT = 'text-filter:filter-complete'

    #memoizedTarget = undefined
    #itemMatches = (element, inputText) =>
        element.textContent.toLocaleLowerCase().includes(inputText.toLocaleLowerCase())

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

    get target() {
        if (this.#memoizedTarget === undefined)
            this.#connectTarget()
        return this.#memoizedTarget
    }

    get itemMatches() {
        return this.#itemMatches
    }
    set itemMatches(fn) {
        this.#itemMatches = fn
        this.doFilter()
    }

    doFilter = () => {
        this.#children(this.target).forEach(child => {
            child.hidden = !this.itemMatches(child, this.value)
        })

        this.dispatchEvent(new CustomEvent(TextFilter.FILTER_COMPLETE_EVENT))
    }

    connectedCallback() {
        this.#connectTarget()
        this.doFilter()
    }

    disconnectedCallback() {
        this.#targetChildrenChangedObserver.disconnect()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'for') {
            this.#disconnectTarget()
        }

        this.doFilter()
    }

    #connectTarget = () => {
        const target = document.getElementById(this.for) ?? undefined
        if (target !== undefined) {
            this.#targetChildrenChangedObserver.observe(target, {
                childList: true,
                subtree: target.tagName === 'TABLE',
                attributes: false,
                characterData: false,
            })
        }

        this.#memoizedTarget = target
    }

    #disconnectTarget = () => {
        const previousTarget = this.#memoizedTarget
        this.#unfilterAll(previousTarget)
        this.#targetChildrenChangedObserver.disconnect()
        this.#memoizedTarget = undefined
    }

    #unfilterAll = (target) => this.#children(target).forEach(child => {
        child.hidden = false
    })

    #children = (parent) => {
        if (parent === undefined)
            return []

        if (parent.tagName === 'TABLE')
            return Array.from(parent.querySelectorAll(':scope > tbody > tr'))

        return Array.from(parent.children)
    }

    #targetChildrenChangedObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                this.doFilter()
            }
        })
    })
}
