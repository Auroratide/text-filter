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
})
