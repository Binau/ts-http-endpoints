import {WsServerInterface} from './ws.server.interface';

export class WsServerParam {
    debug?: boolean = false;
    path?: string = '/';

    onConnect?(wsServer: WsServerInterface) {
    };

    onMessage?(data: any) {
    };

    onClose?() {
    };

    onError?(evt: any) {
    };
}

