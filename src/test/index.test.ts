import assert from 'assert';
import Library, {testingEnv} from '../library';
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
    static sqrt(x:number):any{
        return Math.sqrt(x);
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
});