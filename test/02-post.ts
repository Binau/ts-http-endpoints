import {assert} from 'chai';
import {HttpServer} from '../src/server/http.server';
import {HttpClient} from '../src/client/http.client';

describe('Post', function () {


    describe('Path', function () {

        it('Test path param, query /chemin:id?val=8', async () => {
            let testOk = false;

            // Creation server
            const server: HttpServer = new HttpServer();
            server.get(async ctx => {
                testOk = (ctx.params.id === '12' && ctx.query.val === '8');
            }, '/chemin:id').listen(7845);

            // On attend la fin de l'appel
            await HttpClient.get('http://localhost:7845/chemin12?val=8');

            // Test si on est passé dans le callback
            assert.isOk(testOk);

            // Fermeture du serveur
            await server.close();
        });


    });

    describe('Body', function () {

        it('Test body string in/out', async () => {

            // Creation server
            const server: HttpServer = new HttpServer();
            server.post(async ctx => {
                return 'testOk-' + ctx.request.body;
            }).listen(7845);

            // On attend la fin de l'appel
            const ret: string = await HttpClient.post('http://localhost:7845', 'strIn');

            // Test si on est passé dans le callback
            assert.isOk(ret);
            assert.isOk(ret === 'testOk-strIn');

            // Fermeture du serveur
            await server.close();
        });
        it('Test body obj out', async () => {

            // Creation server
            const server: HttpServer = new HttpServer();
            server.post(async ctx => {
                const body = ctx.request.body;
                body.valOut = true;
                return body;
            }).listen(7845);

            // On attend la fin de l'appel
            const ret: any = await HttpClient.post('http://localhost:7845', {valIn: true});

            // Test si on est passé dans le callback
            assert.isOk(ret);
            assert.isOk(ret.valIn);
            assert.isOk(ret.valOut);

            // Fermeture du serveur
            await server.close();
        });
    });

    describe('Multi', function () {

        it('Test get + post on /cheminMulti', async () => {

            let testGet = false;
            let testPost = false;

            // Creation server
            const server: HttpServer = new HttpServer();
            server
                .get(async ctx => testGet = true, '/cheminMulti')
                .post(async ctx => testPost = true, '/cheminMulti')
                .listen(7845);

            // On attend la fin de l'appel
            await HttpClient.get('http://localhost:7845/cheminMulti');
            await HttpClient.post('http://localhost:7845/cheminMulti');

            // Test si on est passé dans le callback
            assert.isOk(testGet);
            assert.isOk(testPost);

            // Fermeture du serveur
            await server.close();
        });
    });

});