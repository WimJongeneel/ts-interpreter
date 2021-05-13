export interface BaseToken {
    kind: string
}

export interface LiteralToken<s> { kind: s }

export type LexerDefintion<Token extends BaseToken> = (
    | [string, Token]
    | [RegExp, (s:string) => Token]
)[]

const skip_whitespace = (input: string) => {
    const res = /(\s*)/.exec(input)
    if(res?.[0]) return input.substring(res[0].length)
    return input
}

const read = <Token extends BaseToken>(defs: LexerDefintion<BaseToken>, input: string): [string, Token] => {
    const input1 = skip_whitespace(input)
    for(const d of defs) {
        if(typeof d[0] == 'string') {
            if (input1.startsWith(d[0])) return [ input1.substring(d[0].length), d[1] as Token]
            continue
        }
        if((d[0] as RegExp).test(input)) {
            const res = (d[0] as RegExp).exec(input1)
            return [ input1.substring(res[0].length), (d[1] as any)(res[0]) ]
        }
    }

}

export const lex = <Token extends BaseToken>(defs: LexerDefintion<Token>, eofToken: Token, input: string): Token[] => {
    const tokens: Token[] = []
    while(input != "") {
        const [newInput, newToken] = read<Token>(defs, input)
        input = newInput
        tokens.push(newToken)
    }
    tokens.push(eofToken)
    
    return tokens
}


