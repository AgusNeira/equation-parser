export function parenthesis(str) {
    let currLevel = 0;
    const LEFT_BRACKET = "(";
    const RIGHT_BRACKET = ")";

    let nodes = [{
        start: 0,
        end: str.length,
        level: 0,
        children: []
    }];
    let currNodeIndex = 0;

    for (let i = 0; i < str.length; i++){
        if (str[i] === LEFT_BRACKET) {
            currLevel++;
            let newNode = {
                start: i,
                level: currLevel,
                parent: currNodeIndex,
                children: []
            };
            nodes.push(newNode);
            nodes[currNodeIndex].children.push(nodes.length - 1);
            currNodeIndex = nodes.length - 1;
        }
        else if (str[i] === RIGHT_BRACKET) {
            if (currLevel === 0) throw Error("Wrong syntax");

            currLevel--;
            nodes[currNodeIndex].end = i + 1;
            currNodeIndex = nodes[currNodeIndex].parent;
        }
    }
    return nodes;
}

import { fileURLToPath } from 'url';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    let str = "((x + 5) / (3 - y)) = 2";
    console.log(str);
    console.log(parenthesis(str));

    str = "(1 / x) = y ^ (2)"
    console.log(str);
    console.log(parenthesis(str));
}
