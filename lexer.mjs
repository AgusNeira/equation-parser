export function lexer(expression) {
    const node_types = {
        LITERAL: 'literal',
        VARIABLE: 'variable',
        UNARY_OPERATOR: 'unary',
        BINARY_OPERATOR: 'binary',
        PARENTHESIS_OPEN: 'open paren',
        PARENTHESIS_CLOSE: 'close paren'
    };
    const unary_operators = { plus: '+', minus: '-' };
    const binary_operators = {
        plus: '+', minus: '-',
        multiply: '*', divide: '/',
        exp: '^', equal: '='
    };
    const parens = { left: '(', right: ')' };

    let tokens = [];
    let lastToken = () => tokens[tokens.length - 1];

    let index = 0;
    let regex;
    let match;

    while (index < expression.length) {
        if (expression[index] === ' ') index++;
        else if (expression[index] === parens.left) {
            tokens.push({
                type: node_types.PARENTHESIS_OPEN,
            });
            index++;
        } else if (expression[index] === parens.right) {
            tokens.push({
                type: node_types.PARENTHESIS_CLOSE,
            });
            index++;
        } else if (expression[index] === binary_operators.plus) {
            let last = lastToken();
            if (last.type === node_types.LITERAL || last.type === node_types.VARIABLE
                || last.type === node_types.PARENTHESIS_CLOSE) {
                tokens.push({
                    type: node_types.BINARY_OPERATOR,
                    operator: binary_operators.plus
                });
            } else {
                tokens.push({
                    type: node_types.UNARY_OPERATOR,
                    operator: unary_operators.plus
                });
            }
            index++;
        } else if (expression[index] === binary_operators.minus) {
            let last = lastToken();
            if (last.type === node_types.LITERAL || last.type === node_types.VARIABLE
                || last.type === node_types.PARENTHESIS_CLOSE) {
                tokens.push({
                    type: node_types.BINARY_OPERATOR,
                    operator: binary_operators.minus
                });
            } else {
                tokens.push({
                    type: node_types.UNARY_OPERATOR,
                    operator: unary_operators.minus
                });
            }
            index++;
        } else if (expression[index] === binary_operators.multiply) {
            tokens.push({
                type: node_types.BINARY_OPERATOR,
                operator: binary_operators.multiply
            });
            index++;
        } else if (expression[index] === binary_operators.divide) {
            tokens.push({
                type: node_types.BINARY_OPERATOR,
                operator: binary_operators.divide
            });
            index++;
        } else if (expression[index] === binary_operators.exp) {
            tokens.push({
                type: node_types.BINARY_OPERATOR,
                operator: binary_operators.exp
            });
            index++;
        } else if (expression[index] === binary_operators.equal) {
            tokens.push({
                type: node_types.BINARY_OPERATOR,
                operator: binary_operators.equal
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

import { fileURLToPath } from 'url';
import { parenthesis } from './parenthesis.mjs';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    let str = "((x + 5) / (3 - y)) = 2";
    console.log(str);
    console.log(lexer(str));
}
