import { Server } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import Slave from './slave';
import Client from './client';
import { SlaveExecute, SlaveRegiser } from '../protocol';

const PORT = parseInt(process.env.PORT || '3000', 10) ;

class Master {
    server: HTTPServer;
    io: Server<DefaultEventsMap, DefaultEventsMap>;
    clients: Client[];
    slaves: Slave[];
    count: number;
    constructor() {
        /** for the FUTURE */
        this.clients = [];
        this.slaves = [];
        this.count = 0;
        this.server = createServer();
        this.io = new Server(this.server);
        this.setupHandlers();
    }

    setupHandlers() {
        this.io.on('connection', client => {
            let type = "unkown";
            let slaveId = "";
            client.on('client:register', data => {
                type="client";
                // Register a client add it on the array
             });
            client.on('client:execute', async (data: SlaveExecute, cb) => {
                cb(await this.slaves[this.count % this.slaves.length].execute(data));
                this.count += 1;
            });
            client.on('slave:register', (data: SlaveRegiser) => {
                const newSlave = new Slave(data.id, client);
                type = "slave";
                slaveId = data.id;
                this.slaves.push(newSlave);
                console.log(`Registered new slave: ${newSlave.id}`);
            });
            client.on('disconnect', () => { 
                if (type === "slave") {
                    for (let i = 0; i < this.slaves.length; i++) {
                        const slave = this.slaves[i];
                        if (slave.id === slaveId) {
                            console.log(`Removing slave ${slaveId} due to disconnect`);
                            this.slaves.splice(i, 1);
                            break;
                        }
                    }
                }
            });
        });
    }

    listen(port: number) {
        console.log(`Master server listening on port ${port}`);
        this.server.listen(port);
    }
}


const master = new Master();
master.listen(PORT);
