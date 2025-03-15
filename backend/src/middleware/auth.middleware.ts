import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { User } from "@prisma/client"
import userService from "../services/UserService"
import axios from 'axios'
import { getDecodedOAuthJwtGoogle } from "../services/DecodeJwtGoogle"
const config = require("../config")

export const Authentication = () => {

    return async (request: Request, response: Response, next: NextFunction) => {
        
        const { authorization } = request.headers;
        
        if (!authorization) {
            return response.status(401).json({ error: "Token is missing!" })
        }
        
        const token = authorization.replace('Bearer', '').trim()
        const provider = token.substring(0, 3)
        
        try {
            switch (provider) {
                case 'ya2': {
                    
                    const provider = await getDecodedOAuthJwtGoogle(token)

                    const user = await userService.findProvider(provider)                            

                    request.user = {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        provider: 'google',
                        roles: user.user_roles?.map((userRoles: any) => userRoles.roles)
                    }
                }
                break;
                case 'ghu': {

                    const url = 'https://api.github.com/user'

                    await axios.get(url,
                        {
                            headers: { authorization: `token ${token}` }
                        }).then(async(response: any) => {

                            const provider = response.data
                            
                            const user = await userService.findProvider(provider)

                            request.user = {
                                id: user?.id,
                                email: user?.email,
                                username: user?.username,
                                provider: 'github',
                                roles: user.users_roles?.map((userRoles: any) => userRoles.roles)
                            }
                        })
                }
                break;
                    case 'EAA': {
                        
                    await axios.get(`https://graph.facebook.com/me?access_token=${token}&fields=id`)
                        .then(async (response: any) => {
                        const provider = response.data
                        
                        const user = await userService.findProvider(provider)
                        
                        request.user = {
                            id: user.id,
                            email: user.email,
                            username: user.username,
                            provider: user.provider,
                            roles: user.user_roles?.map((userRoles: any) => userRoles.roles)
                        }
                    })
                }
                break;
                default: {
                    const verificationResponse = jwt.verify(token, config.server.JWT_SECRET) as User
                    const user = await userService.findOne(verificationResponse.id)
                    request.user = {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        provider: 'local',
                        roles: user?.users_roles?.map((userRoles: any) => userRoles.roles)
                    }    
                }
            }

            return next()
        } catch (error: any) {
            return response.json({ 
                error: true, 
                message: error.message
            })
        }
    }
}