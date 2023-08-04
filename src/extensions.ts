export function waitforCondition<T>(method: () => T, maxWait: number = 1000): T | undefined {
    let result = undefined;
    let i = 0;
    while (result === undefined && i < maxWait) {
        result = method();
        i++;
    }
    return result;
}

export function runDetached(method: (() => any)) {
    setTimeout(method, 0);
}