export function combination<Type>(collection: Type[], combinationLength: number): Type[][] {
    let prefix, suffix: any = [];
    let result: any = [];
    if (collection.length < combinationLength || combinationLength < 1) {
        return []
    };
    if (collection.length === combinationLength) {
        return [collection]
    }

    if (combinationLength === 1) {
        return collection.map(item => [item])
    }
    for (let i = 0; i < (collection.length - combinationLength + 1); i++) {
        prefix = collection.slice(i, i + 1);
        suffix = combination(collection.slice(i + 1), combinationLength - 1)

        for (let j = 0; j < suffix.length; j++) {
            result.push(prefix.concat(suffix[j]));
        }
    }
    return result
}
