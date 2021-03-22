function syntax_check(tokens) {
    let level = 0;
    for (let i = 0; i < tokens.length - 1; i++) {
        if (tokens[i].type === 'paren_open') {
            level++;
        } else if (tokens[i].type === 'paren_close') {
            level--;
            if (level < 0) throw Error(`Bad parenthesis syntax at index ${i}`);

            if (tokens[i + 1].type === 'paren_open' ||
                tokens[i + 1].type === 'literal' ||
                tokens[i + 1].type === 'variable') {
                tokens.splice(i + 1, 0, {
                    type: 'binary_op',
                    operator: '*'
                });
            }
        } else if (tokens[i].type === 'binary_op' ||
                   tokens[i].type === 'unary_op') {
            if (tokens[i + 1].type === 'binary_op' ||
                tokens[i + 1].type === 'unary_op') {
                throw Error(`Cannot parse consecutive operators at index ${i}`);
            }

            if (tokens[i].type === 'unary_op' &&
                i === tokens.length - 1) {
                throw Error("Can't have unary operator at the end of expression");
            }
        } else if (tokens[i].type === 'literal') {
            if (tokens[i + 1].type === 'paren_open' ||
                tokens[i + 1].type === 'variable') {
                tokens.splice(i + 1, 0, {
                    type: 'binary_op', operator: '*'
                });
            }
        } else if (tokens[i].type === 'variable') {
            if (tokens[i + 1].type === 'variable' ||
                tokens[i + 1].type === 'literal' ||
                tokens[i + 1].type === 'paren_open') {
                tokens.splice(i + 1, 0, {
                    type: 'binary_op', operator: '*'
                });
            }
        }
    }
    return tokens;
}

import { fileURLToPath } from 'url';
import { lexer } from './lexer.mjs';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    let str = "((x + 5) / (3 - y)) = 2";
    console.log(str);
    console.log(lexer(str));
    console.log(syntax_check(lexer(str)));

    str = "(-(-x + 5) / (-3 + y)) = -2";
    console.log(str);
    console.log(lexer(str));
    console.log(syntax_check(lexer(str)));

    str = "+4(x + 3x)(-9 - x) = 43"
    console.log(str);
    console.log(lexer(str));
    console.log(syntax_check(lexer(str)));
}
