import { Request, Response } from "express";
import authService from "../services/AuthService"
import { getDecodedOAuthJwtGoogle } from "../services/DecodeJwtGoogle";
export interface BaseUser {
    email: string,
    password: string
}

let refreshTokens: string[] = []

export class AuthController {
    
    async login(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;
        
        try {
            const user = await authService.execute({ email, password })
            
            response.setHeader('Set-Cookie', [authService.createCookie(user)]);
            
            return response.json({
                error: false,
                message: null,
                ...user
            })

        } catch (error: any) {
            return response.status(403).json({
                error: true,
                message: error.message,
                user: null
            })
        }
    }

    async signInCallback(request: Request, response: Response) {
        return response.json(request)
    }

    async googleAuth(request: Request, response: Response) {
        const { authorization } = request.headers
        const token = authorization?.replace('Bearer', '').trim()

        const userInfo = await getDecodedOAuthJwtGoogle(token)
        
        return response.json(userInfo)
    }

    async getUserByToken(request: Request, response: Response): Promise<Response> {
        const user = request.user

        return response.status(200).json(request?.user)
    }

    async refreshToken(request: Request, response: Response): Promise<Response> {
        const { userId } = request.query as any
        
        if (!userId) return response.status(401).json('You are not Authenticated')
        try {
            const newToken = await authService.handleRefreshToken(userId)
            
            return response.json(newToken)
        } catch (error: any) {
            return response.status(401).json(error.message)
        }
    }
}