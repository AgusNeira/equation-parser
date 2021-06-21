const { lexer } = require('./lexer.js');
const { syntax_check } = require('./syntax_check.js');
const { parentheses } = require('./parentheses.js');
const { parse } = require('./parse.js');
const { evaluate, fastEvaluate } = require('./evaluator.js');
const { functionsTime } = require('./functions_time.js');

function testLexer() {
    let str = "((x + 5) / (3,5 - y))";
    let [tokens, unknowns] = lexer(str);

    console.log(`Expression: ${str}`);
    console.log(`Tokens: `, tokens);
    console.log(`Unknowns: ${unknowns}`);

    str = "(-(-x + 5) / (-3.5 + y))";
    [tokens, unknowns] = lexer(str);
    
    console.log(`Expression: ${str}`);
    console.log(`Tokens: `, tokens);
    console.log(`Unknowns: ${unknowns}`);

    str = "(x + 3 * x)(-9 - x)";
    [tokens, unknowns] = lexer(str);

    console.log(`Expression: ${str}`);
    console.log(`Tokens: `, tokens);
    console.log(`Unknowns: ${unknowns}`);
}

function testSyntaxCheck() {
    let str = "((x + 5) / -(3 - y))";
    let [tokens, unknowns] = lexer(str);

    console.log(`Expression: ${str}`);
    console.log(`Tokens: `, lexer(str));
    console.log(`Unknowns encountered: ${unknowns}`);
    console.log(`Tokens after syntax check: `, syntax_check(tokens));

    str = "(-(-x ++ 5) / +(-3 +- y))";
    [tokens, unknowns] = lexer(str);

    console.log(`Expression: ${str}`);
    console.log(`Tokens: `, lexer(str));
    console.log(`Unknowns encountered: ${unknowns}`);
    console.log(`Tokens after syntax check: `, syntax_check(tokens));
    
    str = "+4(x + 3x) * -(-9 -+ x)";
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

function testParentheses() {
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

function testParser() {
    let str = "((x + 5) / -(3 - y))";
    let [tokens, unknowns] = lexer(str);
    tokens = syntax_check(tokens);
    let tree = parse(tokens);

    console.log(`Expression: ${str}`);
    console.log("Tree: ");
    console.dir(tree, { depth: null });
    console.log(`Unknowns encountered: ${unknowns}`);

    str = "(-(-x + 5) / +(-3 + y))";
    [tokens, unknowns] = lexer(str);
    tokens = syntax_check(tokens);
    tree = parse(tokens);

    console.log(`Expression: ${str}`);
    console.log("Tree: ");
    console.dir(tree, { depth: null });
    console.log(`Unknowns encountered: ${unknowns}`);
    
    str = "+4(x + 0.3x)(-9 - x)";
    [tokens, unknowns] = lexer(str);
    tokens = syntax_check(tokens);
    tree = parse(tokens);

    console.log(`Expression: ${str}`);
    console.log("Tree: ");
    console.dir(tree, { depth: null });
    console.log(`Unknowns encountered: ${unknowns}`);

    str = "0.3x";
    [tokens, unknowns] = lexer(str);
    tokens = syntax_check(tokens);
    tree = parse(tokens);

    console.log(`Expression: ${str}`);
    console.log("Tree: ");
    console.dir(tree, { depth: null });
    console.log(`Unknowns encountered: ${unknowns}`);
}

function testEvaluator() {
    
    console.log('PERFORMANCE EVALUATION');

    const times = process.argv[3] || 10000;
    let str = '((x + 5) / (3 - y))';
    let expression = evaluate(str);

    let time1 = functionsTime(evaluate, times, str);
    let time2 = functionsTime(expression.calc, times, { x: 2, y: 5 });
    let time3 = functionsTime(fastEvaluate, times, str, { x: 2, y: 5 });

    console.log(`Timestamps over ${times} iterations:
    Evaluation tree generation: ${time1}ms
    Calculation with tree: ${time2}ms
    Fast calculation: ${time3}ms`);

    console.log('RESULT EVALUATION');

    str = "((x + 5) / (3 - y))";
    expression = evaluate(str);

    console.log(`Expression: ${str}`);
    console.log(`Result with x=2 and y=5: ${expression.calc({ x: 2, y: 5 })}`);
    console.log(`Fast evaluation: ${fastEvaluate(str, { x: 2, y: 5 })}`);

    str = "(-(-x + 5) / (-3 + y))";
    expression = evaluate(str);

    console.log(`Expression: ${str}`);
    console.log(`Result with x=2 and y=5: ${expression.calc({ x: 2, y: 5 })}`);
    console.log(`Fast evaluation: ${fastEvaluate(str, { x: 2, y: 5 })}`);

    str = "+4(x + 3x)(-9 - x)";
    expression = evaluate(str);

    console.log(`Expression: ${str}`);
    console.log(`Result with x=2: ${expression.calc({ x: 2 })}`);
    console.log(`Fast evaluation: ${fastEvaluate(str, { x: 2})}`);
}

if (process.argv[2] === 'lexer') {
    console.log('****************************** LEXER TEST ********************************');
    testLexer();
} else if (process.argv[2] === 'syntax') {
    console.log('************************** SYNTAX CHECK TEST *****************************');
    testSyntaxCheck();
} else if (process.argv[2] === 'parentheses') {
    console.log('*************************** PARENTHESES TEST *****************************');
    testParentheses();
} else if (process.argv[2] === 'parser') {
    console.log('****************************** PARSER TEST *******************************');
    testParser();
} else if (process.argv[2] === 'evaluator') {
    console.log('**************************** EVALUATOR TEST ******************************');
    testEvaluator();
} else {
    console.log('****************************** LEXER TEST ********************************');
    testLexer();
    console.log('************************** SYNTAX CHECK TEST *****************************');
    testSyntaxCheck();
    console.log('*************************** PARENTHESES TEST *****************************');
    testParentheses();
    console.log('****************************** PARSER TEST *******************************');
    testParser();
    console.log('**************************** EVALUATOR TEST ******************************');
    testEvaluator();
}
