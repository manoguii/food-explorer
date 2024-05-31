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
exports.ChooseDishAsFavoriteUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const favorite_dish_1 = require("../../enterprise/entities/favorite-dish");
const favorite_dish_repository_1 = require("../repositories/favorite-dish-repository");
const conflict_exception_error_1 = require("./errors/conflict-exception-error");
let ChooseDishAsFavoriteUseCase = class ChooseDishAsFavoriteUseCase {
    favoriteDishRepository;
    constructor(favoriteDishRepository) {
        this.favoriteDishRepository = favoriteDishRepository;
    }
    async execute({ dishId, clientId, page, }) {
        const { favorites, totalPages } = await this.favoriteDishRepository.findManyByClientId(clientId, { page });
        const isAlreadyFavorite = favorites.some((favorite) => favorite.dishId.toString() === dishId);
        if (isAlreadyFavorite) {
            return (0, either_1.left)(new conflict_exception_error_1.ConflictExceptionError(dishId));
        }
        const favoriteDish = favorite_dish_1.FavoriteDish.create({
            dishId: new unique_entity_id_1.UniqueEntityID(dishId),
            clientId: new unique_entity_id_1.UniqueEntityID(clientId),
        });
        await this.favoriteDishRepository.addFavoriteDish(favoriteDish);
        return (0, either_1.right)({
            favoriteDish,
            totalPages,
        });
    }
};
exports.ChooseDishAsFavoriteUseCase = ChooseDishAsFavoriteUseCase;
exports.ChooseDishAsFavoriteUseCase = ChooseDishAsFavoriteUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [favorite_dish_repository_1.FavoriteDishRepository])
], ChooseDishAsFavoriteUseCase);
//# sourceMappingURL=choose-dish-as-favorite.js.map