import { fixture, expect, oneEvent } from '@open-wc/testing'
import { TextFilter } from './text-filter.js'
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
    describe('types of filterable elements', () => {
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

        it.skip('filtering a table', async () => {
            // trs are filtered
        })
    })

    describe('initial configurations', () => {
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
    })

    describe('input mutations', () => {
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

        it('value of input programmatically mutated', async () => {
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

            input.value = 'an'
            let result = visibleItems(list)
            expect(result).to.have.length(2)
        })

        it('value of input changed as attribute', async () => {
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

            input.setAttribute('value', 'an')
            let result = visibleItems(list)
            expect(result).to.have.length(2)
        })
    })

    describe('list mutations', () => {
        it('list items added to list', async () => {
            const addItem = (list, text) => {
                const li = document.createElement('li')
                li.textContent = text
                list.appendChild(li)
            }

            await fixture(`<div>
                <label for="text-filter">Filter</label>
                <input value="b" is="text-filter" for="list" id="text-filter" type="text" />
                <ul id="list">
                    <li>apple</li>
                    <li>orange</li>
                    <li>banana</li>
                </ul>
            </div>`)

            document.getElementById('text-filter')
            const input = document.getElementById('text-filter')
            const list = document.getElementById('list')

            expect(visibleItems(list)).to.have.length(1) // banana

            addItem(list, 'lime')
            await oneEvent(input, TextFilter.FILTER_COMPLETE_EVENT)
            expect(visibleItems(list)).to.have.length(1) // banana

            addItem(list, 'blueberry')
            await oneEvent(input, TextFilter.FILTER_COMPLETE_EVENT)
            expect(visibleItems(list)).to.have.length(2) // banana, blueberry
        })

        it.skip('rows added to table', async () => {

        })
    })
})
