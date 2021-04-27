import assert from 'assert';
import Library from '../library';
import { SlaveResponse } from '../protocol';

const masterEndpoint = process.env.MASTER || "http://localhost:3000";

const lib = new Library(masterEndpoint);

class Job {
    @lib.exec
    static square(x: number): any {
        return x ** 2;
    }
    @lib.exec
    static cube(x: number): any {
        return x ** 3;
    }
}

describe('Simple Math Test', () => {
    it('should return 4', async () => {
        const res: SlaveResponse = await Job.square(2)
        assert.strictEqual(res.result, 4);
    });
    it('should return 27', async () => {
        const res: SlaveResponse = await Job.cube(3)
        assert.strictEqual(res.result, 27);
    });
});