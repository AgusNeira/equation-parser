const { lexer } = require('./lexer.js');
const { syntax_check } = require('./syntax_check.js');
const { parse } = require('./parse.js');

function traverse(node, expected_vars) {
    if (node.type === 'block') {
        traverse(node.child[0], expected_vars);
        node.fn = variables => node.child[0].fn(variables);
    } else if (node.type === 'unary_operator') {
        traverse(node.child, expected_vars);
        
        if (node.operator === '+')
            node.fn = vars => node.child.fn(vars);
        else if (node.operator === '-')
            node.fn = vars => -node.child.fn(vars);
    } else if (node.type === 'binary_operator'){
        traverse(node.left, expected_vars);
        traverse(node.right, expected_vars);
        
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
    } else if (node.type === 'variable') {
        if (!expected_vars.includes(node.name))
            throw Error(`Unexpected variable ${node.name}`);
        node.fn = vars => vars[node.name];
    }
}

function evaluate(expression, expected_variables) {
    let tokens = lexer(expression);
    tokens = syntax_check(tokens);
    let parse_tree = parse(tokens);

    let evaluate_tree = {};
    Object.assign(evaluate_tree, parse_tree);

    traverse(evaluate_tree, expected_variables);

    return variables => {
        for (let v of expected_variables)
            if (!variables.hasOwnProperty(v))
                throw Error(`Missing value for variable ${v}`);
        
        return evaluate_tree.fn(variables);
    };
}

module.exports = { evaluate };

if (!module.parent) {
    let str = "((x + 5) / (3 - y))";
    console.log(str);
    let expression = evaluate(str, ['x', 'y']);
    console.log(expression({ x: 2, y: 5 }));

    str = "(-(-x + 5) / (-3 + y))";
    console.log(str);
    expression = evaluate(str, ['x', 'y']);
    console.log(expression({ x: 4, y: 1 }));

    str = "+4(x + 3x)(-9 - x)"
    console.log(str);
    expression = evaluate(str, ['x']);
    console.log(expression({ x: 5 }));
}
