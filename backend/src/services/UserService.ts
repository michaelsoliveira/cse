import * as bcrypt from "bcryptjs"
import * as nodemailer from 'nodemailer'
import { prismaClient } from "../database/prismaClient"
import { Prisma, Role, User, User as UserPrisma } from "@prisma/client"
export interface UserRequest {
    username: string,
    email: string,
    password: string
}

import server from "../config"
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    server.clientId,
    server.clientSecret,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: server.refreshToken
});

// const client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "https://developers.google.com/oauthplayground")
// client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })
// var smtpTransport = require('nodemailer-smtp-transport');

class UserService {

    async create(data: any): Promise<UserPrisma> {
        const userExists = await prismaClient.user.findFirst({
            where: {
                email: data?.email
            }
        })

        if (userExists) {
            throw new Error("Já existe um usuário com este email cadastrado")
        }

        const passwordHash = await bcrypt.hash(data?.password, 10)

        const roleAdmin = await prismaClient.role.findFirst({
            where: {
                name: { equals: 'Admin' }
            }
        })

        const dataRequest = {
            username: data?.username,
            email: data?.email,
            password: passwordHash,
            image: data?.image,
            provider: data?.provider ? data?.provider : 'local',
            id_provider: data?.id_provider ? data?.id_provider : ''
        }

        // const userRoles = data.roles?.map((role: any) => {
        //     return {
        //         role_id: role.value
        //     }
        // })

        const rolesData = roleAdmin ? {
            users_roles: {
                createMany: {
                    data: {
                        role_id: roleAdmin?.id
                    }
                }
            }
        } : {}

        const user = await prismaClient.user.create({
            data: {
                ...dataRequest,
                ...rolesData
            }
        })

        return user
    }

    async update(id: string, data: any): Promise<UserPrisma> {
        const userExists = await prismaClient.user.findFirst({
            where: {
                id
            }
        })

        if (!userExists) {
            throw new Error("Usuário não localizado")
        }

        const basicData = {
            username: data?.username,
            email: data?.email,
            image: data?.image ? data?.image : userExists?.image,
            provider: data?.provider && data?.provider,
            id_provider: data?.id_provider && data?.id_provider
        }

        const roles = data?.roles && data?.roles.map((role: any) => {
            return {
                role_id: role.id ? role.id : role.value
            }
        })

        const user = await prismaClient.user.update({
            where:
            {
                id
            },
            data: basicData
        })

        const [deleted, userRole] = await prismaClient.$transaction([
            prismaClient.userRole.deleteMany({
                where: { user_id: id }
            }),
            prismaClient.userRole.createMany({
                data: roles.map((role: any) => {
                    return {
                        user_id: data?.id_user,
                        role_id: role?.role_id
                    }
                })
            })
        ])

        return userExists

    }

    async delete(id: string) {
        await prismaClient.user.delete({
            where: {
                id
            },
        })
    }

    async updatePassword(id: string, oldPassword: string, newPassword: string) {
        const userData = await this.findWithPassword(id)

        if (!userData) {
            throw new Error("Usuário não localizado")
        }
        const validPassword = await bcrypt.compare(oldPassword, userData.password)

        if (!validPassword) {
            throw new Error("Senha informada não corresponde com a cadastrada")
        }

        const passwordHash = await bcrypt.hash(newPassword, 10)

        await prismaClient.user.update({
            where: {
                id
            },
            data: {
                password: passwordHash
            }
        })

        return this.findOne(id)
    }

    async getAll(): Promise<any[]> {
        const users = await prismaClient.user.findMany()

        return users
    }

    async findByEmail(email: string): Promise<User | null> {
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
                email
            }
        })

        return user
    }

    async findById(id: string): Promise<any> {
        const user = await prismaClient.user.findUnique({
            include: {
                users_roles: {
                    include: {
                        roles: true
                    }
                }
            },
            where: {
                id
            }
        })
        return user
    }

    async findOne(id: string, projetoId?: string | undefined): Promise<any> {
        const user = await prismaClient.user.findFirst({
            where: { id },
            include: {
                users_roles: {
                    include: {
                        roles: true
                    }
                },
            },
        })

        const data = {
            id: user?.id,
            email: user?.email,
            username: user?.username,
            users_roles: user?.users_roles.map((role => {
                return role.roles
            }))
        }

        if (!user) throw new Error("User not Found 0")

        return data
    }

    async findProvider(provider?: any): Promise<any> {
        const { email, id } = provider
        const user = await prismaClient.user.findFirst({
            where: {
                OR: [
                    { email },
                    { id_provider: String(id) }
                ]
            },
            select: {
                id: true,
                username: true,
                email: true,
                provider: true,
                id_provider: true,
                users_roles: {
                    select: {
                        roles: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })

        return user
    }

    async sendMail(data: any): Promise<any> {
        const accessToken: any = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err: any, token: any) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            });
        });
        const { email, name, message } = data

        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            // secure: process.env.SMTP_SECURE === 'yes',
            secure: false,
            tls: {
            // do not fail on invalid certs
                rejectUnauthorized: false,
            },
            // service: 'gmail',
            // host: 'smtp.gmail.com',                
            // port: 587,
            // auth: {
                // type: 'OAuth2',
                // user: process.env.GMAIL_USER,
                // accessToken,
                // pass: process.env.GMAIL_PWD,
                // clientId: server.clientId,
                // clientSecret: server.clientSecret,
                // refreshToken: server.refreshToken
            // },
        });

        transporter.verify(function (error: any, success: any) {
            if (error) {
                console.log(error);
            } else {
                console.log('Server is ready to take our messages');
            }
        });

        const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`
        const escapedName = `${name.replace(/\./g, "&#8203;.")}`

        // Some simple styling options
        const backgroundColor = "#f9f9f9"
        const textColor = "#444444"
        const mainBackgroundColor = "#ffffff"
        const buttonBackgroundColor = "#346df1"
        const buttonBorderColor = "#346df1"
        const buttonTextColor = "#444444"
        const url = 'https://bomanejo-app.a.cnpgc.embrapa.br/login'

        const linkLogin = `
                <a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">
                    Acessar Agora
                </a>
            `
        return await new Promise((resolve, reject) => {
            // send mail with defined transport object
            transporter.sendMail({
                from: '"BOManejo Web" <cpafap.bomanejo@embrapa.br>', // sender address
                to: email, // list of receivers
                subject: "Acesso ao Software BOManejo Web", // Subject line
                text: `Usuário ${name} foi cadastrado com Sucesso!`, // plain text body
                html: `
                        <body style="background: ${backgroundColor};">
                            <table style="padding: 10px 0px 0px 10px;" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                                    <strong>Seja bem vindo ${escapedName} ao BOManejo Web</strong>
                                </td>
                                </tr>
                            </table>
                            <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
                                <tr>
                                <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                                    Você pode realizar o login utilizando seu email: <strong>${escapedEmail}</strong>
                                </td>
                                </tr>
                                <tr>
                                <td align="center" style="padding: 20px 0;">
                                    <table border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center" style="border-radius: 5px; padding: 10px 20px; font-size: 18px; color: #ffffff;" bgcolor="${buttonBackgroundColor}">
                                            ${message}
                                        </td>
                                    </tr>
                                    </table>
                                </td>
                                </tr>
                                <tr>
                                    <td align="center">${linkLogin}</td>
                                </tr>
                                <tr>
                                <td align="center" style="padding: 0px 0px 10px 0px; font-size: 14px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                                    Você não precisa retornar este email
                                </td>
                                </tr>
                            </table>
                        </body>`, // html body
            }, (error: any, data: any) => {
                if (error) {
                    console.log('Error: ', error)
                    reject(error)
                } else {
                    console.log("Message sent: %s", data.response);
                    resolve(data)
                }
            });
        })

    }

    async search(text: any) {
        const users = await prismaClient.user.findMany({
            where: {

                OR: [{ username: { mode: Prisma.QueryMode.insensitive, contains: text } }, { email: { mode: Prisma.QueryMode.insensitive, contains: text } }],
            },
            orderBy: {
                username: 'asc'
            },
        })

        return users
    }

    async findWithPassword(id: string) {
        const user = await prismaClient.user.findFirst({
            where: {
                id
            },
            select: {
                id: true,
                password: true
            }
        })

        return user
    }
}

export default new UserService()