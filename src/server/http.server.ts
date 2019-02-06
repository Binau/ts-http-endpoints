import * as Http from 'http';
import * as Url from 'url';

import * as Koa from 'koa';
import * as KoaPathMatch from 'koa-path-match';
import * as KoaBodyParser from 'koa-bodyparser';
import * as KoaCompose from 'koa-compose';
import {HttpServerParams} from './http.server.params';
import {ParameterizedContext} from 'koa';

import * as Ws from 'ws';
import {WsServer} from './ws.server';
import {WsServerParam} from './ws.server.param';

export class HttpServer {

    public static DEFAULT_PORT: number = 3000;

    // Applications
    // node
    private nodeApp: any;
    // koa
    private koaApp: any;
    //ws
    private wsApp: any;

    // Route manager
    private koaPathMath = KoaPathMatch();
    private routes: Map<string, any> = new Map();
    private wsRouteMiddlewares: any[] = [];

    /**
     *
     */
    constructor(
        public displayLog = false
    ) {
        // Chargement des serveur
        // koa + koa bordy parser
        this.koaApp = new Koa();
        this.koaApp.use(KoaBodyParser({
            enableTypes: ['text', 'json', 'form'],
        }));
        // Node
        this.nodeApp = Http.createServer(this.koaApp.callback());
        // Ws
        this.wsApp = new Ws.Server({server: this.nodeApp});
    }

    /**
     * Chargement d'un module ws
     * @param serverCtor
     * @param path
     * @param ctorArgs
     */
    public ws(wsParam: WsServerParam): this {

        // Init des valeurs par defaut
        wsParam = wsParam || {};
        wsParam.debug = true;
        wsParam.path = wsParam.path || '/';
        wsParam.onConnect = wsParam.onConnect || (() => {
        });
        wsParam.onMessage = wsParam.onMessage || (() => {
        });
        wsParam.onClose = wsParam.onClose || (() => {
        });
        wsParam.onError = wsParam.onError || (() => {
        });

        //
        this.log(`Load [WS] ${wsParam.path}`);

        let route = this.koaPathMath(wsParam.path, (ctx) => {
            try {
                let server = new WsServer(ctx, wsParam);
                server.connected();
            } catch (e) {
                this.log(`[WS] ERROR : `, e);
            }
        });
        this.wsRouteMiddlewares.push(route);


        return this;
    }

    /**
     *
     * @param path
     * @param callback
     */
    public get(callback: (koaContext: ParameterizedContext) => any, path?: string): this {
        let param: HttpServerParams = {
            callBack: callback,
            method: 'GET',
            path: path
        };

        return this.loadHttp(param);
    }

    /**
     *
     * @param path
     * @param callback
     */
    public post(callback: (koaContext: ParameterizedContext) => any, path?: string): this {
        let param: HttpServerParams = {
            callBack: callback,
            method: 'POST',
            path: path
        };

        return this.loadHttp(param);
    }

    /**
     *
     * @param path
     * @param callback
     */
    public put(callback: (koaContext: ParameterizedContext) => any, path?: string): this {
        let param: HttpServerParams = {
            callBack: callback,
            method: 'PUT',
            path: path
        };

        return this.loadHttp(param);
    }

    /**
     *
     * @param path
     * @param callback
     */
    public delete(callback: (koaContext: ParameterizedContext) => any, path?: string): this {
        let param: HttpServerParams = {
            callBack: callback,
            method: 'DELETE',
            path: path
        };

        return this.loadHttp(param);
    }

    /**
     * Chargement d'un module http
     * @param module
     * @param {string} path
     */
    private loadHttp(param: HttpServerParams): this {

        if (!param) return;
        param.path = param.path || '';
        param.method = param.method || 'GET';

        this.log(`Load [${param.method}] ${param.path}`);


        let route = this.routes.get(param.path);
        if (!route) {
            route = this.koaPathMath(param.path || '');
            this.routes.set(param.path, route);
            this.koaApp.use(route);
        }

        // Gestion de l'appel pour ce chemin/method
        route[param.method.toLowerCase()](async (ctx, next) => {

            // On appel le traitement prévu
            let ret = await param.callBack(ctx);
            this.log(`(${ctx.request.method}) ${JSON.stringify(ctx.request.body)} => ${ctx.url} =>`, ret);

            // On retourne le body (string ou object)
            ret = ret == null ? '' : ret;
            ctx.body = ret;
            next();
        });


        return this;
    }

    /**
     * Listen
     */
    public listen(port = HttpServer.DEFAULT_PORT): Promise<void> {

        this.wsApp.on('connection', (ws, req) => {
            // Creation du context
            let koaContext = this.koaApp.createContext(req);
            koaContext.websocket = ws;
            koaContext.path = Url.parse(req.url).pathname;

            // Appel des middlewares pour le routage
            let routeMiddleWareCompose = KoaCompose(this.wsRouteMiddlewares);
            routeMiddleWareCompose(koaContext);
        });

        this.log('Try starting ...');
        return new Promise<void>((res, rej) => {

            this.nodeApp.listen({
                    port: port,
                    host: 'localhost'
                },
                () => {
                    this.log(`Listen : ${port}`);
                    res();
                });
        });


    }

    /**
     * Close
     * @returns {Promise<void>}
     */
    public close(): Promise<void> {
        return new Promise<void>((res, rej) => {
            this.nodeApp.close(() => {
                this.log(`Close`);
                res();
            });
        });
    }


    /**
     *
     * @param {string} log
     * @param e
     */
    private log(log: string, e?: any): void {

        if (!this.displayLog) return;

        let params: any[] = [`(SERVER) ${log}`];
        if (e) params.push(e);

        console.log.apply(console, params);
    }


}