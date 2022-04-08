import { fixture, expect } from '@open-wc/testing'
import './define.js'

describe('text-filter', () => {
    it('works', async () => {
        const el = await fixture(`<text-filter></text-filter>`)

        expect(el.shadowRoot.textContent).to.contain('Hello')
    })
})
