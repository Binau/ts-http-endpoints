import {WsServerParam} from './ws.server.param';
import {ParameterizedContext} from 'koa';
import {WsServerInterface} from './ws.server.interface';

export class WsServer implements WsServerInterface{

    public debug: boolean = true;
    public ws: any;

    public constructor(
        public koaContext: ParameterizedContext,
        public wsServerParam: WsServerParam) {
        this.ws = this.koaContext.websocket;

        this.ws.on('message', this._onMessage.bind(this));
        this.ws.on('close', this._onClose.bind(this));
        this.ws.on('error', this._onError.bind(this));
    }

    /**
     * Indique une connection
     */
    public connected() {
        this.logDebug(`onConnect`);
        this.wsServerParam.onConnect(this);
    }

    /**
     * Reception d'un message
     * @param message
     * @private
     */
    private _onMessage(message) {
        if (this.debug) {
            this.logDebug(`onMessage : ${message}`);
        }
        let data: any;
        try {
            data = JSON.parse(message);
        } catch (e) {
            // cas ou ce n'est pas un objet json mais uniquement du texte
            data = message;
        }
        this.wsServerParam.onMessage(data);
    }

    /**
     * Action à la fermeture
     * @private
     */
    protected _onClose() {
        this.logDebug(`onClose`);
        this.wsServerParam.onClose();
    }

    /**
     * Action a la fermeture de la connection
     * @private
     */
    protected _onError(evt) {
        this.logDebug(`onError`);
        this.wsServerParam.onError(evt);
    }

    /**
     * Envoi des données
     * @param data
     */
    public send(data: any): void {

        // Si la connexion n'est pas ouverte
        if (this.ws.readyState !== 1) {
            let errorMsg = `Etat de la connexion invalide : ${this.ws.readyState}`;
            this.logError(`${errorMsg}`);
            this.closeConnection();
            throw new Error(errorMsg);
        }

        let message;
        if (typeof data == 'string') {
            message = data;
        } else {
            message = JSON.stringify(data);
        }

        this.logDebug(`(WS) ${this.wsServerParam.path} => ${message}`);
        this.ws.send(message);
    }

    /**
     * Fermeture de la connection
     */
    public closeConnection() {
        this.ws.close();
    }

    /**
     * Affichage des logs
     * @param message
     */
    private logDebug(message: string) {
        this.debug && console.log(`(WS SERVER) ${this.wsServerParam.path} ${message}`);
    }

    /**
     * Affichage des erreurs
     * @param message
     */
    private logError(message: string) {
        console.error(`(WS SERVER) ${this.wsServerParam.path} ${message}`);
    }

}

