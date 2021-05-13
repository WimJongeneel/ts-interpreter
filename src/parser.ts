
import { ParserConfig, parser } from './lib/parser'
import { Token } from './lexer'

export type AST = 
    | { kind: 'opp', opperator: '*'| '+' | '-' | '/' | ':=', left: AST, right: AST }
    | { kind: 'value', value: number }
    | { kind: 'id', value: string }

const config: ParserConfig<Token, AST> = {
    precedences: {
        "+": 2,
        "-": 2,
        "*": 3,
        "/": 3,
        ":=": 1,
        id: -1,
        value: -1,
        eof: -1,
    },
    infix_parsers: {
        "*": (_, l, r) => ({kind: 'opp', opperator:'*', left: l, right: r}),
        "-": (_, l, r) => ({kind: 'opp', opperator: '-', left: l, right: r}),
        "+": (_, l, r) => ({kind: 'opp', opperator: '+', left: l, right: r}),
        "/": (_, l, r) => ({kind: 'opp', opperator: '/', left: l, right: r}),
        ":=": (_, l, r) => ({kind: 'opp', opperator: ':=', left: l, right: r}),
    },
    prefix_parsers: {
        value: t => t.kind == 'value' ? t : {kind: 'value', value: NaN },
        id: t => t.kind == 'id' ? t : null
    },
    eof_kind: 'eof'
}

export const run_parser = (tokens: Token[]) => parser<Token, AST>(tokens, config)