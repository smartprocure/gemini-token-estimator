import { describe, expect, it } from 'vitest'

import { getTokenCount, tokenize, truncateTextToMaxTokens } from './index.js'

describe('tokenize', () => {
  const JSON = '{"_index": "bid-data"}'
  it('should tokenize sentences', () => {
    expect(tokenize('Hello, world!')).toEqual(['Hello', ',', ' world', '!'])
    expect(tokenize("It's Monday.")).toEqual(['It', "'", 's', ' Monday', '.'])
  })
  it('should tokenize common abbreviations', () => {
    expect(tokenize('www')).toEqual(['www'])
    expect(tokenize('http')).toEqual(['http'])
    expect(tokenize('https')).toEqual(['https'])
  })
  it('should tokenize consonant pairs', () => {
    expect(tokenize('bc')).toEqual(['bc'])
    expect(tokenize('BC')).toEqual(['BC'])
  })
  it('should split based on casing', () => {
    // Camel casing
    expect(tokenize('agencyStateName')).toEqual(['agency', 'State', 'Name'])
    // Pascal casing
    expect(tokenize('AgencyStateName')).toEqual(['Agency', 'State', 'Name'])
  })
  it('should tokenize numbers', () => {
    // Currency
    expect(tokenize('$12.52')).toEqual(['$', '1', '2', '.', '5', '2'])
    // Numbers
    expect(tokenize('123456')).toEqual(['1', '2', '3', '4', '5', '6'])
  })
  it('should tokenize JSON', () => {
    const tokenizedJSON = ['{"_', 'index', '":', ' "', 'bid', '-', 'data', '"}']
    expect(tokenize(JSON)).toEqual(tokenizedJSON)
  })
  it('should tokenize long words', () => {
    expect(tokenize('Aaaaaaaaaaa')).toEqual(['Aaaaaaaaa', 'aa'])
    expect(tokenize('aaaaaaaaaaa')).toEqual(['aaaaaaaaa', 'aa'])
    expect(tokenize('AAAAAAAAAAA')).toEqual(['AAAAAAAAA', 'AA'])
    expect(tokenize('bcdfgh')).toEqual(['bc', 'df', 'gh'])
    expect(tokenize('BCDFGH')).toEqual(['BC', 'DF', 'GH'])
  })
  it('should tokenize repeated special characters', () => {
    expect(tokenize('------------------')).toEqual(['----------------', '--'])
    expect(tokenize('..................')).toEqual(['................', '..'])
    expect(tokenize('==================')).toEqual(['================', '=='])
    expect(tokenize('##################')).toEqual(['################', '##'])
    expect(tokenize('__________________')).toEqual(['________________', '__'])
    expect(tokenize('==##--')).toEqual(['==', '##', '--'])
  })
  it('should tokenize brackets', () => {
    expect(tokenize('[]{}()')).toEqual(['[]', '{}', '()'])
  })
  it('should tokenize unicode characters', () => {
    expect(tokenize('©®♥')).toEqual(['©', '®', '♥'])
    expect(tokenize('��������')).toEqual(['�����','���'])
  })
  it('should tokenize non-Latin characters', () => {
    console.dir(tokenize('використання порталу постачальників'))
    expect(tokenize('використання порталу постачальників')).toEqual([
      'викор',
      'истан',
      'ня',
      ' порта',
      'лу',
      ' поста',
      'чальн',
      'иків',
    ])
  })
  it('should tokenize French text correctly', () => {
    const frenchText =
      "Bonjour le monde. C'est un très beau jour aujourd'hui. J'espère que vous allez bien. Voilà une façon différente d'écrire avec des accents et des œuvres d'art. Où est le café? À bientôt!"
    const tokens = tokenize(frenchText)

    const expectedTokens = [
      'Bonjour',
      ' le',
      ' monde',
      '.',
      ' ',
      'C',
      "'",
      'est',
      ' un',
      ' très',
      ' beau',
      ' jour',
      ' aujourd',
      "'",
      'hui',
      '.',
      ' ',
      'J',
      "'",
      'espère',
      ' que',
      ' vous',
      ' allez',
      ' bien',
      '.',
      ' Voilà',
      ' une',
      ' façon',
      ' différent',
      'e',
      ' ',
      'd',
      "'",
      'écrire',
      ' avec',
      ' des',
      ' accents',
      ' et',
      ' des',
      ' œuvres',
      ' ',
      'd',
      "'",
      'art',
      '.',
      ' Où',
      ' est',
      ' le',
      ' café',
      '?',
      ' À',
      ' bientôt',
      '!',
    ]
    expect(tokens).toEqual(expectedTokens)
  })
  it('should tokenize uppercase French text correctly', () => {
    const frenchTextUpper =
      "BONJOUR LE MONDE. C'EST UN TRÈS BEAU JOUR AUJOURD'HUI. J'ESPÈRE QUE VOUS ALLEZ BIEN. VOILÀ UNE FAÇON DIFFÉRENTE D'ÉCRIRE AVEC DES ACCENTS ET DES ŒUVRES D'ART. OÙ EST LE CAFÉ? À BIENTÔT!"
    const tokens = tokenize(frenchTextUpper)

    const expectedTokens = [
      'BONJOUR',
      ' LE',
      ' MONDE',
      '.',
      ' ',
      'C',
      "'",
      'EST',
      ' UN',
      ' TRÈS',
      ' BEAU',
      ' JOUR',
      ' AUJOURD',
      "'",
      'HUI',
      '.',
      ' ',
      'J',
      "'",
      'ESPÈRE',
      ' QUE',
      ' VOUS',
      ' ALLEZ',
      ' BIEN',
      '.',
      ' VOILÀ',
      ' UNE',
      ' FAÇON',
      ' DIFFÉRENT',
      'E',
      ' ',
      'D',
      "'",
      'ÉCRIRE',
      ' AVEC',
      ' DES',
      ' ACCENTS',
      ' ET',
      ' DES',
      ' ŒUVRES',
      ' ',
      'D',
      "'",
      'ART',
      '.',
      ' OÙ',
      ' EST',
      ' LE',
      ' CAFÉ',
      '?',
      ' À',
      ' BIENTÔT',
      '!',
    ]
    expect(tokens).toEqual(expectedTokens)
  })
  it('should tokenize Spanish text correctly', () => {
    const spanishText =
      'Hola, ¿cómo estás? El niño juega en el jardín. La señora compró manzanas. Mañana tenemos una reunión importante. El español utiliza acentos y la letra ñ. ¡Qué día tan maravilloso!'
    const tokens = tokenize(spanishText)

    const expectedTokens = [
      'Hola',
      ',',
      ' ',
      '¿',
      'cómo',
      ' estás',
      '?',
      ' El',
      ' niño',
      ' juega',
      ' en',
      ' el',
      ' jardín',
      '.',
      ' La',
      ' señora',
      ' compró',
      ' manzanas',
      '.',
      ' Mañana',
      ' tenemos',
      ' una',
      ' reunión',
      ' important',
      'e',
      '.',
      ' El',
      ' español',
      ' utiliz',
      'a',
      ' acentos',
      ' y',
      ' la',
      ' letra',
      ' ',
      'ñ',
      '.',
      ' ',
      '¡',
      'Qué',
      ' día',
      ' tan',
      ' maravill',
      'oso',
      '!',
    ]
    expect(tokens).toEqual(expectedTokens)
  })

  it('should tokenize uppercase Spanish text correctly', () => {
    const spanishTextUpper =
      'HOLA, ¿CÓMO ESTÁS? EL NIÑO JUEGA EN EL JARDÍN. LA SEÑORA COMPRÓ MANZANAS. MAÑANA TENEMOS UNA REUNIÓN IMPORTANTE. EL ESPAÑOL UTILIZA ACENTOS Y LA LETRA Ñ. ¡QUÉ DÍA TAN MARAVILLOSO!'
    const tokens = tokenize(spanishTextUpper)

    const expectedTokens = [
      'HOLA',
      ',',
      ' ',
      '¿',
      'CÓMO',
      ' ESTÁS',
      '?',
      ' EL',
      ' NIÑO',
      ' JUEGA',
      ' EN',
      ' EL',
      ' JARDÍN',
      '.',
      ' LA',
      ' SEÑORA',
      ' COMPRÓ',
      ' MANZANAS',
      '.',
      ' MAÑANA',
      ' TENEMOS',
      ' UNA',
      ' REUNIÓN',
      ' IMPORTANT',
      'E',
      '.',
      ' EL',
      ' ESPAÑOL',
      ' UTILIZ',
      'A',
      ' ACENTOS',
      ' Y',
      ' LA',
      ' LETRA',
      ' ',
      'Ñ',
      '.',
      ' ',
      '¡',
      'QUÉ',
      ' DÍA',
      ' TAN',
      ' MARAVILL',
      'OSO',
      '!',
    ]
    expect(tokens).toEqual(expectedTokens)
  })
  it('should tokenize German text correctly', () => {
    const germanText =
      'Guten Tag! Wie geht es Ihnen? Ich möchte ein Stück Käse kaufen. Die Straße ist sehr lang. Über den Fluss und durch den Wald. Die schönen Äpfel schmecken süß. Das Mädchen liest ein Buch.'
    const tokens = tokenize(germanText)

    const expectedTokens = [
      'Guten',
      ' Tag',
      '!',
      ' Wie',
      ' geht',
      ' es',
      ' Ihnen',
      '?',
      ' Ich',
      ' möchte',
      ' ein',
      ' Stück',
      ' Käse',
      ' kaufen',
      '.',
      ' Die',
      ' Straße',
      ' ist',
      ' sehr',
      ' lang',
      '.',
      ' Über',
      ' den',
      ' Fluss',
      ' und',
      ' durch',
      ' den',
      ' Wald',
      '.',
      ' Die',
      ' schönen',
      ' Äpfel',
      ' ',
      'sc',
      'hmecken',
      ' süß',
      '.',
      ' Das',
      ' Mädchen',
      ' liest',
      ' ein',
      ' Buch',
      '.',
    ]
    expect(tokens).toEqual(expectedTokens)
  })
  it('should tokenize uppercase German text correctly', () => {
    const germanTextUpper =
      'GUTEN TAG! WIE GEHT ES IHNEN? ICH MÖCHTE EIN STÜCK KÄSE KAUFEN. DIE STRASSE IST SEHR LANG. ÜBER DEN FLUSS UND DURCH DEN WALD. DIE SCHÖNEN ÄPFEL SCHMECKEN SÜß. DAS MÄDCHEN LIEST EIN BUCH.'
    const tokens = tokenize(germanTextUpper)

    const expectedTokens = [
      'GUTEN',
      ' TAG',
      '!',
      ' WIE',
      ' GEHT',
      ' ES',
      ' IHNEN',
      '?',
      ' ICH',
      ' MÖCHTE',
      ' EIN',
      ' STÜCK',
      ' KÄSE',
      ' KAUFEN',
      '.',
      ' DIE',
      ' STRASSE',
      ' IST',
      ' SEHR',
      ' LANG',
      '.',
      ' ÜBER',
      ' DEN',
      ' FLUSS',
      ' UND',
      ' DURCH',
      ' DEN',
      ' WALD',
      '.',
      ' DIE',
      ' SCHÖNEN',
      ' ÄPFEL',
      ' ',
      'SC',
      'HMECKEN',
      ' SÜ',
      'ß',
      '.',
      ' DAS',
      ' MÄDCHEN',
      ' LIEST',
      ' EIN',
      ' BUCH',
      '.',
    ]
    expect(tokens).toEqual(expectedTokens)
  })
  it('should tokenize mixed multilingual text correctly', () => {
    const mixedText =
      "This is a mélange of différentes languages. El niño está learning German und Französisch. Schöne Bücher y señoras with œuvres d'art. Über die Straße and à travers la forêt."
    const tokens = tokenize(mixedText)

    const expectedTokens = [
      'This',
      ' is',
      ' a',
      ' mélange',
      ' of',
      ' différent',
      'es',
      ' languages',
      '.',
      ' El',
      ' niño',
      ' está',
      ' learning',
      ' German',
      ' und',
      ' Französis',
      'ch',
      '.',
      ' Schöne',
      ' Bücher',
      ' y',
      ' señoras',
      ' with',
      ' œuvres',
      ' ',
      'd',
      "'",
      'art',
      '.',
      ' Über',
      ' die',
      ' Straße',
      ' and',
      ' à',
      ' travers',
      ' la',
      ' forêt',
      '.',
    ]
    expect(tokens).toEqual(expectedTokens)
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
