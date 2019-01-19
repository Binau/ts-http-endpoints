import {ParameterizedContext} from 'koa';

export class HttpServerParams {

    public path?: string;
    public callBack?: (koaContext: ParameterizedContext) => any;
    public method?: string;

}
