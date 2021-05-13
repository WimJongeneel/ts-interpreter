import { run_lexer } from "./lexer"
import { AST, run_parser } from "./parser"
import * as Readline from 'readline'

const run = (a:AST) => a.kind == 'value' ? a.value :
    a.kind == 'opp' && a.opperator == '*' ? run(a.left) * run(a.right) : 
    a.kind == 'opp' && a.opperator == '+' ? run(a.left) + run(a.right) :
    a.kind == 'opp' && a.opperator == '/' ? run(a.left) / run(a.right) :
    run(a.left) - run(a.right)

const prompt = Readline.createInterface(process.stdin, process.stdout);
prompt.on('line', l => {
    const input = l.toString().trim()
    try {
        const res = run(run_parser(run_lexer(input)))
        console.log(res)
    }
    catch (e) {
        console.error(e)
    }
})