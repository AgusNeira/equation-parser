
// Example string:
// (x + 5) / (3 - y) = 2

function bracketEvaluator(str) {
    let currLevel = 0;
    let blocks = [];
    const LEFT_BRACKET = "(";
    const RIGHT_BRACKET = ")";

    blocks[0] = {
        level: 0,
        startIndex: 0
    };

    for (let i = 0; i < str.length; i++){
        if (str[i] === LEFT_BRACKET) {
            if (i === 0) {
                currLevel++;
                blocks[0] = { level: currLevel, startIndex: 0 };
            } else {
                currLevel++;
                blocks.push({
                    level: currLevel,
                    startIndex: i
                });
            }
        }
        else if (str[i] === RIGHT_BRACKET) {
            if (currLevel == 0) throw Error("Wrong syntax");

            currLevel--;
            blocks.push({
                level: currLevel,
                startIndex: i
            });
        }
    }
    return blocks;
}

let str = "((x + 5) / (3 - y)) = 2";
console.log(str);
console.log(bracketEvaluator(str));
