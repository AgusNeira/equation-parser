import { parentheses } from './parentheses.mjs';

function parse(tokens) {
    let parse_tree = tokens.slice();

    const node_types = {
        UNARY_OPERATOR: 'unary_operator',
        BINARY_OPERATOR: 'binary_operator',
        VARIABLE: 'variable',
        LITERAL: 'literal',
        BLOCK: 'block'
    };
    const binary_operators = {
        '+': 1, '-': 1,
        '*': 2, '/': 2,
        '^': 3
    };
    const unary_operators = {
        '+': 4, '-': 4
    };
    
    let parens = parentheses(tokens)
        .sort((a, b) => b.level - a.level);       // sort by descending level

    for (let index = 0; index < parens.length; index++) {
        let blockLength = parens[index].end - parens[index].start;
        parse_tree.splice(parens[index].start, blockLength, {
            type: node_types.BLOCK,
            child: parse_tree.slice(parens[index].start + 1, parens[index].end - 1)
        });
        for (let jndex = index + 1; jndex < parens.length; jndex++) {
            if (parens[jndex].start < parens[index].start) {
                parens[jndex].end -= blockLength - 1;
            } else {
                parens[jndex].start -= blockLength - 1;
                parens[jndex].end -= blockLength - 1;
            }
        }
    }
    return parse_tree;
}

import { fileURLToPath } from 'url';
import { lexer } from './lexer.mjs';
import { syntax_check } from './syntax_check.mjs';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    let str = "((x + 5) / (3 - y))";
    console.log(str);
    console.log(syntax_check(lexer(str)));
    console.dir(parse(syntax_check(lexer(str))), { depth: null });

    str = "(-(-x + 5) / (-3 + y))";
    console.log(str);
    console.log(syntax_check(lexer(str)));
    console.dir(parse(syntax_check(lexer(str))), { depth: null });

    str = "+4(x + 3x)(-9 - x)"
    console.log(str);
    console.log(syntax_check(lexer(str)));
    console.dir(parse(syntax_check(lexer(str))), { depth: null });
}
