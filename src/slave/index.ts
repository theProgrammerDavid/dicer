import { io, Socket } from "socket.io-client";
import { customAlphabet } from 'nanoid'
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SlaveExecute, SlaveResponse } from "../protocol";
const { performance } = require('perf_hooks');

const nanoid = customAlphabet('1234567890', 8)

export default class Slave {
    slaveId: string;
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    constructor(masterEndpoint: string) {
        this.slaveId = `${nanoid()}`;
        this.socket = io(masterEndpoint);
        console.log(`Slave ID: ${this.slaveId} registering on master ${masterEndpoint}`);

        this.setupSlave();
    }

    setupSlave() {
        this.socket.emit("slave:register", {
            id: this.slaveId,
        });
        this.socket.on("master:execute", (data: SlaveExecute, cb: (response: SlaveResponse) => void) => {
            // Ececute function send back response
            console.log(`Slave-${this.slaveId} executing for fn: ${data.fn} args: ${data.args}`);
            try {
                let t0: number = performance.now();
                let fn = Function(`return ${data.fn}`)();
                let resp: SlaveResponse = fn(...data.args);

                let t1 = performance.now();

                cb({ result: resp, time: t1 - t0 })
            }
            catch (e) {
                console.log(e);
                cb({ result: null, time: 0, error: e })
            }
        });
    }
}


const s = new Slave(process.env.MASTER || "http://localhost:3000");

