import {WsServerInterface} from './ws.server.interface';

export class WsServerParam {

    onConnect(wsServer: WsServerInterface) {
    };

    onMessage(data: any) {
    };

    onClose() {
    };

    onError(evt: any) {
    };
}

