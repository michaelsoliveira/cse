import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../database/prismaClient";

export function can(permissionsRoutes: string[]) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.user;
    
    const user = await prismaClient.user.findFirst({
      where: {
        id
      },
      select: {
        id: true,
        users_permissions: {
          select: {
            permissions: {
              select: {
                name: true
              },
            },
          },
        },
      }
    });

    if (!user?.users_permissions) {
      return response.json("User does not have this permission");
    }

    const permissionExists = user?.users_permissions
      .map((permission) => permission.permissions)
      .some((permission) => permissionsRoutes.includes(permission.name));

    if (!permissionExists) {
      return response.json("User does not have this permission").status(400).end();
    }

    return next();
  };
}

export function is(rolesRoutes: string[]) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.user;

    const user = await prismaClient.user.findFirst({
      where: { 
        id
       },
      select: {
        id: true,
        users_roles: {
          select: {
            roles: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    });

    if (!user?.users_roles) {
      return response.status(400).json("User does not have this role");
    }
    

    const roleExists = user?.users_roles
      .map((role) => role.roles)
      .some((role) => rolesRoutes.includes(role.name.toLowerCase()));

    if (!roleExists) {
      
      return response.status(405).json("Você não tem permissão para executar essa ação");
    }

    return next();
  };
}