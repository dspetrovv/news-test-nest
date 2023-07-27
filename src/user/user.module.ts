import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { AuthGuard } from '@app/middlewares/auth.guard';
import { AuthModule } from '@app/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  imports: [TypeOrmModule.forFeature([UserEntity]), AuthModule],
  exports: [UserService],
})
export class UserModule {}
