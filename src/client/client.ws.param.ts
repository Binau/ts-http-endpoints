export interface ClientWsParam {

    displayDebugLog?: boolean;
    url?: string;
    onConnect?: () => void;
    onMessage?: (data: any) => void;
    onClose?: (evt: Event) => void;
    onError?: (evt: ErrorEvent) => void;

}