import { run_lexer } from "./lexer"
import { AST, run_parser } from "./parser"

const run = (a:AST) => a.kind == 'value' ? a.value :
    a.kind == 'opp' && a.opperator == '*' ? run(a.left) * run(a.right) : 
    a.kind == 'opp' && a.opperator == '+' ? run(a.left) + run(a.right) :
    a.kind == 'opp' && a.opperator == '/' ? run(a.left) / run(a.right) :
    run(a.left) - run(a.right)

console.log(run_parser(run_lexer("1 + 2 * 3")))
