import {assert} from 'chai';
import {HttpServer} from '../src/server/http.server';
import {HttpClient} from '../src/client/http.client';

describe('Get', function () {


    describe('Path', function () {

        it('Test path root /', async () => {
            let testOk = false;

            // Creation server
            const server: HttpServer = new HttpServer();
            server.displayLog = false;
            server.get(() => testOk = true).listen(7845);

            // On attend la fin de l'appel
            await HttpClient.get('http://localhost:7845');

            // Test si on est passé dans le callback
            assert.isOk(testOk);

            // Fermeture du serveur
            await server.close();
        });

        it('Test simple path /chemin', async () => {
            let testOk = false;

            // Creation server
            const server: HttpServer = new HttpServer();
            server.displayLog = false;
            server.get(() => testOk = true, '/chemin').listen(7845);

            // On attend la fin de l'appel
            await HttpClient.get('http://localhost:7845/chemin');

            // Test si on est passé dans le callback
            assert.isOk(testOk);

            // Fermeture du serveur
            await server.close();
        });

        it('Test path param /chemin:id', async () => {
            let testOk = false;

            // Creation server
            const server: HttpServer = new HttpServer();
            server.displayLog = false;
            server.get(p => testOk = p.params.id === '8', '/chemin:id').listen(7845);

            // On attend la fin de l'appel
            await HttpClient.get('http://localhost:7845/chemin8');

            // Test si on est passé dans le callback
            assert.isOk(testOk);

            // Fermeture du serveur
            await server.close();
        });

        it('Test path query /chemin?val=8', async () => {
            let testOk = false;

            // Creation server
            const server: HttpServer = new HttpServer();
            server.displayLog = false;
            server.get(p => testOk = p.query.val === '8', '/chemin').listen(7845);

            // On attend la fin de l'appel
            await HttpClient.get('http://localhost:7845/chemin?val=8');

            // Test si on est passé dans le callback
            assert.isOk(testOk);

            // Fermeture du serveur
            await server.close();
        });


    });

    describe('Body', function () {

        it('Test body string out', async () => {

            // Creation server
            const server: HttpServer = new HttpServer();
            server.get(async ctx => {
                return 'testOk';
            }).listen(7845);

            // On attend la fin de l'appel
            const ret: string = await HttpClient.get('http://localhost:7845');

            // Test si on est passé dans le callback
            assert.isOk(ret);
            assert.isOk(ret === 'testOk');

            // Fermeture du serveur
            await server.close();
        });
        it('Test body obj out', async () => {

            // Creation server
            const server: HttpServer = new HttpServer();
            server.get(async ctx => {
                return {testOk : true};
            }).listen(7845);

            // On attend la fin de l'appel
            const ret: any = await HttpClient.get('http://localhost:7845');

            // Test si on est passé dans le callback
            assert.isOk(ret);
            assert.isOk(ret.testOk);

            // Fermeture du serveur
            await server.close();
        });
    });



});