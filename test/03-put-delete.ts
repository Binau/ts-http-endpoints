import {assert} from 'chai';
import {HttpServer} from '../src/server/http.server';
import {HttpClient} from '../src/client/http.client';

describe('Put', function () {


    describe('Appel', function () {

        it('Test path param, query /chemin5?val=6 string in/out', async () => {
            let testOk = false;
            let testIn = false;

            // Creation server
            const server: HttpServer = new HttpServer();
            server.put(async ctx => {
                testOk = (ctx.params.id === '5' && ctx.query.val === '6');
                testIn = ctx.request.body === 'PLIP';
                return 'RET';
            }, '/chemin:id').listen(7845);

            // On attend la fin de l'appel
            const ret = await HttpClient.put('http://localhost:7845/chemin5?val=6', 'PLIP');

            // Test si on est passé dans le callback
            assert.isOk(testOk);
            assert.isOk(testIn);
            assert.equal(ret, 'RET');

            // Fermeture du serveur
            await server.close();
        });


    });

});
describe('Delete', function () {


    describe('Appel', function () {

        it('Test path param, query /chemin7?val=8 string in/out', async () => {
            let testOk = false;

            // Creation server
            const server: HttpServer = new HttpServer(true);
            server.delete(async ctx => {
                testOk = (ctx.params.id === '7' && ctx.query.val === '8');
                return 'RET';
            }, '/chemin:id').listen(7845);

            // On attend la fin de l'appel
            const ret = await HttpClient.delete('http://localhost:7845/chemin7?val=8', true);

            // Test si on est passé dans le callback
            assert.isOk(testOk);
            assert.equal(ret, 'RET');

            // Fermeture du serveur
            await server.close();
        });


    });

});
describe('Conflits Http', function () {


    it('Test methods ', async () => {
        let testGet = false;
        let testPost = false;
        let testPut = false;
        let testDelete = false;

        // Creation server
        const server: HttpServer = new HttpServer(true);
        server
            .get(async ctx => testGet = true, '/chemin:id')
            .post(async ctx => testPost = true, '/chemin:id')
            .put(async ctx => testPut = true, '/chemin:id')
            .delete(async ctx => testDelete = true, '/chemin:id')
            .listen(7845);

        // On attend la fin de l'appel
        await Promise.all([
            HttpClient.get('http://localhost:7845/chemin7?val=8', true),
            HttpClient.post('http://localhost:7845/chemin7?val=8', null, true),
            HttpClient.put('http://localhost:7845/chemin7?val=8', null, true),
            HttpClient.delete('http://localhost:7845/chemin7?val=8', true),
        ]);

        // Tests si on est passé dans les callbacks
        assert.isOk(testGet);
        assert.isOk(testPost);
        assert.isOk(testPut);
        assert.isOk(testDelete);

        // Fermeture du serveur
        await server.close();
    });


});