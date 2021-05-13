import { LexerDefintion, lex, LiteralToken } from './lib/lexer'

export type Token = 
    | LiteralToken<'+'>
    | LiteralToken<'*'>
    | LiteralToken<'-'>
    | LiteralToken<'/'>
    | LiteralToken<'eof'>
    | { kind: 'value', value: number }

const defs: LexerDefintion<Token> = [
    [ '+', { kind: '+' } ],
    [ '-', { kind: '-' } ],
    [ '*', { kind: '*' } ],
    [ '/', { kind: '/' } ],
    [ /(\d+)/, s => ({kind: 'value', value: Number(s)}) ],
]
    
export const run_lexer = (input: string) => lex<Token>(defs, { kind: 'eof' }, input)