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
exports.PrismaDishIngredientsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_dish_ingredient_mapper_1 = require("../mappers/prisma-dish-ingredient-mapper");
const prisma_service_1 = require("../prisma.service");
let PrismaDishIngredientsRepository = class PrismaDishIngredientsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findManyByDishId(dishId) {
        const dishIngredient = await this.prisma.ingredient.findMany({
            where: {
                dishId,
            },
        });
        return dishIngredient.map(prisma_dish_ingredient_mapper_1.PrismaDishIngredientMapper.toDomain);
    }
    async deleteManyByDishId(dishId) {
        await this.prisma.ingredient.deleteMany({
            where: {
                dishId,
            },
        });
    }
    async createMany(ingredients) {
        if (ingredients.length === 0) {
            return;
        }
        const data = prisma_dish_ingredient_mapper_1.PrismaDishIngredientMapper.toPrismaCreateMany(ingredients);
        await this.prisma.ingredient.createMany(data);
    }
    async deleteMany(ingredients) {
        if (ingredients.length === 0) {
            return;
        }
        const ingredientIds = ingredients.map((ingredient) => ingredient.id.toString());
        await this.prisma.ingredient.deleteMany({
            where: {
                id: {
                    in: ingredientIds,
                },
            },
        });
    }
};
exports.PrismaDishIngredientsRepository = PrismaDishIngredientsRepository;
exports.PrismaDishIngredientsRepository = PrismaDishIngredientsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaDishIngredientsRepository);
//# sourceMappingURL=prisma-dish-ingredient-repository.js.map