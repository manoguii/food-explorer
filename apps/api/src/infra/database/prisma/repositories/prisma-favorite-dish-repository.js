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
exports.PrismaFavoriteDishRepository = void 0;
const common_1 = require("@nestjs/common");
const dish_attachments_repository_1 = require("../../../../domain/restaurant/application/repositories/dish-attachments-repository");
const dish_ingredients_repository_1 = require("../../../../domain/restaurant/application/repositories/dish-ingredients-repository");
const prisma_dish_with_details_mapper_1 = require("../mappers/prisma-dish-with-details-mapper");
const prisma_favorite_dish_mapper_1 = require("../mappers/prisma-favorite-dish-mapper");
const prisma_service_1 = require("../prisma.service");
let PrismaFavoriteDishRepository = class PrismaFavoriteDishRepository {
    prisma;
    dishAttachmentsRepository;
    dishIngredientsRepository;
    constructor(prisma, dishAttachmentsRepository, dishIngredientsRepository) {
        this.prisma = prisma;
        this.dishAttachmentsRepository = dishAttachmentsRepository;
        this.dishIngredientsRepository = dishIngredientsRepository;
    }
    async findManyByClientId(clientId, params) {
        const perPage = 10;
        const totalFavoriteDishes = await this.prisma.favoriteDishes.count({
            where: {
                userId: clientId,
            },
        });
        const favoriteDishes = await this.prisma.favoriteDishes.findMany({
            where: {
                userId: clientId,
            },
            include: {
                dish: {
                    include: {
                        attachments: true,
                        category: true,
                        ingredients: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: perPage,
            skip: (params.page - 1) * perPage,
        });
        const dishes = favoriteDishes.map((favoriteDish) => favoriteDish.dish);
        const totalPages = Math.ceil(totalFavoriteDishes / perPage);
        return {
            favorites: dishes.map(prisma_dish_with_details_mapper_1.PrismaDishWithDetailsMapper.toDomain),
            totalPages,
        };
    }
    async findOneByDishIdAndClientId(dishId, clientId) {
        const favoriteDish = await this.prisma.favoriteDishes.findFirst({
            where: {
                dishId,
                userId: clientId,
            },
        });
        if (!favoriteDish) {
            return null;
        }
        return prisma_favorite_dish_mapper_1.PrismaFavoriteDishMapper.toDomain([favoriteDish])[0];
    }
    async findAllByClientId(clientId) {
        const favoriteDishes = await this.prisma.user.findUnique({
            where: {
                id: clientId,
            },
            select: {
                favoriteDishes: {
                    include: {
                        dish: {
                            include: {
                                attachments: true,
                            },
                        },
                    },
                },
            },
        });
        if (!favoriteDishes) {
            return [];
        }
        return prisma_favorite_dish_mapper_1.PrismaFavoriteDishMapper.toDomain(favoriteDishes.favoriteDishes);
    }
    async addFavoriteDish(favoriteDish) {
        const data = prisma_favorite_dish_mapper_1.PrismaFavoriteDishMapper.toPrisma(favoriteDish);
        await this.prisma.favoriteDishes.create({
            data,
        });
    }
    async removeFavoriteDish(favoriteDish) {
        const data = prisma_favorite_dish_mapper_1.PrismaFavoriteDishMapper.toPrisma(favoriteDish);
        await this.prisma.favoriteDishes.delete({
            where: {
                id: data.id,
            },
        });
    }
};
exports.PrismaFavoriteDishRepository = PrismaFavoriteDishRepository;
exports.PrismaFavoriteDishRepository = PrismaFavoriteDishRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        dish_attachments_repository_1.DishAttachmentsRepository,
        dish_ingredients_repository_1.DishIngredientsRepository])
], PrismaFavoriteDishRepository);
//# sourceMappingURL=prisma-favorite-dish-repository.js.map