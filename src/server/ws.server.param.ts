import {WsServer} from './ws.server';

export interface WsServerParam {
    debug?: boolean;
    path?: string;
    onConnect?: (wsServer: WsServer) => void;
    onMessage?: (data: any) => void;
    onClose?: () => void;
    onError?: () => void;
}

