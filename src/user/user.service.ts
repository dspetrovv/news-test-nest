import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { LoginUserDto } from './dto/loginUser.dto';
import { compare } from 'bcrypt';
import { AuthService } from '@app/auth/auth.service';

type UserResponseType = UserEntity & { access: string; refresh: string };

export type UserType = Omit<UserResponseType, 'hashPassword'>;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (userByEmail) {
      throw new HttpException(
        'Email are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    return await this.userRepository.save(newUser);
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: {
        email,
      },
    });
    if (!user) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return user;
  }

  async findUserById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  buildUserResponse(user: UserEntity): UserType {
    delete user.password;
    return {
      ...user,
      ...this.authService.generateTokens({
        id: user.id,
        email: user.email,
      }),
    };
  }
}
