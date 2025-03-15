import { Prisma, SpatialRefSys } from "@prisma/client";
import { prismaClient } from "../database/prismaClient";

export interface SysRefType {
    srid: number;
    srtext: string;
}

let sysRefsTrait: SysRefType[] = []

const OR = {
    OR: [
        {
            srid: { in: [4326, 4674] }
        },
        {
            srid: {
                gte: 32717,
                lte: 32725
            }
        },
        {
            srid: {
                gte: 32617,
                lte: 32625
            }
        },
        {
            srid: {
                gte: 31971,
                lte: 31985
            }
        },
    ],
}

class SysRefService {
    
    async create(data: SysRefType): Promise<SpatialRefSys> {
        
        const refSys = await prismaClient.spatialRefSys.findFirst({
            where: {
                srtext: data.srtext
            }
        })

        if (refSys) {
            throw new Error('Já existe um SysRef com este Nome')
        }

        const SysRef = await prismaClient.spatialRefSys.create({
            data: {
                srid: data.srid,
                srtext: data.srtext,
                    
            }
        })

        return SysRef
    }

    async update(srid: number, data: SysRefType): Promise<SpatialRefSys> {
        await prismaClient.spatialRefSys.update({
            where: {
                srid: srid
            },
            data
        })

        return this.findById(srid)
    }

    async delete(srid: number): Promise<void> {
        await prismaClient.spatialRefSys.delete({
            where: {
                srid
            }
        })
        .then(response => {
            console.log(response)
        })
    }

    async getAll(query?: any): Promise<any> {
        const { perPage, page, search, orderBy, order } = query
        const skip = (page - 1) * perPage
        let orderByTerm = {}
        const searchTermFilter = search
            ? {
                AND: [
                    {
                        ...OR
                    },
                    {
                        srtext: { 
                            mode: Prisma.QueryMode.insensitive,
                            contains: search 
                        }
                    },
                ],
            }
            : {
                ...OR
            };
        
        const orderByElement = orderBy ? orderBy.split('.') : {}
        
        if (orderByElement.length == 2) {
            orderByTerm = {
                [orderByElement[1]]: order
            }
        } else {
            orderByTerm = {
                [orderByElement]: order
            }
        }
        
        const sysRefs = await 
            prismaClient.spatialRefSys.findMany({
                where: {
                    // OR: [{nome: {mode: 'insensitive', contains: search}}, {uf: {mode: 'insensitive', contains: search}}]
                    ...searchTermFilter
                },
                take: perPage ? parseInt(perPage) : 50,
                skip: skip ? skip : 0,
                orderBy: {
                    ...orderByTerm
                },
                select: {
                    srid: true,
                    srtext: true
                }
            })

            const data = sysRefs.map((sysRef: any) => {
                const text = sysRef.srtext.split("\"")
                return {
                    srid: sysRef.srid, 
                    srtext: text[1]
                }
            })

        return {
            data,
            perPage,
            page,
            skip,
            count: sysRefs.length,
        }
    }

    async deleteSysRef(srids: number[]): Promise<void> {
          
        await prismaClient.spatialRefSys.deleteMany({
            where: {
                srid: { in: srids}
            }
        })
        
    }

    async search(text: any) {
        const sysRefs = await prismaClient.spatialRefSys.findMany({
            where: {
                AND: [
                    {
                        srtext: { mode: 'insensitive', contains: text }
                    },
                    {
                        ...OR
                    }
                ],
            },
            orderBy: {
                srtext:   'asc'
            },
            select: {
                srid: true,
                srtext: true
            }
        })

        sysRefs.map((sysRef: any) => {
            const text = sysRef.srtext.split("\"")
            sysRefsTrait.push({
                srid: sysRef.srid, 
                srtext: text[1]
            })
        })

        return sysRefsTrait
    }

    async findById(srid: number) : Promise<any> {
        const SysRef = await prismaClient.spatialRefSys.findUnique({ where: { srid } })

        return SysRef
    }

    async convertCoordenas2UTM(lat: number, lng: number, srid: string) {
        
    }
}

export default new SysRefService