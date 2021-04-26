import Library from '../library';

const masterEndpoint = process.env.MASTER || "http://localhost:3000";

const lib = new Library(masterEndpoint);

class Job {
    @lib.exec
    static square(x: number) {
        return x ** 2;
    }
}

async function main() {
    const res = await Promise.all([...Array(5).keys()].map((i) =>
        Job.square(i)
    ));
    console.log(res);
}

main()