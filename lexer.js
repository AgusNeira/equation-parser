function lexer(expression) {
    const node_types = {
        LITERAL: 'literal',
        VARIABLE: 'variable',
        UNARY_OPERATOR: 'unary_operator',
        BINARY_OPERATOR: 'binary_operator',
        PARENTHESIS_OPEN: 'paren_open',
        PARENTHESIS_CLOSE: 'paren_close'
    };

    let tokens = [];
    let lastToken = () => tokens[tokens.length - 1];

    let index = 0;
    let regex;
    let match;

    while (index < expression.length) {
        if (expression[index] === ' ') index++;

        else if (expression[index] === '(') {
            tokens.push({
                type: node_types.PARENTHESIS_OPEN,
            });
            index++;
        } else if (expression[index] === ')') {
            tokens.push({
                type: node_types.PARENTHESIS_CLOSE,
            });
            index++;
        } else if (expression[index] === '+') {
            if (tokens.length === 0 ||
                lastToken().type === 'paren_open') {
                tokens.push({
                    type: node_types.UNARY_OPERATOR,
                    operator: '+'
                });
            } else {
                tokens.push({
                    type: node_types.BINARY_OPERATOR,
                    operator: '+'
                });
            }
            index++;
        } else if (expression[index] === '-') {
            if (tokens.length === 0 ||
                lastToken().type === 'paren_open') {
                tokens.push({
                    type: node_types.UNARY_OPERATOR,
                    operator: '-'
                });
            } else {
                tokens.push({
                    type: node_types.BINARY_OPERATOR,
                    operator: '-'
                });
            }
            index++;
        } else if (expression[index] === '*') {
            tokens.push({
                type: node_types.BINARY_OPERATOR,
                operator: '*'
            });
            index++;
        } else if (expression[index] === '/') {
            tokens.push({
                type: node_types.BINARY_OPERATOR,
                operator: '/'
            });
            index++;
        } else if (expression[index] === '^') {
            tokens.push({
                type: node_types.BINARY_OPERATOR,
                operator: '^'
            });
            index++;
        } else if (expression.charCodeAt(index) >= 97 &&
                   expression.charCodeAt(index) <= 122){
            tokens.push({
                type: node_types.VARIABLE,
                name: expression[index]
            });
            index++;
        } else {
            let regex = /\d+(\.\d+)?/;
            match = regex.exec(expression.slice(index));
            if (match) {
                tokens.push({
                    type: node_types.LITERAL,
                    value: match[0]
                });
                index += match[0].length;
            } else {
                throw Error("Cannot parse token at position " + index);
            }
        }
    }
    return tokens;
}

module.exports = { lexer };

if (!module.parent) {
    let str = "((x + 5) / (3 - y))";
    console.log(str);
    console.log(lexer(str));

    str = "(-(-x + 5) / (-3 + y))";
    console.log(str);
    console.log(lexer(str));

    str = "(x + 3 * x)(-9 - x)"
    console.log(str);
    console.log(lexer(str));
}
