import { User } from "@prisma/client"
import { DataStoredInToken } from "../interfaces/DataStoredInToken"
import { prismaClient } from "../database/prismaClient"
const config = require("../config")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dayjs = require("dayjs")

export interface UserRequest {
    email: string,
    password: string
}

interface TokenData {
    access_token: string;
    expires_in: number;
}

class AuthService {
    public refreshTokens: string[] = []
    
    async execute({ email, password }: UserRequest) {
        
        const user = await prismaClient.user.findUnique({
            include: {
                users_roles: {
                    include: {
                        roles: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            where: {
                email: email
            }
        })

        if (!user) throw new Error("Usuário informado não existe na base de dados")

        const passwordMatch = await bcrypt.compareSync(password, user?.password)

        if (!passwordMatch) {
            throw new Error("A senha informada está incorreta")
        }

        const token = this.createToken(user)
        const refresh_token = this.createRefreshToken(user)

        await prismaClient.refreshToken.create({
            data: {
                expires_in: dayjs().add(config.server.jwtRefreshExpiration, "second").unix(),
                token: refresh_token,
                users: {
                    connect: {
                        id: user?.id
                    }
                }
            },
            
        })

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                image: user.image,
                roles: user.users_roles?.map((role: any) => {return {roles: role.roles}}),
                access_token: token,
                expires_in: config.server.jwtExpiration,
                refresh_token
            },
        }
    }

    private createToken(user: User): TokenData {
        const expiresIn = config.server.jwtExpiration
        const secret = config.server.JWT_SECRET
        const DataStoredInToken: DataStoredInToken = {
            id: user.id,
            email: user.email,
            username: user.username
        }
        return jwt.sign(DataStoredInToken, secret, { expiresIn })
    }

    async getUserByJWT(token: string) {
        const secret = config.server.JWT_SECRET
        return jwt.verify(token, secret)
    }

    createRefreshToken(user: User) {
        const expiresIn = config.server.jwtRefreshExpiration
        
        const secret = config.server.JWT_REFRESH
        const DataStoredInToken: DataStoredInToken = {
            id: user.id,
            email: user.email,
            username: user.username
        }
        return jwt.sign(DataStoredInToken, secret, { expiresIn })
    }

    async deleteRefreshTokenByToken(token: string) {
        await prismaClient.refreshToken.deleteMany({
            where: {
                token
            }
        })
    }

    async handleRefreshToken(userId: string) {
        const user = await prismaClient.user.findUnique({ where: { id: userId } }) as any
        const refreshTokenExists = await prismaClient.refreshToken.findFirst({
            include: {
                users: true
            },
            where: {
                id_user: userId
            }
        })
        
        // const secret = config.server.JWT_REFRESH
        const expiresIn = config.server.jwtRefreshExpiration
        const expiresInToken = config.server.jwtExpiration

        if (!refreshTokenExists) {
            throw new Error('Refresh token is not valid')
        }
        
        try {    
            // const user = jwt.verify(refreshToken, secret) as User   
            
            if (!refreshTokenExists?.users) {
                throw new Error("User is not Authenticated")    
            }

            const newAccessToken = this.createToken(user)
            const tokenExpired = this.verifyExpiration(refreshTokenExists)
            
            if (tokenExpired) {
                console.log('Refresh Token Expirou')

                const newRefreshToken = this.createRefreshToken(user)
                
                await prismaClient.refreshToken.create({
                    data: {
                        users: {
                            connect: {
                                id: user?.id
                            }
                        },
                        expires_in: dayjs().add(expiresIn, "second").unix(),
                        token: newRefreshToken
                    }
                }).then(async (res) => {
                    await prismaClient.refreshToken.deleteMany({
                        where: {
                            AND: {
                                id: {
                                    not: res?.id
                                },
                                id_user: userId
                            }
                        }
                    })
                })
                console.log('Novo Refresh Token ', newRefreshToken)
                
                return {
                    expires_in: expiresInToken,
                    access_token: newAccessToken,
                    refresh_token: newRefreshToken,
                    refresh_token_expired: true
                }
            }

            return {
                expires_in: expiresInToken,
                access_token: newAccessToken,
                refresh_token_expired: false
            }
            
        } catch (error: any) {
            throw new Error('Error: ' + error.message)
        }
    }


    verifyExpiration(token: any) {
        const expiredToken = dayjs().isAfter(dayjs.unix(token.expires_in))
        return expiredToken
    }

    createCookie(tokenData: any) {
        return `Authorization=Bearer ${tokenData.access_token}; HttpOnly; Max-Age=${tokenData.expires_in}`;
    }

    getExpiredIn() {
        let expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() + config.server.jwtRefreshExpiration)
        return expiredAt.getTime()
    }
}

export default new AuthService()