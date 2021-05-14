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
    | LiteralToken<'if'>
    | LiteralToken<'then'>
    | LiteralToken<'else'>
    | LiteralToken<'let'>

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
    [ 'else', { kind: 'else' } ],
    [ 'if', { kind: 'if' } ],
    [ 'then', { kind: 'then' } ],
    [ 'let', { kind: 'let' } ],
    [ /^([a-z]+)/m, s => ({kind: 'id', value: String(s)}) ],
    [ /^(\d+)/m, s => ({kind: 'value', value: Number(s)}) ],
]
    
export const run_lexer = (input: string) => lex<Token>(defs, { kind: 'eof' }, input)