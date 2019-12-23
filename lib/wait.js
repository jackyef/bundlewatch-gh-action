export function wait(milliseconds) {
    return new Promise(function (resolve) {
        if (isNaN(milliseconds)) {
            throw new Error('milleseconds not a number');
        }
        setTimeout(function () { return resolve("done!"); }, milliseconds);
    });
}
