"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const zod_1 = require("zod");
const prisma_service_1 = require("../database/prisma/prisma.service");
const env_service_1 = require("../env/env.service");
const roles_enum_1 = require("./roles-enum");
const tokenPayloadSchema = zod_1.z.object({
    sub: zod_1.z.string().uuid(),
    roles: zod_1.z.array(zod_1.z.enum(['ADMIN', 'CLIENT'])),
});
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    prismaService;
    constructor(config, prismaService) {
        const publicKey = config.get('JWT_PUBLIC_KEY');
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(publicKey, 'base64'),
            algorithms: ['RS256'],
        });
        this.prismaService = prismaService;
    }
    async validate(payload) {
        const user = await this.prismaService.user.findFirst({
            where: {
                id: payload.sub,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Credentials incorrect');
        }
        const userIsAdmin = user.role.includes(roles_enum_1.Role.ADMIN);
        const userISManager = user.role.includes(roles_enum_1.Role.MANAGER);
        let userRole = roles_enum_1.Role.CLIENT;
        if (userIsAdmin)
            userRole = roles_enum_1.Role.ADMIN;
        if (userISManager)
            userRole = roles_enum_1.Role.MANAGER;
        const userPayload = {
            sub: user.id,
            roles: [userRole],
        };
        return tokenPayloadSchema.parse(userPayload);
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [env_service_1.EnvService,
        prisma_service_1.PrismaService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map