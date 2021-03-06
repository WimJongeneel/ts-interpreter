import { run_lexer } from "./lexer"
import { AST, run_parser } from "./parser"
import * as Readline from 'readline'

const memory = new Map<string, any>()

const run = (a:AST) => {
    if(a.kind == 'value') return a.value
    if(a.kind == 'opp' && a.opperator == '*') return run(a.left) * run(a.right)
    if(a.kind == 'opp' && a.opperator == '+') return run(a.left) + run(a.right)
    if(a.kind == 'opp' && a.opperator == '/') return run(a.left) / run(a.right)
    if(a.kind == 'opp' && a.opperator == '-') return run(a.left) - run(a.right)
    if(a.kind == 'opp' && a.opperator == '!=') return run(a.left) !== run(a.right)
    if(a.kind == 'opp' && a.opperator == '==') return run(a.left) === run(a.right)
    if(a.kind == 'opp' && a.opperator == '<') return run(a.left) < run(a.right)
    if(a.kind == 'opp' && a.opperator == '>') return run(a.left) > run(a.right)
    if(a.kind == 'opp' && a.opperator == 'and') return run(a.left) && run(a.right)
    if(a.kind == 'opp' && a.opperator == 'or') return run(a.left) || run(a.right)
    if(a.kind == 'assigment') {
        memory.set(a.name, run(a.value))
        return undefined
    }
    if(a.kind == 'id') return memory.get(a.value)
    if(a.kind == 'if') {
        const p = run(a.condition)
        if(p) return run(a.ifTrue)
        return run(a.ifFalse)
    }
}

const prompt = Readline.createInterface(process.stdin, process.stdout);
console.log('Welcome the the REPL!')
console.log("\tType ':mem' to inspect the memory")
console.log("\tType ':close' to close the session")
console.log("\tType ':clear' to clear the memory")

prompt.on('line', l => {
    const input = l.toString().trim()
    if(input == ':mem') {
        console.log(memory)
        return
    }
    if(input == ':close') {
        prompt.close()
        return  
    }
    if(input == ':clear') {
        memory.clear()
        return
    }
    try {
        const res = run(run_parser(run_lexer(input)))
        console.log('>> ' + res)
    }
    catch (e) {
        console.error(e)
    }
})