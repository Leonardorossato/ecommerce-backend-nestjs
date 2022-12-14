import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeModule } from 'nestjs-stripe';
import { AuthModule } from './auth/auth.module';
import { typeOrmAsyncConfig } from './config/ormconfig';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    StripeModule.forRoot({
      apiKey: process.env.STRIPE_PUBLIC_KEY,
      apiVersion: '2022-11-15',
    }),
  ],
})
export class AppModule {}
