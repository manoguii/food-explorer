"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClientMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const client_1 = require("../../../../domain/restaurant/enterprise/entities/client");
class PrismaClientMapper {
    static toDomain(raw) {
        return client_1.Client.create({
            name: raw.name,
            email: raw.email,
            password: raw.password,
            image: raw.image,
            role: raw.role,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(client) {
        return {
            id: client.id.toString(),
            name: client.name,
            email: client.email,
            password: client.password,
            image: client.image,
            role: client.role || 'CLIENT',
        };
    }
}
exports.PrismaClientMapper = PrismaClientMapper;
//# sourceMappingURL=prisma-client-mapper.js.map