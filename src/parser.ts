
import { ParserConfig, parser, expr_wildcard } from './lib/parser'
import { Token } from './lexer'

export type AST = 
    | { kind: 'opp', opperator: '*'| '+' | '-' | '/' | '==' | '<' | '>' | 'and' | 'or' | '!=', left: AST, right: AST }
    | { kind: 'value', value: any }
    | { kind: 'id', value: string }
    | { kind: 'if', condition: AST, ifTrue: AST, ifFalse: AST }
    | { kind: 'assigment', name: string, value: AST }

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
        //TODO: make this optional
        if: -1,
        let: -1,
        else: -1,
        then: -1
    },
    infix_parsers: {
        "*": (_, l, r) => ({kind: 'opp', opperator:'*', left: l, right: r}),
        "-": (_, l, r) => ({kind: 'opp', opperator: '-', left: l, right: r}),
        "+": (_, l, r) => ({kind: 'opp', opperator: '+', left: l, right: r}),
        "/": (_, l, r) => ({kind: 'opp', opperator: '/', left: l, right: r}),
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
    statement: [
        // TODO: make the args typesafer
        [
            [ 'if', expr_wildcard, 'then', expr_wildcard, 'else', expr_wildcard ],
            t => ({ kind: 'if', condition: t[1] as AST, ifTrue: t[3] as AST, ifFalse: t[5] as AST }) 
        ],
        [
            [ 'let', 'id', ':=', expr_wildcard],
            t => ({ kind: 'assigment', name: (t[1] as any).value, value: t[3] as AST})
        ]
    ],
    eof_kind: 'eof'
}

export const run_parser = (tokens: Token[]) => parser<Token, AST>(tokens, config)