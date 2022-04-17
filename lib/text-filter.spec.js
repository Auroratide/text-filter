import { fixture, expect } from '@open-wc/testing'
import './define.js'

const type = (text) => ({
    into: async (inputElement) => {
        text.split('').forEach(letter => {
            inputElement.value += letter
            inputElement.dispatchEvent(new InputEvent('input', {
                data: letter,
                inputType: 'insertText',
            }))
        })
    },
})

const visibleItems = (listElement) => Array.from(listElement.children)
    .filter(li => !li.hidden)

describe('text-filter', () => {
    it('simple unordered list', async () => {
        await fixture(`<div>
            <label for="text-filter">Filter</label>
            <input is="text-filter" for="list" id="text-filter" type="text" />
            <ul id="list">
                <li>Apple</li>
                <li>Orange</li>
                <li>Banana</li>
            </ul>
        </div>`)

        const input = document.getElementById('text-filter')
        const list = document.getElementById('list')

        await type('an').into(input)
        let result = visibleItems(list)
        expect(result).to.have.length(2)

        await type('g').into(input)
        result = visibleItems(list)
        expect(result).to.have.length(1)
    })

    it('input starts with a value', async () => {
        await fixture(`<div>
            <label for="text-filter">Filter</label>
            <input value="an" is="text-filter" for="list" id="text-filter" type="text" />
            <ul id="list">
                <li>Apple</li>
                <li>Orange</li>
                <li>Banana</li>
            </ul>
        </div>`)

        const list = document.getElementById('list')

        let result = visibleItems(list)
        expect(result).to.have.length(2)
    })

    it('no list attached to input', async () => {
        await fixture(`<div>
            <label for="text-filter">Filter</label>
            <input is="text-filter" id="text-filter" type="text" />
            <ul id="list">
                <li>Apple</li>
                <li>Orange</li>
                <li>Banana</li>
            </ul>
        </div>`)

        const input = document.getElementById('text-filter')
        const list = document.getElementById('list')

        // This is a silent failure
        await type('an').into(input)
        let result = visibleItems(list)
        expect(result).to.have.length(3)
    })

    it('list changed via for', async () => {
        await fixture(`<div>
            <label for="text-filter">Filter</label>
            <input for="fruit" value="or" is="text-filter" id="text-filter" type="text" />
            <ul id="fruit">
                <li>apple</li>
                <li>orange</li>
                <li>banana</li>
            </ul>
            <ul id="vegetables">
                <li>tomato</li>
                <li>carrot</li>
                <li>corn</li>
            </ul>
        </div>`)

        const input = document.getElementById('text-filter')
        const fruit = document.getElementById('fruit')
        const vegetables = document.getElementById('vegetables')

        expect(visibleItems(fruit)).to.have.length(1) // orange
        expect(visibleItems(vegetables)).to.have.length(3)

        input.for = 'vegetables'
        expect(visibleItems(fruit)).to.have.length(3)
        expect(visibleItems(vegetables)).to.have.length(1) // corn
    })

    it.skip('value of input programmatically mutated', async () => {
        // list updates
    })

    it.skip('list items added to list', async () => {
        // they are filtered as deemed appropriate
    })

    it.skip('input removed and readded to document', async () => {
        // when removed, filter unapplies
        // when added, filter reapplies
    })

    it.skip('filtering a table', async () => {
        // trs are filtered
    })
})
