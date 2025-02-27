const lowercaseEnglishRegex =
  /[ ]?(?:[bcdfghjklmnpqrstvwxz]{0,3}[aeiouy]{1,3}[bcdfghjklmnpqrstvwxz]{0,3}){1,3}/

const uppercaseEnglishRegex =
  /[ ]?(?:[BCDFGHJKLMNPQRSTVWXZ]{0,3}[AEIOUY]{1,3}[BCDFGHJKLMNPQRSTVWXZ]{0,3}){1,3}/

const titlecaseEnglishRegex = /[ ]?[A-Z][a-z]{1,8}/

const commonAbbreviationsRegex = /pdf|png|http(?:s)?|rfp|www|PDF|PNG|HTTP|HTTP(?:S)?|RFP|WWW/

const regexPatterns = [
  /\d/, // Single digit
  /\n+/, // One or more newlines
  /\r+/, // One or more carriage returns
  /\t+/, // One or more tabs
  /\v+/, // One or more vertical tabs
  /\f+/, // One or more form feeds
  commonAbbreviationsRegex, // Common abbreviations
  lowercaseEnglishRegex, // Lowercase English words
  titlecaseEnglishRegex, // Titlecase English words
  uppercaseEnglishRegex, // Uppercase English words
  /[bcdfghjklmnpqrstvwxz]{1,2}/, // One or two consonants
  /[BCDFGHJKLMNPQRSTVWXZ]{1,2}/, // One or two uppercase consonants
  /\(\)/, // Parentheses
  /\[\]/, // Brackets
  /\{\}/, // Braces
  /([.=#_-])\1{1,15}/, // Handle repeated special characters with lengths of up to 16
  /[ ]?[!@#$%^&*()_+\-=\[\]{}\\|;:'",.<>/?`~]{1,3}/, // One to three special characters
  /[ ]+/, // One or more spaces
  /./, // Any other character, including weird unicode characters
]

// Combine all patterns with the 'g' flag for global matching
const combinedPattern = new RegExp(
  regexPatterns.map((pattern) => pattern.source).join('|'),
  'g',
)
/**
 * Tokenize a string similar to Gemma's tokenizer
 * @param input The text to tokenize
 * @returns The tokens
 * @example
 * const tokens = tokenize('Hello, world!')
 * console.log(tokens)
 * Output: ['Hello', ',', 'world', '!']
 */
export const tokenize = (input: string): string[] =>
  input.match(combinedPattern) || []

/**
 * Get the count of tokens in a text
 * @param text The text to tokenize
 * @returns The count of tokens in the text
 */
export const getTokenCount = (text: string) => tokenize(text).length

/**
 * Truncate text to a maximum number of tokens
 * @param text The text to truncate
 * @param maxTokens The maximum number of tokens to truncate to
 * @returns The truncated text
 */
export const truncateTextToMaxTokens = (text: string, maxTokens: number) => {
  const tokens = tokenize(text)
  const truncatedTokens = tokens.slice(0, maxTokens)
  const truncatedText = truncatedTokens.join('')
  return { truncatedText, truncatedTokenCount: truncatedTokens.length }
}
