export class HttpRequestParam {

    public url: URL = new URL('https://localhost:443/');

    public method?: string = 'GET';
    public headers? = {};
    public body?: string;

    constructor() {
    }

}