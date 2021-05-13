
import { ParserConfig, parser } from './lib/parser'
import { Token } from './lexer'

export type AST = 
    | { kind: 'opp', opperator: '*'| '+' | '-' | '/', left: AST, right: AST }
    | { kind: 'value', value: number }

const config: ParserConfig<Token, AST> = {
    precedences: {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2,
        value: -1,
        eof: -1
    },
    infix_parsers: {
        "*": (_, l, r) => ({kind: 'opp', opperator:'*', left: l, right: r}),
        "-": (_, l, r) => ({kind: 'opp', opperator: '-', left: l, right: r}),
        "+": (_, l, r) => ({kind: 'opp', opperator: '+', left: l, right: r}),
        "/": (_, l, r) => ({kind: 'opp', opperator: '/', left: l, right: r}),
    },
    prefix_parsers: {
        value: t => t.kind == 'value' ? t : {kind: 'value', value: NaN }
    },
    eof_kind: 'eof'
}

export const run_parser = (tokens: Token[]) => parser<Token, AST>(tokens, config)