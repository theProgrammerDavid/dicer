import { Server } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import Slave from './slave';
import Client from './client';

const PORT = parseInt(process.env.PORT || '3000', 10) ;

class Master {
    server: HTTPServer;
    io: Server<DefaultEventsMap, DefaultEventsMap>;
    clients: Client[];
    slaves: Slave[];
    constructor() {
        /** for the FUTURE */
        this.clients = [];
        this.slaves = [];
        this.server = createServer();
        this.io = new Server(this.server);
        this.setupHandlers();
    }

    setupHandlers() {
        this.io.on('connection', client => {
            client.on('client:register', data => {
                // Register a client add it on the array
             });
            client.on('client:execute', data => {
                // Select a random slave and send master:execute event to it, and then
                // send back response to this client
            });
            client.on('slave:register', data => { 
                // Add slave to array of slaves
                console.log(data);
            });
            client.on('disconnect', () => { });
        });
    }

    listen(port: number) {
        console.log(`Master server listening on port ${port}`);
        this.server.listen(port);
    }
}


const master = new Master();
master.listen(PORT);
