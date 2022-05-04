export interface IActionLog {
    id?: string;
    userId?: string;
    accessedAt?: number;
    duration?: number;
    hostIp?: string;
    httpCode?: number;
    method?: string;
    module?: string;
    remoteIp?: string;
    requestParam?: string;
    requestPayload?: string;
    responsePayload?: string;
    sentAt?: number;
    uri?: string;
    createdAt?: string;
}

export class ActionLog implements IActionLog {
    constructor(
       public id?: string,
       public userId?: string,
       public accessedAt?: number,
       public duration?: number,
       public hostIp?: string,
       public httpCode?: number,
       public method?: string,
       public module?: string,
       public remoteIp?: string,
       public requestParam?: string,
       public requestPayload?: string,
       public responsePayload?: string,
       public sentAt?: number,
       public uri?: string,
       public createdAt?: string,
    ) {
        this.id = id;
        this.userId = userId;
        this.accessedAt = accessedAt;
        this.duration = duration;
        this.hostIp = hostIp;
        this.httpCode = httpCode;
        this.method = method;
        this.module = module;
        this.remoteIp = remoteIp;
        this.requestParam = requestParam;
        this.requestPayload = requestPayload;
        this.responsePayload = responsePayload;
        this.sentAt = sentAt;
        this.uri = uri;
        this.createdAt = createdAt;
    }
}
