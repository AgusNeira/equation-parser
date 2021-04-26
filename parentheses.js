/*
 * Parentheses
 *
 * This module is auxiliar to the parsing chain. It helps analyze every
 * pair of parenthesis in the token chain, and gives information about
 * where it starts, where it ends and at which level the block is.
 */

function parentheses(tokens) {
    let parens = [];
    let level = 0;
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type === 'paren_open') {
            level++;
            parens.push({
                start: i,
                end: null,
                level
            });
        } else if (tokens[i].type === 'paren_close') {
            level--;
            if (level < 0) throw Error(`Bad parentheses syntax at index ${i}`);

            for (let p = parens.length - 1; p >= 0; p--) { // Closes the last opened block
                if (!parens[p].end) {
                    parens[p].end = i + 1;
                    break;
                }
            }
        }
    }
    return parens;
}

module.exports = { parentheses };

const { lexer } = require('./lexer.js');
const { syntax_check } = require('./syntax_check.js');

if (!module.parent) {
    let str = "((x + 5) / (3 - y))";
    let [ tokens, unknowns ] = lexer(str);
    tokens = syntax_check(tokens);
    let parenthesised = parentheses(tokens);

    console.log(`Expression: ${str}`);
    console.log(`Tokens: `, tokens);
    console.log(`Analysis: `, parenthesised);

    str = "(-(-x + 5) / (-3 + y))";
    [ tokens, unknowns ] = lexer(str);
    tokens = syntax_check(tokens);
    parenthesised = parentheses(tokens);

    console.log(`Expression: ${str}`);
    console.log(`Tokens: `, tokens);
    console.log(`Analysis: `, parenthesised);
    
    str = "+4(x + 3x)(-9 - x)";
    [ tokens, unknowns ] = lexer(str);
    tokens = syntax_check(tokens);
    parenthesised = parentheses(tokens);

    console.log(`Expression: ${str}`);
    console.log(`Tokens: `, tokens);
    console.log(`Analysis: `, parenthesised);
}
