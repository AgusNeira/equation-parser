/*
 * Evaluator
 *
 * This module is actually focused on getting a numerical result from
 * the expression, but embeds the functionality of the preceding ones 
 * (lexer, syntax_checker and parse). Thus, its main method takes an
 * expression (string) and generates an evaluation tree. This tree is
 * similar to the parse tree, but each of its nodes have a `fn` method
 * that operates that specific node.
 * The `evaluate` function returns a function that takes the values of
 * unknowns present in the expression, and returns a numerical result.
 */

const { lexer } = require('./lexer.js');
const { syntax_check } = require('./syntax_check.js');
const { parse } = require('./parse.js');

function traverse(node) {
    if (node.type === 'block') {
        traverse(node.child[0]);
        node.fn = variables => node.child[0].fn(variables);
    } else if (node.type === 'unary_operator') {
        traverse(node.child);
        
        if (node.operator === '+')
            node.fn = vars => node.child.fn(vars);
        else if (node.operator === '-')
            node.fn = vars => -node.child.fn(vars);
    } else if (node.type === 'binary_operator'){
        traverse(node.left);
        traverse(node.right);
        
        if (node.operator === '+')
            node.fn = vars => node.left.fn(vars) + node.right.fn(vars);
        else if (node.operator === '-')
            node.fn = vars => node.left.fn(vars) - node.right.fn(vars);
        else if (node.operator === '*')
            node.fn = vars => node.left.fn(vars) * node.right.fn(vars);
        else if (node.operator === '/')
            node.fn = vars => node.left.fn(vars) / node.right.fn(vars);
        else if (node.operator === '^')
            node.fn = vars => node.left.fn(vars) ** node.right.fn(vars);
    } else if (node.type === 'literal') {
        node.fn = vars => parseInt(node.value, 10);
    } else if (node.type === 'variable')
        node.fn = vars => vars[node.name];
}

function evaluate(expression) {
    let [tokens, unknowns] = lexer(expression);
    tokens = syntax_check(tokens);
    let parse_tree = parse(tokens);

    let evaluate_tree = {};
    Object.assign(evaluate_tree, parse_tree);

    traverse(evaluate_tree, unknowns);

    return {
        evaluate: variables => {
            if (Object.keys(variables).length !== unknowns.length)
                throw Error(`Incorrect number of values passed: should be ${unknowns.length} and is ${Object.keys(variables).length}`);
            for (let v of unknowns)
                if (!variables.hasOwnProperty(v))
                    throw Error(`Missing value for variable ${v}`);
        
            return evaluate_tree.fn(variables);
        },
        unknowns
    };
}

module.exports = { evaluate };

if (!module.parent) {
    let str = "((x + 5) / (3 - y))";
    let expression = evaluate(str);

    console.log(`Expression: ${str}`);
    console.log(`Result with x=2 and y=5: ${expression.evaluate({ x: 2, y: 5 })}`);

    str = "(-(-x + 5) / (-3 + y))";
    expression = evaluate(str);

    console.log(`Expression: ${str}`);
    console.log(`Result with x=2 and y=5: ${expression.evaluate({ x: 2, y: 5 })}`);

    str = "+4(x + 3x)(-9 - x)";
    expression = evaluate(str);

    console.log(`Expression: ${str}`);
    console.log(`Result with x=2: ${expression.evaluate({ x: 2 })}`);
}
