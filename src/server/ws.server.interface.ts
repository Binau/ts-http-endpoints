
import {ParameterizedContext} from 'koa';

export interface WsServerInterface {

    koaContext: ParameterizedContext;

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

