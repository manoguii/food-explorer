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
exports.PrismaCartItemsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_cart_item_mapper_1 = require("../mappers/prisma-cart-item-mapper");
const prisma_service_1 = require("../prisma.service");
let PrismaCartItemsRepository = class PrismaCartItemsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(cartItem) {
        const data = prisma_cart_item_mapper_1.PrismaCartItemMapper.toPrisma(cartItem);
        await this.prisma.cartItem.update({
            where: {
                id: data.id,
            },
            data,
        });
    }
    async createMany(cartItems) {
        if (cartItems.length === 0) {
            return;
        }
        await this.prisma.cartItem.createMany({
            data: cartItems.map((cartItem) => prisma_cart_item_mapper_1.PrismaCartItemMapper.toPrisma(cartItem)),
        });
    }
    async deleteMany(cartItems) {
        if (cartItems.length === 0) {
            return;
        }
        await this.prisma.cartItem.deleteMany({
            where: {
                id: {
                    in: cartItems.map((cartItem) => cartItem.id.toString()),
                },
            },
        });
    }
    async findManyByCartId(cartId) {
        const cartItem = await this.prisma.cartItem.findMany({
            where: {
                cartId,
            },
        });
        return cartItem.map(prisma_cart_item_mapper_1.PrismaCartItemMapper.toDomain);
    }
    async deleteManyByCartId(cartId) {
        await this.prisma.cartItem.deleteMany({
            where: {
                cartId,
            },
        });
    }
};
exports.PrismaCartItemsRepository = PrismaCartItemsRepository;
exports.PrismaCartItemsRepository = PrismaCartItemsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaCartItemsRepository);
//# sourceMappingURL=prisma-cart-item-repository.js.map