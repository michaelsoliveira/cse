declare namespace Express {
    export interface Request {
        user: {
            id: string,
            email: string,
            username: string,
            provider: string,
            roles: Object
        }
    }

}