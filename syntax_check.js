/*
 * Syntax check
 *
 * This module is used with the tokens returned by the lexer module, and
 * it checks for invalid syntax in the mathematical expressions. 
 * It checks:
 *  - Parenthesis coherence
 *  - Consecutive operators
 *  - Expressions ending with an operator
 *  - Inserts multiplication operators between consecutive blocks, variables
 * or literals
 */

function syntax_check(tokens) {
    let level = 0;
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type === 'paren_open') {
            level++;
        } else if (tokens[i].type === 'paren_close') {
            level--;
            if (level < 0) throw Error(`Bad parenthesis syntax at index ${i}`);

            if (i !== tokens.length - 1 &&
                (tokens[i + 1].type === 'paren_open' ||
                tokens[i + 1].type === 'literal' ||
                tokens[i + 1].type === 'variable')) {
                tokens.splice(i + 1, 0, {
                    type: 'binary_operator',
                    operator: '*'
                });
            }
        } else if (tokens[i].type === 'binary_operator' ||
                   tokens[i].type === 'unary_operator') {
            if (i === tokens.length - 1) {
                throw Error("Can't have operator at the end of expression");
            }

            if (i !== tokens.length - 1 &&
                (tokens[i + 1].type === 'binary_operator' ||
                tokens[i + 1].type === 'unary_operator')) {
                throw Error(`Cannot parse consecutive operators at index ${i}`);
            }
        } else if (tokens[i].type === 'literal') {
            if (i !== tokens.length - 1 &&
                (tokens[i + 1].type === 'paren_open' ||
                tokens[i + 1].type === 'variable')) {
                tokens.splice(i + 1, 0, {
                    type: 'binary_operator', operator: '*'
                });
            }
        } else if (tokens[i].type === 'variable') {
            if (i !== tokens.length - 1 &&
                (tokens[i + 1].type === 'variable' ||
                tokens[i + 1].type === 'literal' ||
                tokens[i + 1].type === 'paren_open')) {
                tokens.splice(i + 1, 0, {
                    type: 'binary_operator', operator: '*'
                });
            }
        }
    }
    return tokens;
}

module.exports = { syntax_check };

const { lexer } = require('./lexer.js');

if (!module.parent) {
    let str = "((x + 5) / (3 - y))";
    let [tokens, unknowns] = lexer(str);

    console.log(`Expression: ${str}`);
    console.log(`Tokens: `, lexer(str));
    console.log(`Unknowns encountered: ${unknowns}`);
    console.log(`Tokens after syntax check: `, syntax_check(tokens));

    str = "(-(-x + 5) / (-3 + y))";
    [tokens, unknowns] = lexer(str);

    console.log(`Expression: ${str}`);
    console.log(`Tokens: `, lexer(str));
    console.log(`Unknowns encountered: ${unknowns}`);
    console.log(`Tokens after syntax check: `, syntax_check(tokens));
    
    str = "+4(x + 3x)(-9 - x)";
    [tokens, unknowns] = lexer(str);

    console.log(`Expression: ${str}`);
    console.log(`Tokens: `, lexer(str));
    console.log(`Unknowns encountered: ${unknowns}`);
    console.log(`Tokens after syntax check: `, syntax_check(tokens));
    
    str = "+4(x + 3x)(-9 -- x)";
    [tokens, unknowns] = lexer(str);

    console.log(`Expression: ${str}`);
    console.log(`Tokens: `, lexer(str));
    console.log(`Unknowns encountered: ${unknowns}`);
    console.log(`Tokens after syntax check: `, syntax_check(tokens));
    
}
