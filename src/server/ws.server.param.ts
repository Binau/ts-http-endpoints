
import {WsServerInterface} from './ws.server.interface';

export class WsServerParam {
    debug?: boolean = false;
    path?: string = '/';
    onConnect?: (wsServer: WsServerInterface) => void = (() => {
    });
    onMessage?: (data: any) => void = (() => {
    });
    onClose?: () => void = (() => {
    });
    onError?: () => void = (() => {
    });
}

