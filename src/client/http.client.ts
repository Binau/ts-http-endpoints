import * as HTTP from 'http';
import {HttpRequestParam} from './http.request.param';

export class HttpClient {

    public debug = true;

    constructor() {
    }

    public static get<T>(urlStr: string, debug = false): Promise<T> {
        let client: HttpClient = new HttpClient();
        client.debug = debug;
        return client.request<T>({url: new URL(urlStr), method: 'GET'});
    }

    public static post<T>(urlStr: string, body?: any, debug = false): Promise<T> {
        let client: HttpClient = new HttpClient();
        client.debug = debug;
        return client.request<T>({url: new URL(urlStr), method: 'POST'}, body);
    }

    public static put<T>(urlStr: string, body?: any, debug = false): Promise<T> {
        let client: HttpClient = new HttpClient();
        client.debug = debug;
        return client.request<T>({url: new URL(urlStr), method: 'PUT'}, body);
    }

    public static delete<T>(urlStr: string, debug = false): Promise<T> {
        let client: HttpClient = new HttpClient();
        client.debug = debug;
        return client.request<T>({url: new URL(urlStr), method: 'DELETE'});
    }

    public async request<T>(reqParam: HttpRequestParam, body?: any): Promise<T> {

        return new Promise<any>((res, rej) => {

            // Preparation du body (impact header)
            reqParam.headers = reqParam.headers || {};
            if (body === null) {
                reqParam.body = null;
            } else if (typeof body === 'string') {
                // On envoi du text
                reqParam.headers['Content-Type'] = 'text/plain';
                reqParam.body = body;
            } else {
                // On envoi du json
                reqParam.headers['Content-Type'] = 'application/json';
                reqParam.body = JSON.stringify(body);
            }

            // Récuperation de la méthode
            reqParam.method = reqParam.method.toUpperCase();

            //
            this.logDebug(`(CLIENT) (${reqParam.method.toUpperCase()}) (${reqParam.body ? reqParam.body : ''}) => ${reqParam.url.href}`);

            // node request
            let req = HTTP.request({
                port: reqParam.url.port,
                hostname: reqParam.url.hostname,
                method: reqParam.method,
                path: `${reqParam.url.pathname}${reqParam.url.search}`,
                headers: reqParam.headers
            }, this.onResponse.bind(this, res, rej, reqParam))
                .on('error', (e) => {
                    this.logDebug(`(CLIENT) (${reqParam.method}) ${reqParam.url.href} Error`, e);
                    rej(this.treatError(e));
                });
            // Envoi des data si il y en a
            reqParam.body && req.write(reqParam.body);

            req.end();
        });
    }


    /**
     * Traitement de la réponse HTTP
     * @param res
     * @param rej
     * @param resp
     */
    private onResponse(res, rej, reqParam: HttpRequestParam, resp: any) {

        let respBody = '';

        // Recuperation du body
        resp.on('data', (chunk) => {
            respBody += chunk.toString();
        });

        // Body recupere
        resp.on('end', () => {

            this.logDebug(`(CLIENT) (${reqParam.method}) ${reqParam.url.href} => (${respBody})`);

            // Check Http error
            if (resp.statusCode < 200 || resp.statusCode >= 400) {
                let error = {
                    name: `HTTP${resp.statusCode}`,
                    message: `${resp.statusMessage}`
                };
                rej(this.treatError(error));
            } else {
                try {
                    res(this.treatRespBody(respBody, resp));
                } catch (e) {
                    rej(this.treatError(e));
                }
            }
        });
    }

    private treatRespBody(data: string, resp: Response): any {

        let contentType: string = resp.headers['content-type'];
        let jsData;

        if (!data || data == '') {
            // Si resultat vide
            jsData = null;
        } else if (~contentType.indexOf('application/json')) {
            // C'est du json, on parse
            try {
                jsData = JSON.parse(data);
            } catch (e) {
                let error = new Error(`Parsing de la response invalide : ${data}`);
                error.name = 'ParsingError';
                throw error;
            }

            // Traitement des erreurs fonctionnelles
            // TODO DOCUMENTATION sur les erreurs fonctionnelles
            if (jsData.error) {
                throw jsData.error;
            }
        } else {
            // C'est pas du JSON -> On traite du text brut
            jsData = data;
        }

        return jsData;
    }

    private logDebug(message?: any, ...optionalParams: any[]) {
        if (this.debug) {
            console.log(message, ...optionalParams);
        }
    }

    private treatError(e) {
        console.warn('(CLIENT) Error :', e);
        return e;
    }

}