/*
 * Parser
 *
 * The most important module. It takes the token list produced from the
 * lexer and depurated by the syntax checker, and generates an expression
 * tree, that takes into account operator precedence and has the
 * appropiate structure to be traversed and evaluated.
 */

const { parentheses } = require('./parentheses.js');

const binary_operators = {
    '+': 1, '-': 1,
    '*': 2, '/': 2,
    '^': 3
};

function traverse(parse_tree, fn) {
    if (parse_tree.length > 1) fn(parse_tree);

    for (let node of parse_tree) {
        if (node.type === 'block') {
            traverse(node.child, fn);

        } else if (node.type === 'unary_operator' && node.child){
            traverse([node.child], fn);

        } else if (node.type === 'binary_operator'){
            if (node.left) traverse([node.left], fn);
            if (node.right) traverse([node.right], fn);
        }
    }
}

function parseUnaryExpression(node, index, siblings) {
    if (node.type === 'unary_operator' && !node.child) {
        siblings.splice(index, 2, {
            type: node.type,
            operator: node.operator,
            child: siblings[index + 1]
        });
    }
    return index + 1;
}

const parseBinaryExpression = precedence => (node, index, siblings) => {
    if (node.type === 'binary_operator' &&
        binary_operators[node.operator] === precedence &&
        !node.right) {
        siblings.splice(index - 1, 3, {
            type: node.type,
            operator: node.operator,
            left: siblings[index - 1],
            right: siblings[index + 1]
        });
        return index;
    }
    return index + 1;
}

function parse(tokens) {
    let parse_tree = tokens.slice();

    const node_types = {
        UNARY_OPERATOR: 'unary_operator',
        BINARY_OPERATOR: 'binary_operator',
        VARIABLE: 'variable',
        LITERAL: 'literal',
        BLOCK: 'block'
    };
    
    let parens = parentheses(tokens)
        .sort((a, b) => b.level - a.level);       // sort by descending level

    // Nest the parenthesis into block objects
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
    
    // nesting the parsing deeper every time, according to the operator precedence
    traverse(parse_tree, leaves => {
        for (let index = 0; index < leaves.length;) {
            index = parseUnaryExpression(leaves[index], index, leaves);
        }
    });
    for (let precedence = 3; precedence > 0; precedence--) {
        traverse(parse_tree, leaves => {
            for (let index = 0; index < leaves.length;) {
                index = parseBinaryExpression(precedence)(leaves[index], index, leaves);
            }
        });
    }

    if (parse_tree.length !== 1)
        throw Error("Wrong parse! more than one level one block");

    return parse_tree[0];
}

module.exports = { parse };

