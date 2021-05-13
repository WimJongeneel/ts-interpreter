import { BaseToken } from './lexer'

interface ParserState<Token extends BaseToken> {
    readonly tokens: Token[]
    readonly position: number
}

export  interface ParserConfig<Token extends BaseToken, AST> {
    precedences:Precedences<Token>
    prefix_parsers: PrefixParsers<Token, AST>
    infix_parsers: InfixParsers<Token, AST>,
    eof_kind: Token['kind']
}

type Precedences<Token extends BaseToken> = { [ _ in Token['kind'] ]: number }

type PrefixParsers<Token extends BaseToken, AST> =  { [ _ in Token['kind'] ]?: (t: Token) => AST }

type InfixParsers<Token extends BaseToken, AST> =  { [ _ in Token['kind'] ]?: (token: Token, left: AST, rigth: AST) => AST }

const current_token =  <Token extends BaseToken>(ps: ParserState<Token>) => ps.tokens[ps.position]

const peek_token = <Token extends BaseToken>(ps: ParserState<Token>) => ps.tokens[ps.position + 1]

const current_precedence =  <Token extends BaseToken, AST>(config: ParserConfig<Token, AST>, state: ParserState<Token>) => config.precedences[current_token(state).kind]

const peek_precedence = <Token extends BaseToken, AST>(config: ParserConfig<Token, AST>, state: ParserState<Token>) => config.precedences[peek_token(state).kind]

const move_next_token = <Token extends BaseToken>(ps: ParserState<Token>):ParserState<Token> => ({...ps, position: ps.position + 1 })

const parse_infix = <Token extends BaseToken, AST>(config: ParserConfig<Token, AST>, state: ParserState<Token>, left: AST) : [AST, ParserState<Token>] => {
    const token = current_token(state)
    const precedence = current_precedence(config, state)
    const state1 = move_next_token(state)
    const [right, state2] = parse_expression(config, state1, precedence)
    if(right == undefined) throw new Error('no rigth expression for' + token.kind)
    return [config.infix_parsers[token.kind](token, left, right), state2]
} 

const parse_expression = <Token extends BaseToken, AST>(
    config: ParserConfig<Token, AST>,
    _state: ParserState<Token>,
    precedence: number
    ): [AST,  ParserState<Token>]  => {
        // TODO: make state immutable
        let state = _state

        const prefix_parser = config.prefix_parsers[current_token(state).kind]
        if(prefix_parser == undefined) throw new Error('no prefix parser for: ' +current_token(state).kind)
        
        let left = prefix_parser(current_token(state))

        while(peek_token(state).kind != config.eof_kind && precedence < peek_precedence(config, state)) {
            const infix_parser = config.infix_parsers[peek_token(state).kind]
            if(infix_parser == undefined) return [left, state]
            state = move_next_token(state)
            const[ newLeft, newState] = parse_infix(config, state, left)
            left = newLeft
            state = newState
        }

        return [left, state]
    }

export const parser = <Token extends BaseToken, AST>(
    tokens: Token[], 
    config: ParserConfig<Token, AST>
    ): AST => parse_expression(config, {
        position: 0,
        tokens: tokens
    }, 0)[0]
