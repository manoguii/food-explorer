"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaFavoriteDishMapper = void 0;
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const favorite_dish_1 = require("../../../../domain/restaurant/enterprise/entities/favorite-dish");
class PrismaFavoriteDishMapper {
    static toDomain(raw) {
        return raw.map((favoriteDish) => {
            return favorite_dish_1.FavoriteDish.create({
                dishId: new unique_entity_id_1.UniqueEntityID(favoriteDish.dishId),
                clientId: new unique_entity_id_1.UniqueEntityID(favoriteDish.userId),
            }, new unique_entity_id_1.UniqueEntityID(favoriteDish.id));
        });
    }
    static toPrisma(favoriteDish) {
        return {
            id: favoriteDish.id.toString(),
            dishId: favoriteDish.dishId.toString(),
            userId: favoriteDish.clientId.toString(),
        };
    }
}
exports.PrismaFavoriteDishMapper = PrismaFavoriteDishMapper;
//# sourceMappingURL=prisma-favorite-dish-mapper.js.map