import {ClientWsParam} from './client.ws.param';

export class ClientWebWs {

    private WebSocket: new (any) => WebSocket;
    private wsClient;

    /**
     * _ctor
     * @param url
     * @param ws
     */
    constructor(private clientParam: ClientWsParam, ws?: new (any) => WebSocket) {
        this.WebSocket = ws || WebSocket;

        // Initialisation des valeurs par defaut
        this.clientParam = this.clientParam || {};
        this.clientParam.displayDebugLog = this.clientParam.displayDebugLog || false;
        this.clientParam.url = this.clientParam.url || '/';
        this.clientParam.onConnect = this.clientParam.onConnect || (() => {
        });
        this.clientParam.onMessage = this.clientParam.onMessage || (() => {
        });
        this.clientParam.onClose = this.clientParam.onClose || (() => {
        });
        this.clientParam.onError = this.clientParam.onError || (() => {
        });
    }

    /**
     * Connection au websocket
     * @returns {Promise<void>}
     */
    public connect(): Promise<void> {
        this.logDebug(`Connect`);
        this.wsClient = new this.WebSocket(this.clientParam.url);

        this.wsClient.onclose = this.internalOnClose.bind(this);
        this.wsClient.onmessage = this.internalOnMessage.bind(this);

        return new Promise((res, rej) => {
            this.wsClient.onerror = (e) => {
                this.internalOnError(e);
                rej(e);
            };
            this.wsClient.onopen = () => {
                this.wsClient.onerror = this.internalOnError.bind(this);
                this.logDebug(`Open`);
                this.clientParam.onConnect();
                res();
            };
        });
    }

    /**
     * Gestion interne lors du close
     * @param evt
     * @param cb
     */
    private internalOnClose(evt: Event) {
        this.logDebug(`Close`);
        this.clientParam.onClose(evt);
    }

    private internalOnError(evt: ErrorEvent) {
        this.logDebug(`Error : ${evt.message}`);
        this.clientParam.onError(evt);
    }

    private internalOnMessage(evt: MessageEvent) {

        let data: any = evt.data;
        this.logDebug(` => (${data})`);
        try {
            data = JSON.parse(evt.data);
        } catch (e) { // do nothing
        }

        this.clientParam.onMessage(data);
    }

    /**
     * Envoi d'une données
     * @param data
     * @returns {Ws}
     */
    public send(data): this {

        // Transformation des données en string
        let message: string;
        if (typeof data == 'string') {
            message = data;
        } else {
            message = JSON.stringify(data);
        }

        // Log
        this.logDebug(`(${message}) => ${this.clientParam.url}`);

        // Envoi du message
        try {
            this.wsClient.send(message);
        } catch (e) {
            this.wsClient.onerror(e);
        }

        return this;
    }

    /**
     * Fermeture du websocket
     */
    public close(): void {
        this.wsClient.close();
    }

    /**
     *
     * @param {string} log
     * @param e
     */
    private logDebug(log: string, e?: any): void {

        if (!this.clientParam.displayDebugLog) return;

        let params: any[] = [`(CLIENT WS) ${this.clientParam.url} ${log}`];
        if (e) params.push(e);

        console.log.apply(console, params);
    }

}