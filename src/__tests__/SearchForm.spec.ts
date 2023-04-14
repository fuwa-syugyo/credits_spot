import SearchForm from '../components/SearchForm.vue'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/vue'
import { fireEvent } from '@testing-library/dom'

describe('SearchForm', () => {
  afterEach(cleanup)
  it('入力フォームが表示される', () => {
    const { container } = render(SearchForm)
    const input = container.querySelector('input')
    expect(input).toBeTruthy()
  }),

  it('検索ボタンが表示される', () => {
    render(SearchForm)
    const button = screen.getByRole('button', {name: '検索'})
    expect(button).toBeTruthy()
  }),

  it('検索ボタンを押してtermをfetchリクエストに送る?', async() => {
    render(SearchForm)
    await searchRecord("残酷な天使のテーゼ")
    const button = screen.getByRole('button', {name: '検索'})

    expect(button).toBeTruthy()
  })
})

async function searchRecord(term: string) {
  const searchWord = screen.getByRole('button', {name: '検索'})
  await fireEvent.timeUpdate(searchWord, term)
}
