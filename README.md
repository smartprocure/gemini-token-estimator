# gemini-token-estimator

Estimate the number of tokens for Gemini models, trading accuracy for speed.
In most cases, the estimated number of tokens is within 10% of the actual number of tokens.
For a body of text consisting of around 1 million tokens, the estimation time takes less than 150 ms
compared to multiple seconds for an exact count.

Contributions are welcome!

```typescript

/**
 * Tokenize a string similar to Gemma's tokenizer
 * @param input The text to tokenize
 * @returns The tokens
 * @example
 * const tokens = tokenize('Hello, world!')
 * console.log(tokens)
 * Output: ['Hello', ',', ' world', '!']
 */
tokenize(input: string): string[]

/**
 * Get the count of tokens in a text
 * @param text The text to tokenize
 * @returns The count of tokens in the text
 */
getTokenCount(text: string): number

/**
 * Truncate text to a maximum number of tokens
 * @param text The text to truncate
 * @param maxTokens The maximum number of tokens to truncate to
 * @returns The truncated text
 */
truncateTextToMaxTokens(text: string, maxTokens: number): string
```
