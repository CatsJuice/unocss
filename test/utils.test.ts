import { mergeDeep } from '@unocss/core'
import { getComponent } from '@unocss/preset-mini/utils'
import { expect, it } from 'vitest'
import { getColorString } from '@unocss/vscode/utils'

it('mergeDeep', () => {
  expect(mergeDeep<any>({
    foo: true,
    bar: 1,
    arr: [1],
  }, {
    bar: {},
    arr: [2],
  } as any))
    .toMatchInlineSnapshot(`
      {
        "arr": [
          2,
        ],
        "bar": {},
        "foo": true,
      }
    `)

  expect(mergeDeep<any>({
    foo: true,
    bar: 1,
    arr: [1],
  }, {
    bar: {},
    arr: [2],
  } as any,
  true))
    .toMatchInlineSnapshot(`
      {
        "arr": [
          1,
          2,
        ],
        "bar": {},
        "foo": true,
      }
    `)
})

it('getComponents', () => {
  const fn1 = (s: string) => getComponent(s, '(', ')', ',')

  expect(fn1('comma,separated')).eql(['comma', 'separated'])
  expect(fn1('comma ,separated')).eql(['comma ', 'separated'])
  expect(fn1('comma, separated')).eql(['comma', ' separated'])
  expect(fn1('comma , separated ')).eql(['comma ', ' separated '])

  expect(fn1('first,')).eql(undefined)
  expect(fn1(',last')).eql(undefined)

  expect(fn1('comma,separated,')).eql(['comma', 'separated,'])
  expect(fn1('comma,separated,once')).eql(['comma', 'separated,once'])
  expect(fn1('comma(),separated(value)')).eql(['comma()', 'separated(value)'])
  expect(fn1('not(comma,separated)')).eql(['not(comma,separated)', ''])
})

it('getColorString', () => {
  const textAmber = `
  /* layer: default */
  .text-amber {
    --un-text-opacity: 1;
    color: rgba(251, 191, 36, var(--un-text-opacity));
  }`

  const textAmberImportant = `
  /* layer: default */
  .\!text-amber {
    --un-text-opacity: 1 !important;
    color: rgba(251, 191, 36, var(--un-text-opacity)) !important;
  }`

  const bgAmber = `
  /* layer: default */
  .bg-amber {
    --un-bg-opacity: 1;
    background-color: rgba(251, 191, 36, var(--un-bg-opacity));
  }`

  const bgAmberImportant = `
  /* layer: default */
  .\!bg-amber {
    --un-bg-opacity: 1 !important;
    background-color: rgba(251, 191, 36, var(--un-bg-opacity)) !important;
  }
  `

  expect(getColorString(textAmber)).eql('rgba(251, 191, 36, 1)')
  expect(getColorString(textAmberImportant)).eql('rgba(251, 191, 36, 1)')
  expect(getColorString(bgAmber)).eql('rgba(251, 191, 36, 1)')
  expect(getColorString(bgAmberImportant)).eql('rgba(251, 191, 36, 1)')
})
