import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/components/users/role.entity';
import { Users } from 'src/components/users/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SettingsService {

    constructor(
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        @InjectRepository(Users) private usersRepository: Repository<Users>,
    ) {}

    async initDatabase(): Promise<{roles: Role[], admin: Users}> {
        try {
            const roles: Role[] = await this.initRoles();
            const admin: Users = await this.initAdmin();
            return {
                roles: roles,
                admin: admin
            }
        } catch (error) {
            throw new HttpException(
                `${error?.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async initRoles(): Promise<Role[]> {
        const roleNames = ['admin', 'user'];
        const roles: Role[] = [];

        for (const name of roleNames) {
            let role = await this.roleRepository.findOne({ where: { name } });
            if (!role) {
                let createdRole: Role = await this.roleRepository.save({
                    name: name
                });
                roles.push(createdRole);
            }
        }
        return roles;
    }

    async initAdmin(): Promise<Users> {
        let admin: Users | null = await this.usersRepository.findOne({ where: { email: 'admin@example.com' } });

        if (!admin) {
            const adminRole = await this.roleRepository.findOne({
                where: {
                    name: 'admin'
                }
            });
            if(!adminRole) {
                throw new HttpException('Forbidden: Invalid secret key', HttpStatus.FORBIDDEN);
            }
            const passwordHash = await bcrypt.hash('admin123', 10);

            admin = await this.usersRepository.save({
                email: 'admin@example.com',
                password: passwordHash,
                role: adminRole,
            });
        }

        return admin;
    }

}
