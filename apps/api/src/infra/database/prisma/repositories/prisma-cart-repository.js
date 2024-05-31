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
exports.PrismaCartRepository = void 0;
const common_1 = require("@nestjs/common");
const cart_item_repository_1 = require("../../../../domain/restaurant/application/repositories/cart-item-repository");
const prisma_cart_mapper_1 = require("../mappers/prisma-cart-mapper");
const prisma_cart_with_details_mapper_1 = require("../mappers/prisma-cart-with-details-mapper");
const prisma_service_1 = require("../prisma.service");
let PrismaCartRepository = class PrismaCartRepository {
    prisma;
    cartItemsRepository;
    constructor(prisma, cartItemsRepository) {
        this.prisma = prisma;
        this.cartItemsRepository = cartItemsRepository;
    }
    async findById(id) {
        const cart = await this.prisma.cart.findUnique({
            where: {
                id,
            },
        });
        if (!cart) {
            return null;
        }
        return prisma_cart_mapper_1.PrismaCartMapper.toDomain(cart);
    }
    async create(cart) {
        const data = prisma_cart_mapper_1.PrismaCartMapper.toPrisma(cart);
        await this.prisma.cart.create({
            data,
        });
        this.cartItemsRepository.createMany(cart.items.getItems());
    }
    async findEmptyCartByClientId(clientId) {
        const cart = await this.prisma.cart.findFirst({
            where: {
                userId: clientId,
                cartItems: {
                    none: {},
                },
            },
        });
        if (!cart) {
            return null;
        }
        return prisma_cart_mapper_1.PrismaCartMapper.toDomain(cart);
    }
    async findByIdWithDetails(id) {
        const cart = await this.prisma.cart.findUnique({
            where: {
                id,
            },
            include: {
                cartItems: {
                    include: {
                        dish: {
                            include: {
                                attachments: true,
                            },
                        },
                    },
                },
                user: true,
            },
        });
        if (!cart) {
            return null;
        }
        return prisma_cart_with_details_mapper_1.PrismaCartWithDetailsMapper.toDomain(cart);
    }
    async save(cart) {
        const data = prisma_cart_mapper_1.PrismaCartMapper.toPrisma(cart);
        await Promise.all([
            this.prisma.cart.update({
                where: {
                    id: cart.id.toString(),
                },
                data,
            }),
            this.cartItemsRepository.createMany(cart.items.getNewItems()),
            this.cartItemsRepository.deleteMany(cart.items.getRemovedItems()),
        ]);
    }
    async delete(cart) {
        await this.prisma.cart.delete({
            where: {
                id: cart.id.toString(),
            },
        });
    }
};
exports.PrismaCartRepository = PrismaCartRepository;
exports.PrismaCartRepository = PrismaCartRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cart_item_repository_1.CartItemsRepository])
], PrismaCartRepository);
//# sourceMappingURL=prisma-cart-repository.js.map