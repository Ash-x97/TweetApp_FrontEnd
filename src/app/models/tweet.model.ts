export interface Tweet{
    id?:string;
    loginId:string;
    text:string;
    createdTime?:Date;
    replies?:Reply[];
    likes?:string[];
    tags?:Tag[];
}

export interface Reply{
    loginId:string;
    replyText:string;
    createdTime?:Date;
    tags?:Tag[];
}

export interface Tag{
    taggedUser:string;
    isNotified:boolean;
}