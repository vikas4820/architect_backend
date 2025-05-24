import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(Users) private usersRepository: Repository<Users>
    ){}

    async validateUser(email: string, pass: string): Promise<Users | null> {
        const user = await this.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            return user;
        }
        return null;
    }

    async findByEmail(email: string): Promise<Users|null> {
        try {
            return await this.usersRepository.findOne({
                where: {
                    email: email
                }
            });
        } catch (error) {
            throw new HttpException(
                `${error?.message}`,
                HttpStatus.NOT_FOUND
            )
        }
    }
}
