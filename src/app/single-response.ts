
export class SingleResponse {
    status: number;
    data: Info;
}

export class Info {
    wellFormed: boolean;
    validDomain: boolean;
    validMailbox: any;
}
