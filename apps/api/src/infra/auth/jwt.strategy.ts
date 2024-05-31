import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

import { PrismaService } from '../database/prisma/prisma.service'
import { EnvService } from '../env/env.service'
import { Role } from './roles-enum'

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  roles: z.array(z.enum(['ADMIN', 'CLIENT'])),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: EnvService,
    private prismaService: PrismaService,
  ) {
    const publicKey = config.get('JWT_PUBLIC_KEY')

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: UserPayload) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: payload.sub,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Credentials incorrect')
    }

    const userIsAdmin = user.role.includes(Role.ADMIN)
    const userISManager = user.role.includes(Role.MANAGER)

    let userRole = Role.CLIENT
    if (userIsAdmin) userRole = Role.ADMIN
    if (userISManager) userRole = Role.MANAGER

    const userPayload = {
      sub: user.id,
      roles: [userRole],
    }

    return tokenPayloadSchema.parse(userPayload)
  }
}
