import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `${process.env.AUTH0_ISSUER_URL}`,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
      }),
    });
  }

  async validate(payload: any) {
    const { sub, email, nickname } = payload;

    // 1. Find user by auth0Id
    let user = await this.userRepository.findOne({
      where: { auth0Id: sub },
    });

    // 2. If not found, search by email to merge accounts if needed
    if (!user && email) {
      user = await this.userRepository.findOne({
        where: { email },
      });

      if (user) {
        user.auth0Id = sub;
        await this.userRepository.save(user);
      }
    }

    // 3. If still not found, create a new local user record
    if (!user) {
      user = this.userRepository.create({
        auth0Id: sub,
        email: email || `${sub}@auth0.com`,
        username: nickname || email?.split('@')[0] || 'User',
        passwordHash: null,
      });
      user = await this.userRepository.save(user);
    }

    return user;
  }
}
