# A 'No-Library' Interperter in TypeScript

This repro contains an interpreter written in TypeScrip, without the usage of external tooling for the lexing or parsing proces. Both the lexer and parser are broken up into a generic implementation and a concrete definition of the language. Run `yarn start` to open up a REPL console.

## Language

The language support two datatypes: integers and booleans. Variable can be assigned with `:=`. The following operators are supported: `*`, `-`, `+`, `/`, `==`, `!=`, `>`, `<`, `||` en `&&`. Some examples of expressions:

```ts
1 + a * 3
1 < 2 && 2 > 1
true || x
y
```

The language supports at this time 3 different statements: variable declarations, if-statements and expression-statements. Both declarations and if-statements will print `undefined` in the REPL. Expression-statements will print the resulting value.

```ts
let a := 1 + 1
if x > 2 then 2 else 4
1 + 1
```

## Lexer
The generic implementation of the lexer can be found in [`lib/lexer.ts`](https://github.com/WimJongeneel/ts-interpreter/blob/master/src/lib/lexer.ts). The entry point of this module is the `lex` function which produces a array of tokens based on the token type, a `LexerDefintion`, the `eof` token and an input string.

```ts
export const lex: <Token extends BaseToken>(defs: LexerDefintion<Token>, eofToken: Token, input: string) => Token[]
```

In the `LexerDefintion` is it possible to both lex by literal strings and regular expressions. By using a regex it is possible to use the source text in the token constructor. A small example can be found below.

```ts
import { LexerDefintion, lex, LiteralToken } from './lib/lexer'

export type Token = 
    | LiteralToken<'+'>
    | LiteralToken<'eof'>
    | { kind: 'value', value: number }

const defs: LexerDefintion<Token> = [
    [ '+', { kind: '+' } ],
    [ /(\d+)/, s => ({kind: 'value', value: Number(s)}) ],
]
    
export const run_lexer = (input: string) => lex<Token>(defs, { kind: 'eof' }, input)
```

The full lexer definition can be found in [`lexer.ts`](https://github.com/WimJongeneel/ts-interpreter/blob/master/src/lexer.ts).

## Parser
The generic implementation of the parser can be found in [`lib/parser.ts`](https://github.com/WimJongeneel/ts-interpreter/blob/master/src/lib/parser.ts). The entrypoint here is the `parser` function which parses an array of nodes into an AST. For this the parser needs a config object with the `precendeces`, the `infix_parsers`, the `prefix_parsers` and the EOF token. The parser definition can be found in [`parser.ts`](https://github.com/WimJongeneel/ts-interpreter/blob/master/src/parser.ts). A portion of this is shown below.

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

## Combined the lexer and parser
Lexing and parsing a string can be done as follows:
```ts
import { run_lexer } from "./lexer"
import { run_parser } from "./parser"

console.log(run_parser(run_lexer("1 + 2 * 3")))
```
