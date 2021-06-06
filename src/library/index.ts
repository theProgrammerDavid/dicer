import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { SlaveExecute, SlaveResponse } from "../protocol";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export default class Library {
  constructor(masterEndpoint: string) {
    socket = io(masterEndpoint);
  }
  exec(
    target: Object,
    propertyKey: string, // Name of the method called
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = (...args: any[]): Promise<SlaveResponse> => {
      return new Promise((resolve, reject) => {
        const execMsg: SlaveExecute = {
          fn: originalMethod.toString(),
          args,
        };
        socket.emit("client:execute", execMsg, (res: SlaveResponse) => {
          if (res.error) {
            reject(res.error);
          } else {
            resolve(res);
          }
        });
      });
    };
    return descriptor;
  }
}
