# A 'No-Library' Interperter in TypeScript

This repro contains a simple interpreter written in plain TypeScrip, without the help of external libraries for lexing or parsing. The project is split into two parts: the generic code for the lexer and parser and the concrete defitions of those.

## Lexer
The generic lexer accepts an input as follows:
```ts
import { LexerDefintion, lex, LiteralToken } from './lib/lexer'

export type Token = 
    | LiteralToken<'+'>
    | LiteralToken<'eof'>
    | { kind: 'value', value: number }

const defs: LexerDefintion<Token> = [
    [ '+', { kind: '+' } ],
    [ '/', { kind: '/' } ],
    [ /(\d+)/, s => ({kind: 'value', value: Number(s)}) ],
]
    
export const run_lexer = (input: string) => lex<Token>(defs, { kind: 'eof' }, input)
```
> most tokens are ommited

## Parser
The generic parser accepts its config like this:
```ts
import { ParserConfig, parser } from './lib/parser'
import { Token } from './lexer'

export type AST = 
    | { kind: 'opp', opperator: '+', left: AST, right: AST }
    | { kind: 'value', value: number }

const config: ParserConfig<Token, AST> = {
    precedences: {
        "+": 1,
        value: -1,
        eof: -1
    },
    infix_parsers: {
        "+": (_, l, r) => ({kind: 'opp', opperator: '+', left: l, right: r}),
    },
    prefix_parsers: {
        value: t => t.kind == 'value' ? t : {kind: 'value', value: NaN }
    },
    eof_kind: 'eof'
}

export const run_parser = (tokens: Token[]) => parser<Token, AST>(tokens, config)
```
> most off the tokens and the AST are ommited

## Combined the lexer and parser
Lexing and parsing a string can be done as follows:
```ts
import { run_lexer } from "./lexer"
import { run_parser } from "./parser"

console.log(run_parser(run_lexer("1 + 2 * 3")))
```