
Une solution pour creer facilement un serveur http.

```ts
// Dependences
import {HttpServer} from '../src/server/http.server';

 // Creation server
 const server: HttpServer = new HttpServer(); // new HttpServer(true) pour afficher des logs
 
 server
   // Declaration d'un callback sur le chemin /hello et method GET
   .get(async ctx => 'Hello !', '/hello')
   // Démarrage du serveur
   .listen(9495);

```

# Installation avec npm
```
npm install --save http-typescript
```

# Documentation

// Arrive bientôt

# Journal des modifications
 - 2019-01-13 : [1.0.3] Ajout connection ws
 - 2019-01-13 : [1.0.2] Mise à jour de la documentation
 - 2019-01-13 : [1.0.1] Initialisation d'une version pour GET/POST/PUT et DELETE

# Licence
CC BY 4.0 : https://creativecommons.org/licenses/by/4.0/
