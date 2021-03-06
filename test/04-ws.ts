import {assert} from 'chai';
import {HttpServer} from '../src/server/http.server';
import {ClientNodeWs} from '../src/client/client.node.ws';
import {WsServerInterface} from '../src';

describe('Ws', function () {


    describe('Simple root connection', function () {

        it('Test ws connection /', async () => {
            // Creation server
            const server: HttpServer = new HttpServer();
            await server
                .ws()
                .listen(7845);

            // On attend la fin de l'appel
            const clientWs = new ClientNodeWs({
                url: 'http://localhost:7845/',
                displayDebugLog: true
            });

            await clientWs.connect();
            clientWs.close();

            // Test si on est passé dans le callback
            assert.isOk(true);

            // Fermeture du serveur
            await server.close();
        });

        it('Test step order /', async () => {
            let idx = 0;
            let isServerConnectOk = false;
            let isServerMessageOk = false;
            let isServerCloseOk = false;
            let isClientConnectOk = false;
            let isClientMessageOk = false;
            let isClientCloseOk = false;

            // Creation server
            const server: HttpServer = new HttpServer();
            let serverWs: WsServerInterface;
            await server
                .ws({
                    onConnect: (ws) => {
                        serverWs = ws;
                        isServerConnectOk = idx++ === 0;
                    },
                    onMessage: () => {
                        isServerMessageOk = idx++ === 2;
                        serverWs.send('Pong');
                    },
                    onClose: () => {
                        isServerCloseOk = idx++ === 5;

                        assert.isOk(isClientCloseOk);
                        assert.isOk(isServerCloseOk);

                        // Fermeture du serveur
                        server.close();
                    },
                    onError(evt: any) {
                    }
                })
                .listen(7845);

            // On attend la fin de l'appel
            const clientWs = new ClientNodeWs({
                url: 'http://localhost:7845/',
                displayDebugLog: true,
                onConnect: () => {
                    isClientConnectOk = idx++ === 1;
                },
                onMessage: () => {
                    isClientMessageOk = idx++ === 3;
                    clientWs.close();

                    assert.isOk(isServerConnectOk);
                    assert.isOk(isClientConnectOk);
                    assert.isOk(isServerMessageOk);
                    assert.isOk(isClientMessageOk);

                },
                onClose: () => {
                    isClientCloseOk = idx++ === 4;
                },
            });

            await clientWs.connect();
            clientWs.send('Ping');

        });


    });



});



