import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../users/users.entity';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async validateUser(username: string, pass: string): Promise<Users|null> {
        return await this.usersService.validateUser(username, pass);
    }

    async login(user: Users) {
        const payload = { email: user.email, id: user.id, roles: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
