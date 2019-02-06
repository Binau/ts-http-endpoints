import {WsServerParam} from './ws.server.param';
import {ParameterizedContext} from 'koa';

export interface WsServerInterface {

    koaContext: ParameterizedContext;
    wsServerParam: WsServerParam;

    /**
     * Envoi des données
     * @param data
     */
    send(data: any): void;

    /**
     * Fermeture de la connection
     */
    closeConnection(): void;

}

