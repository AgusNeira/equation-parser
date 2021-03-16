export function lexer(blockTree, expression) {
    // sort the blocks according to its level (and, therefore, priority to parse)
    blockTree.sort((first, second) => second.level - first.level);

    const node_types = {
        LITERAL: 0,
        VARIABLE: 1,
        UNARY_OPERATOR: 2,
        BINARY_OPERATOR: 3
    };
    const unary_operators = { '+': 0, '-': 1 };
    const binary_operators = {
        '+': 0, '-': 1,
        '*': 2, '/': 3,
        '^': 4, '=': 5
    }

    let tokens = [];
    let currBlockStr;

    for (let block of blockTree) {
        currBlockStr = expression.slice(block.start, block.end);
        if (block.level !== 0) 
            currBlockStr = currBlockStr.slice(1, -1); // remove parenthesis
        console.log(currBlockStr);

        // GENERAR los tokens
    }
}

import { fileURLToPath } from 'url';
import { parenthesis } from './parenthesis.mjs';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    let str = "((x + 5) / (3 - y)) = 2";
    console.log(str);
    console.log(parenthesis(str));
    console.log(lexer(parenthesis(str), str));
}
