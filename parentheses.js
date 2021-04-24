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
    console.log(str);
    console.log(syntax_check(lexer(str)));
    console.log(parentheses(syntax_check(lexer(str))));

    str = "(-(-x + 5) / (-3 + y))";
    console.log(str);
    console.log(syntax_check(lexer(str)));
    console.log(parentheses(syntax_check(lexer(str))));

    str = "+4(x + 3x)(-9 - x)"
    console.log(str);
    console.log(syntax_check(lexer(str)));
    console.log(parentheses(syntax_check(lexer(str))));
}
