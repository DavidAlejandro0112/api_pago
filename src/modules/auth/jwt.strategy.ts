import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { envs } from 'src/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.db.jwt_secret || 'pagos-secret-key',
    });
  }

  async validate(payload: { email: string; sub: string }) {
    const user = await this.userService.findByEmail(payload.email);
    if (!user) throw new UnauthorizedException();
    return { id: payload.sub, email: payload.email };
  }
}
