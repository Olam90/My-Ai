import { describe, expect, it, vi, beforeEach } from 'vitest'
import { askAI, formatPlainText } from './ai'

describe('formatPlainText', () => {
  it('removes markdown formatting and keeps readable plain text', () => {
    const result = formatPlainText('# Title\n\n**Hello**\n- item one\n- item two\n\n[link](https://example.com)')

    expect(result).toBe('Title\n\nHello\n• item one\n• item two\n\nlink')
  })
})

describe('askAI', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('uses the local /api/chat proxy route and Ollama chat payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: { content: 'Proxy response' } }),
    })

    vi.stubGlobal('fetch', fetchMock)

    const result = await askAI('Hello there')

    expect(fetchMock).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
      method: 'POST',
    }))

    const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(requestBody.model).toBe('gemma4:31b')
    expect(requestBody.messages[0].content).toBe('Hello there')
    expect(result).toBe('Proxy response')
  })
})
