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
exports.PrismaCategoryRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_category_mapper_1 = require("../mappers/prisma-category-mapper");
const prisma_service_1 = require("../prisma.service");
let PrismaCategoryRepository = class PrismaCategoryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const category = await this.prisma.category.findUnique({
            where: {
                id,
            },
        });
        if (!category) {
            return null;
        }
        return prisma_category_mapper_1.PrismaCategoryMapper.toDomain(category);
    }
    async findByName(name) {
        const category = await this.prisma.category.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive',
                },
            },
        });
        if (!category) {
            return null;
        }
        return prisma_category_mapper_1.PrismaCategoryMapper.toDomain(category);
    }
    async findMany({ page }) {
        const perPage = 10;
        const totalCategories = await this.prisma.category.count();
        const rawCategories = await this.prisma.category.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: perPage,
            skip: (page - 1) * perPage,
        });
        const categories = rawCategories.map(prisma_category_mapper_1.PrismaCategoryMapper.toDomain);
        const totalPages = Math.ceil(totalCategories / perPage);
        console.log('Chamou 🌊', rawCategories);
        return {
            categories,
            totalPages,
        };
    }
    async create(category) {
        const data = prisma_category_mapper_1.PrismaCategoryMapper.toPrisma(category);
        await this.prisma.category.create({
            data,
        });
    }
    async save(category) {
        const data = prisma_category_mapper_1.PrismaCategoryMapper.toPrisma(category);
        await this.prisma.category.update({
            where: {
                id: category.id.toString(),
            },
            data,
        });
    }
    async delete(category) {
        const data = prisma_category_mapper_1.PrismaCategoryMapper.toPrisma(category);
        await this.prisma.category.delete({
            where: {
                id: data.id,
            },
        });
    }
};
exports.PrismaCategoryRepository = PrismaCategoryRepository;
exports.PrismaCategoryRepository = PrismaCategoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaCategoryRepository);
//# sourceMappingURL=prisma-category-repository.js.map