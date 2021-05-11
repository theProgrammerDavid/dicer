import assert from 'assert';
import Library, { testingEnv } from '../library';
import { SlaveResponse } from '../protocol';

const masterEndpoint = process.env.MASTER || "http://localhost:3000";

const lib = new Library(masterEndpoint);
testingEnv();

class Job {
    @lib.exec
    static square(x: number): any {
        return x ** 2;
    }
    @lib.exec
    static cube(x: number): any {
        return x ** 3;
    }

    @lib.exec
    static sqrt(x: number): any {
        return Math.sqrt(x);
    }
    @lib.exec
    static arrayMult(x: number[], y: number[]): any {
        let ans = [];
        for (let i = 0; i < 9; i++) {
            ans.push(x[i] * y[i]);
        }
        return ans;
    }

    @lib.exec
    static matMul(a: number[][], b: number[][]): any {
        var aNumRows = a.length, aNumCols = a[0].length,
            bNumRows = b.length, bNumCols = b[0].length,
            m = new Array(aNumRows);  // initialize array of rows
        for (var r = 0; r < aNumRows; ++r) {
            m[r] = new Array(bNumCols); // initialize the current row
            for (var c = 0; c < bNumCols; ++c) {
                m[r][c] = 0;             // initialize the current cell
                for (var i = 0; i < aNumCols; ++i) {
                    m[r][c] += a[r][i] * b[i][c];
                }
            }
        }
        return m;
    }
}

describe('Simple Math Test', () => {
    it('Square of 2', async () => {
        const res: SlaveResponse = await Job.square(2)
        assert.strictEqual(res.result, 4);
    });
    it('Cube of 3', async () => {
        const res: SlaveResponse = await Job.cube(3)
        assert.strictEqual(res.result, 27);
    });
    it('Sqrt of 9', async () => {
        const res: SlaveResponse = await Job.sqrt(9)
        assert.strictEqual(res.result, 3);
    });
    it('Array Multiplilcatin', async () => {

        let arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let arr2 = [10, 11, 12, 13, 14, 15, 16, 17, 18]

        const res: SlaveResponse = await Job.arrayMult(arr1, arr2);
        assert.deepStrictEqual(res.result, [10, 22, 36, 52, 70, 90, 112, 136, 162]);
    });
    it('Matrix Multiplication', async () => {
        let mat1 = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ];
        let mat2 = [
            [10, 11, 12],
            [13, 14, 15],
            [16, 17, 18]
        ];
        const res: SlaveResponse = await Job.matMul(mat1, mat2);
        assert.deepStrictEqual(res.result, [[84, 90, 96], [201, 216, 231], [318, 342, 366]]);
    })
});