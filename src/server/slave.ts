import { Socket } from "socket.io";
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SlaveExecute, SlaveResponse } from "../protocol";

export default class Slave {
    client: Socket<DefaultEventsMap, DefaultEventsMap>;
    id: string;
    constructor(id: string, client: Socket<DefaultEventsMap, DefaultEventsMap>) {
        this.id = id;
        this.client = client;
    }

    execute(msg: SlaveExecute) {
        return new Promise((resolve, reject) => {
            this.client.emit("master:execute", msg, (res: SlaveResponse) => {
                resolve(res);
            });
        });
    }
}