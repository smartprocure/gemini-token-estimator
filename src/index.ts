const lowercaseWord =
  /[ ]?(?:[bcdfghjklmnpqrstvwxzßçñ]{0,3}[aeiouyàáâäèéêëìíîïòóôöùúûüýÿæœ]{1,3}[bcdfghjklmnpqrstvwxzßçñ]{0,3}){1,3}/

const uppercaseWord =
  /[ ]?(?:[BCDFGHJKLMNPQRSTVWXZÇÑ]{0,3}[AEIOUYÀÁÂÄÈÉÊËÌÍÎÏÒÓÔÖÙÚÛÜÝŸÆŒ]{1,3}[BCDFGHJKLMNPQRSTVWXZÇÑ]{0,3}){1,3}/

const titlecaseWord =
  /[ ]?[A-ZÀÁÂÄÈÉÊËÌÍÎÏÒÓÔÖÙÚÛÜÝŸÆŒÇÑ][a-zàáâäèéêëìíîïòóôöùúûüýÿæœßçñ]{1,8}/

// Sequences of consonants that are common and should be treated as a single token
const commonAbbreviations =
  /pdf|png|http(?:s)?|rfp|www|PDF|PNG|HTTP|HTTP(?:S)?|RFP|WWW/

// Match anything that's not in common Latin character ranges and not in private use area
const nonLatinWord =
  /[ ]?[^\u0000-\u007F\u00A0-\u00FF\u0100-\u017F\ue000-\uf8ff]{1,5}/

const regexPatterns = [
  /\d/, // Single digit
  /\n+/, // One or more newlines
  /\r+/, // One or more carriage returns
  /\t+/, // One or more tabs
  /\v+/, // One or more vertical tabs
  /\f+/, // One or more form feeds
  /[\ue000-\uf8ff]/, // Private use area
  commonAbbreviations, // Common abbreviations
  lowercaseWord, // Lowercase word
  titlecaseWord, // Titlecase word
  uppercaseWord, // Uppercase word
  /[bcdfghjklmnpqrstvwxzßçñ]{1,2}/, // One or two consonants
  /[BCDFGHJKLMNPQRSTVWXZÇÑ]{1,2}/, // One or two uppercase consonants
  nonLatinWord,
  /\(\)/, // Parentheses
  /\[\]/, // Brackets
  /\{\}/, // Braces
  /([.=#_-])\1{1,15}/, // Handle repeated special characters with lengths of up to 16
  /[ ]?[!@#$%^&*()_+\-=\[\]{}\\|;:'",.<>/?`~]{1,3}/, // One to three special characters
  /[ ]+/, // One or more spaces
  /./, // Any other character
]

// Combine all patterns with the 'g' flag for global matching
const combinedPattern = new RegExp(
  regexPatterns.map((pattern) => pattern.source).join('|'),
  'g'
)
/**
 * Tokenize a string similar to Gemma's tokenizer
 * @param input The text to tokenize
 * @returns The tokens
 * @example
 * const tokens = tokenize('Hello, world!')
 * console.log(tokens)
 * Output: ['Hello', ',', ' world', '!']
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
