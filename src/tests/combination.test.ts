import { combination } from '../utils/combinations';

function factorial(x:number):number {
    if(x==0) return 1;
    return x * factorial(x-1);
}

function binomialCoefficient(a:number, b:number):number {
    let numerator: number = factorial(a);
    let denominator:number = factorial(a-b) *  factorial(b);
    return numerator / denominator;
}

describe('combination generator', ()=>{
    describe('special cases', ()=>{
        describe('when length greater than collection',()=>{
            it('should return empty array',()=>{
                const result = combination<number>([1,2],3);
                expect(result).toEqual([]);
            })
        })
        describe('when length < 1',()=>{
            it('should return empty array',()=>{
                const result = combination<number>([1,2],0);
                expect(result).toEqual([]);
            })
        })
        describe('when collection is empty',()=>{
            it('should return empty array',()=>{
                const result = combination<number>([],0);
                expect(result).toEqual([]);
            })
        })
    })

    describe('when length is valid',()=> {
        describe('for different types', () => {
            it('should return the result of the correct type', () => {
                const intResult = combination<number>([1, 2], 1);
                expect(typeof intResult[0][0]).toEqual("number")
                const boolResult = combination<boolean>([true, false], 1);
                expect(typeof boolResult[0][0]).toEqual("boolean")
            })
        });
        describe('for any collection length', () => {
            it('should return result length of the binomial coefficient', () => {
                const arrayLength: number = Math.floor(Math.random() * 5) + 2;
                const combinationLength: number = Math.floor(Math.random() * (arrayLength-1)) + 1;
                const collection: number[] = Array.from(Array(arrayLength).keys())
                const result = combination<number>(collection, combinationLength);
                const binomial: number = binomialCoefficient(collection.length, combinationLength);
                expect(result.length).toBe(binomial)
            });
        });
    });
});
