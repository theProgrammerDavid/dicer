import { io } from "socket.io-client";
import { nanoid } from 'nanoid'
import { SlaveExecute, SlaveResponse } from "../protocol";
const { performance } = require('perf_hooks');

const MASTER = process.env.MASTER || "http://localhost:3000";
const slaveId = `slave-${nanoid(6)}`;

const socket = io(MASTER);

console.log(`Slave ID: ${slaveId} registering on master ${MASTER}`);

socket.emit("slave:register", {
    id: slaveId,
});

socket.on("master:execute", (data: SlaveExecute, cb: (response: SlaveResponse) => void) => {
    // Ececute function send back response
    try {
        let t0: number = performance.now();

        let fn = Function(data.fn);
        let resp: SlaveResponse = fn(...data.args);

        let t1 = performance.now();

        cb({ result: resp, time: t1 - t0 })
    }
    catch (e) {
        cb({ result: null, time: 0, error: e })

    }
});