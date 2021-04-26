function functionsTime(fn, times, ...args) {
    let start, end;

    start = new Date().getTime();
    for (let i = 0; i < times; i++)
        fn(...args);
    end = new Date().getTime();

    return end - start;
}

module.exports = { functionsTime };
