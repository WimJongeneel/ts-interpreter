
import { ParserConfig, parser } from './lib/parser'
import { Token } from './lexer'

export type AST = 
    | { kind: 'opp', opperator: '*'| '+' | '-' | '/' | ':=' | '==' | '!=' | '<' | '>' | 'and' | 'or', left: AST, right: AST }
    | { kind: 'value', value: any }
    | { kind: 'id', value: string }

const config: ParserConfig<Token, AST> = {
    precedences: {
        id: -1,
        value: -1,
        eof: -1,
        ":=": 5,
        "&&": 6,
        "||": 6,
        "!=": 10,
        "==": 10,
        "<": 15,
        ">": 15,
        "+": 20,
        "-": 20,
        "*": 30,
        "/": 30,
    },
    infix_parsers: {
        "*": (_, l, r) => ({kind: 'opp', opperator:'*', left: l, right: r}),
        "-": (_, l, r) => ({kind: 'opp', opperator: '-', left: l, right: r}),
        "+": (_, l, r) => ({kind: 'opp', opperator: '+', left: l, right: r}),
        "/": (_, l, r) => ({kind: 'opp', opperator: '/', left: l, right: r}),
        ":=": (_, l, r) => ({kind: 'opp', opperator: ':=', left: l, right: r}),
        "==": (_, l, r) => ({kind: 'opp', opperator: '==', left: l, right: r}),
        "!=": (_, l, r) => ({kind: 'opp', opperator: '!=', left: l, right: r}),
        ">": (_, l, r) => ({kind: 'opp', opperator: '>', left: l, right: r}),
        "<": (_, l, r) => ({kind: 'opp', opperator: '<', left: l, right: r}),
        "||": (_, l, r) => ({kind: 'opp', opperator: 'or', left: l, right: r}),
        "&&": (_, l, r) => ({kind: 'opp', opperator: 'and', left: l, right: r}),
    },
    prefix_parsers: {
        value: t => t.kind == 'value' ? t : {kind: 'value', value: NaN },
        id: t => t.kind == 'id' ? t : null
    },
    eof_kind: 'eof'
}

export const run_parser = (tokens: Token[]) => parser<Token, AST>(tokens, config)