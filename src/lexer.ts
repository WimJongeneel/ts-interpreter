import { LexerDefintion, lex, LiteralToken } from './lib/lexer'

export type Token = 
    | LiteralToken<'+'>
    | LiteralToken<'*'>
    | LiteralToken<'-'>
    | LiteralToken<'/'>
    | LiteralToken<'eof'>
    | { kind: 'value', value: any }
    | { kind: 'id', value: string }
    | LiteralToken<':='>
    | LiteralToken<'=='>
    | LiteralToken<'!='>
    | LiteralToken<'<'>
    | LiteralToken<'>'>
    | LiteralToken<'||'>
    | LiteralToken<'&&'>

const defs: LexerDefintion<Token> = [
    [ '+', { kind: '+' } ],
    [ '-', { kind: '-' } ],
    [ '*', { kind: '*' } ],
    [ '/', { kind: '/' } ],
    [ ':=', { kind: ':=' } ],
    [ '==', { kind: '==' } ],
    [ '!=', { kind: '!=' } ],
    [ '<', { kind: '<' } ],
    [ '>', { kind: '>' } ],
    [ '||', { kind: '||' } ],
    [ '&&', { kind: '&&' } ],
    [ 'true', { kind: 'value', value: true } ],
    [ 'false', { kind: 'value', value: false } ],
    [ /([a-z]+)/, s => ({kind: 'id', value: String(s)}) ],
    [ /(\d+)/, s => ({kind: 'value', value: Number(s)}) ],
]
    
export const run_lexer = (input: string) => lex<Token>(defs, { kind: 'eof' }, input)