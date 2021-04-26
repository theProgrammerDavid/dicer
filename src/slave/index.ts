import { io } from "socket.io-client";
import { nanoid } from 'nanoid'
import { SlaveExecute } from "../protocol";

const MASTER = process.env.MASTER || "http://localhost:3000";
const slaveId = `slave-${nanoid(6)}`;

const socket = io(MASTER);

console.log(`Slave ID: ${slaveId} registering on master ${MASTER}`);

socket.emit("slave:register", {
    id: slaveId,
});

socket.on("master:execute", (data: SlaveExecute) => {
    // Ececute function send back response
});