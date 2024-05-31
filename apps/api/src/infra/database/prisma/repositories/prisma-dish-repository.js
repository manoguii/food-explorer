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
exports.PrismaDishRepository = void 0;
const common_1 = require("@nestjs/common");
const dish_attachments_repository_1 = require("../../../../domain/restaurant/application/repositories/dish-attachments-repository");
const dish_ingredients_repository_1 = require("../../../../domain/restaurant/application/repositories/dish-ingredients-repository");
const prisma_dish_mapper_1 = require("../mappers/prisma-dish-mapper");
const prisma_dish_with_details_mapper_1 = require("../mappers/prisma-dish-with-details-mapper");
const prisma_service_1 = require("../prisma.service");
let PrismaDishRepository = class PrismaDishRepository {
    prisma;
    dishAttachmentsRepository;
    dishIngredientsRepository;
    constructor(prisma, dishAttachmentsRepository, dishIngredientsRepository) {
        this.prisma = prisma;
        this.dishAttachmentsRepository = dishAttachmentsRepository;
        this.dishIngredientsRepository = dishIngredientsRepository;
    }
    async findById(id) {
        const dish = await this.prisma.dish.findUnique({
            where: {
                id,
            },
        });
        if (!dish) {
            return null;
        }
        return prisma_dish_mapper_1.PrismaDishMapper.toDomain(dish);
    }
    async findBySlug(slug) {
        const dish = await this.prisma.dish.findUnique({
            where: {
                slug,
            },
        });
        if (!dish) {
            return null;
        }
        return prisma_dish_mapper_1.PrismaDishMapper.toDomain(dish);
    }
    async findBySlugWithDetails(slug) {
        const dish = await this.prisma.dish.findUnique({
            where: {
                slug,
            },
            include: {
                category: true,
                ingredients: true,
                attachments: true,
            },
        });
        if (!dish) {
            return null;
        }
        return prisma_dish_with_details_mapper_1.PrismaDishWithDetailsMapper.toDomain(dish);
    }
    async findManyByCategory(category, params) {
        const perPage = 10;
        const totalDishes = await this.prisma.dish.count({
            where: {
                categoryId: category.id.toString(),
            },
        });
        const dishes = await this.prisma.dish.findMany({
            where: {
                categoryId: category.id.toString(),
            },
            include: {
                category: true,
                ingredients: true,
                attachments: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: perPage,
            skip: (params.page - 1) * perPage,
        });
        const totalPages = Math.ceil(totalDishes / perPage);
        return {
            dishes: dishes.map(prisma_dish_with_details_mapper_1.PrismaDishWithDetailsMapper.toDomain),
            totalPages,
        };
    }
    async findManyByQuery(query, params) {
        const perPage = 10;
        const totalDishes = await this.prisma.dish.count({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
        });
        const dishes = await this.prisma.dish.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            include: {
                category: true,
                ingredients: true,
                attachments: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: perPage,
            skip: (params.page - 1) * perPage,
        });
        const totalPages = Math.ceil(totalDishes / perPage);
        return {
            dishes: dishes.map(prisma_dish_with_details_mapper_1.PrismaDishWithDetailsMapper.toDomain),
            totalPages,
        };
    }
    async findManyByIds(ids) {
        const dishes = await this.prisma.dish.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
        return dishes.map(prisma_dish_mapper_1.PrismaDishMapper.toDomain);
    }
    async create(dish) {
        const data = prisma_dish_mapper_1.PrismaDishMapper.toPrisma(dish);
        await this.prisma.dish.create({
            data,
        });
        await Promise.all([
            this.dishAttachmentsRepository.createMany(dish.attachments.getItems()),
            this.dishIngredientsRepository.createMany(dish.ingredients.getItems()),
        ]);
    }
    async save(dish) {
        const data = prisma_dish_mapper_1.PrismaDishMapper.toPrisma(dish);
        await Promise.all([
            this.prisma.dish.update({
                where: {
                    id: dish.id.toString(),
                },
                data,
            }),
            this.dishAttachmentsRepository.createMany(dish.attachments.getNewItems()),
            this.dishAttachmentsRepository.deleteMany(dish.attachments.getRemovedItems()),
            this.dishIngredientsRepository.createMany(dish.ingredients.getNewItems()),
            this.dishIngredientsRepository.deleteMany(dish.ingredients.getRemovedItems()),
        ]);
    }
    async delete(dish) {
        const data = prisma_dish_mapper_1.PrismaDishMapper.toPrisma(dish);
        await Promise.all([
            await this.dishAttachmentsRepository.deleteManyByDishId(dish.id.toString()),
            await this.dishIngredientsRepository.deleteManyByDishId(dish.id.toString()),
            await this.prisma.dish.delete({
                where: {
                    id: data.id,
                },
            }),
        ]);
    }
};
exports.PrismaDishRepository = PrismaDishRepository;
exports.PrismaDishRepository = PrismaDishRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        dish_attachments_repository_1.DishAttachmentsRepository,
        dish_ingredients_repository_1.DishIngredientsRepository])
], PrismaDishRepository);
//# sourceMappingURL=prisma-dish-repository.js.map