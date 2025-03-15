import { User, Role, UserRole, Permission } from '@prisma/client';
import { prismaClient } from '../database/prismaClient';

type PermissionRequest = {
  name: string;
  description: string;
};

type RolePermissionRequest = {
  roleId: string;
  permissions: string[];
};

type RoleRequest = {
  name: string;
  description: string;
};

type UserACLRequest = {
  id: string;
  roles: string[];
  permissions: string[]
};

export class CreateUserACLService {
  async execute({ id, roles, permissions }: UserACLRequest): Promise<User | Error> {
    const user = await prismaClient.user.findUnique({
      where: {
        id
      }
    })

    if (!user) {
      return new Error("User does not exists!");
    } 

    if (roles) {
      await prismaClient.userRole.createMany({
        data: roles.map((role: any) => ({
          user_id: id,
          role_id: role.id
        }))
      });
    }

    if (permissions) {
      await prismaClient.userPermission.createMany({
        data: permissions.map((permission: any) => ({
          user_id: id,
          permission_id: permission.id
        }))
      });  
    }

    return user;
  }
}

export class CreateRoleService {
  async execute({ name, description }: RoleRequest): Promise<Role | Error> {

    const roleExists = await prismaClient.role.findFirst({
      where: { 
        name 
      }
    }) 
    
    if (roleExists) {
      return new Error("Role already exists");
    }

    const role = await prismaClient.role.create({
      data: { name, description }
    });

    return role;
  }
}

export class CreatePermissionService {
  async execute({ name, description }: PermissionRequest): Promise<Permission | Error> {

    const permissionExists = await prismaClient.permission.findFirst({ where: { name } })

    if (permissionExists) {
      return new Error("Permission already exists");
    }

    const permission = await prismaClient.permission.create({
      data: { name, description }
    });

    return permission;
  }
}

export class CreateRolePermissionService {
  async execute({ roleId, permissions }: RolePermissionRequest): Promise<Role | Error> {

    const role = await prismaClient.role.findUnique({ 
      where: { id: roleId } 
    });

    if (!role) {
      return new Error("Role does not exists!");
    }

    await prismaClient.permissionRole.createMany({
      data: permissions.map((permission: any) => ({
        role_id: roleId,
        permission_id: permission.id
      }))
    });

    return role;
  }
}

