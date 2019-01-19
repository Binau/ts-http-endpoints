
import { ClientWebWs } from './client.web.ws';
import * as WebSocket from 'ws';
import {ClientWsParam} from './client.ws.param';

export class ClientNodeWs extends ClientWebWs {
    constructor(clientParam: ClientWsParam) {
        super(clientParam, WebSocket);
    }
}
