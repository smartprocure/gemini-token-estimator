import { describe, expect, it } from 'vitest'

import { getTokenCount, tokenize, truncateTextToMaxTokens } from './index.js'

describe('tokenize', () => {
  const JSON = '{"_index": "bid-data"}'
  const tokenizedJSON = ['{"_', 'index', '":', ' "', 'bid', '-', 'data', '"}']
  it('should tokenize text', () => {
    // Sentences
    expect(tokenize('Hello, world!')).toEqual(['Hello', ',', ' world', '!'])
    expect(tokenize("It's Monday.")).toEqual(['It', "'", 's', ' Monday', '.'])
    // Abbreviations
    expect(tokenize('www')).toEqual(['www'])
    expect(tokenize('http')).toEqual(['http'])
    expect(tokenize('https')).toEqual(['https'])
    // Consonants
    expect(tokenize('bc')).toEqual(['bc'])
    expect(tokenize('BC')).toEqual(['BC'])
    // Camel casing
    expect(tokenize('agencyStateName')).toEqual(['agency', 'State', 'Name'])
    // Pascal casing
    expect(tokenize('AgencyStateName')).toEqual(['Agency', 'State', 'Name'])
    // Whitespace
    expect(tokenize('foo bar')).toEqual(['foo', ' bar'])
    expect(tokenize('a     b')).toEqual(['a', '     ', 'b'])
    // Repeated whitespace
    expect(tokenize('\n\n\n\n\n')).toEqual(['\n\n\n\n\n'])
    expect(tokenize('\n\n\t\t  \r\r')).toEqual(['\n\n', '\t\t', '  ', '\r\r'])
    // JSON
    expect(tokenize(JSON)).toEqual(tokenizedJSON)
    // Currency
    expect(tokenize('$12.52')).toEqual(['$', '1', '2', '.', '5', '2'])
    // Numbers
    expect(tokenize('123456')).toEqual(['1', '2', '3', '4', '5', '6'])
    // Long words
    expect(tokenize('Aaaaaaaaaaa')).toEqual(['Aaaaaaaaa', 'aa'])
    expect(tokenize('aaaaaaaaaaa')).toEqual(['aaaaaaaaa', 'aa'])
    expect(tokenize('AAAAAAAAAAA')).toEqual(['AAAAAAAAA', 'AA'])
    expect(tokenize('bcdfgh')).toEqual([ 'bc', 'df', 'gh' ])
    expect(tokenize('BCDFGH')).toEqual([ 'BC', 'DF', 'GH' ])
    // Repeated special characters
    expect(tokenize('------------------')).toEqual(['----------------', '--'])
    expect(tokenize('..................')).toEqual(['................', '..'])
    expect(tokenize('==================')).toEqual(['================', '=='])
    expect(tokenize('##################')).toEqual(['################', '##'])
    expect(tokenize('__________________')).toEqual(['________________', '__'])
    expect(tokenize('==##--')).toEqual(['==', '##', '--'])
    // Brackets
    expect(tokenize('[]{}()')).toEqual(['[]', '{}', '()'])
    // Unicode characters
    expect(tokenize('©®♥')).toEqual(['©', '®', '♥'])
  })
  it('should preserve all chracters when tokenizing', () => {
    expect(tokenize(JSON).join('')).toEqual(JSON)
  })
})
describe('getTokenCount', () => {
  it('should count tokens', () => {
    const text = 'Hello, world!'
    expect(getTokenCount(text)).toEqual(4)
  })
})
describe('truncateTextToMaxTokens', () => {
  it('should truncate text', () => {
    const text = 'Hello, world!'
    const result = truncateTextToMaxTokens(text, 2)
    expect(result).toEqual({
      truncatedText: 'Hello,',
      truncatedTokenCount: 2,
    })
  })
  it('should preserve text if maxTokens >= actual tokens', () => {
    const text = 'Hello, world!'
    const expected = { truncatedText: text, truncatedTokenCount: 4 }
    expect(truncateTextToMaxTokens(text, 4)).toEqual(expected)
    expect(truncateTextToMaxTokens(text, 5)).toEqual(expected)
  })
})
