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
exports.PrismaOrdersRepository = void 0;
const common_1 = require("@nestjs/common");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const order_with_details_1 = require("../../../../domain/restaurant/enterprise/entities/value-objects/order-with-details");
const prisma_order_mapper_1 = require("../mappers/prisma-order-mapper");
const prisma_service_1 = require("../prisma.service");
let PrismaOrdersRepository = class PrismaOrdersRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview() {
        const orders = await this.prisma.order.findMany({
            select: {
                createdAt: true,
                amountTotal: true,
            },
        });
        const data = months.map((month) => ({ name: month, total: 0 }));
        orders.forEach((order) => {
            const monthIndex = new Date(order.createdAt).getMonth();
            data[monthIndex].total += order.amountTotal;
        });
        return data;
    }
    async getTotalRevenue(startDate, endDate) {
        const totalRevenue = await this.prisma.order.aggregate({
            _sum: {
                amountTotal: true,
            },
            where: {
                createdAt: {
                    gte: startDate,
                    lt: endDate,
                },
            },
        });
        const totalRevenueAmount = totalRevenue._sum.amountTotal || 0;
        return {
            value: totalRevenueAmount,
        };
    }
    async getSales(startDate, endDate) {
        const sales = await this.prisma.order.count({
            where: {
                createdAt: {
                    gte: startDate,
                    lt: endDate,
                },
            },
        });
        return {
            value: sales,
        };
    }
    async getActiveClients(startDate, endDate) {
        const activeClients = await this.prisma.order.groupBy({
            by: ['userId'],
            where: {
                createdAt: {
                    gte: startDate,
                    lt: endDate,
                },
            },
        });
        return {
            value: activeClients.length,
        };
    }
    async getRecentSales(startDate, endDate) {
        const orders = await this.prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lt: endDate,
                },
            },
            include: {
                user: true,
            },
        });
        return orders.map((order) => ({
            total: order.amountTotal,
            client: {
                id: order.user.id,
                name: order.user.name,
                email: order.user.email,
                image: order.user.image,
            },
        }));
    }
    async findById(id) {
        const order = await this.prisma.order.findUnique({
            where: {
                id,
            },
        });
        if (!order) {
            return null;
        }
        return prisma_order_mapper_1.PrismaOrderMapper.toDomain(order);
    }
    async findManyByClientIdWithDetails(clientId, params) {
        const perPage = 10;
        const { page } = params;
        const orders = await this.prisma.order.findMany({
            where: {
                userId: clientId,
            },
            include: {
                cart: {
                    include: {
                        cartItems: {
                            include: {
                                dish: {
                                    include: {
                                        attachments: true,
                                        ingredients: true,
                                    },
                                },
                            },
                        },
                    },
                },
                user: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
        const totalOrders = await this.prisma.order.count({
            where: {
                userId: clientId,
            },
        });
        const totalPages = Math.ceil(totalOrders / perPage);
        return {
            orders: orders.map((order) => order_with_details_1.OrderWithDetails.create({
                orderId: new unique_entity_id_1.UniqueEntityID(order.id),
                clientId: new unique_entity_id_1.UniqueEntityID(order.user.id),
                code: order.code,
                status: order.status,
                amountTotal: order.amountTotal,
                currency: order.currency,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                priority: order.priority,
                label: order.label,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                cart: {
                    createdAt: order.cart.createdAt,
                    updatedAt: order.cart.updatedAt,
                    totalAmount: order.cart.totalAmount,
                    cartItems: order.cart.cartItems.map((cartItem) => ({
                        id: cartItem.dish.id,
                        name: cartItem.dish.name,
                        description: cartItem.dish.description,
                        price: cartItem.dish.price,
                        slug: cartItem.dish.slug,
                        quantity: cartItem.quantity,
                        ingredients: cartItem.dish.ingredients.map((ingredient) => ingredient.name),
                        attachments: cartItem.dish.attachments.map((attachment) => ({
                            id: attachment.id,
                            title: attachment.title,
                            url: attachment.url,
                        })),
                    })),
                },
            })),
            totalPages,
        };
    }
    async findByIdWithDetails(id) {
        const order = await this.prisma.order.findUnique({
            where: {
                id,
            },
            include: {
                cart: {
                    include: {
                        cartItems: {
                            include: {
                                dish: {
                                    include: {
                                        attachments: true,
                                        ingredients: true,
                                    },
                                },
                            },
                        },
                    },
                },
                user: true,
            },
        });
        if (!order) {
            return null;
        }
        return order_with_details_1.OrderWithDetails.create({
            orderId: new unique_entity_id_1.UniqueEntityID(order.id),
            clientId: new unique_entity_id_1.UniqueEntityID(order.user.id),
            code: order.code,
            status: order.status,
            amountTotal: order.amountTotal,
            currency: order.currency,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            priority: order.priority,
            label: order.label,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            cart: {
                createdAt: order.cart.createdAt,
                updatedAt: order.cart.updatedAt,
                totalAmount: order.cart.totalAmount,
                cartItems: order.cart.cartItems.map((cartItem) => ({
                    id: cartItem.dish.id,
                    name: cartItem.dish.name,
                    description: cartItem.dish.description,
                    price: cartItem.dish.price,
                    slug: cartItem.dish.slug,
                    quantity: cartItem.quantity,
                    ingredients: cartItem.dish.ingredients.map((ingredient) => ingredient.name),
                    attachments: cartItem.dish.attachments.map((attachment) => ({
                        id: attachment.id,
                        title: attachment.title,
                        url: attachment.url,
                    })),
                })),
            },
        });
    }
    async findAllWithDetails(params) {
        const perPage = 10;
        const { page } = params;
        const orders = await this.prisma.order.findMany({
            include: {
                cart: {
                    include: {
                        cartItems: {
                            include: {
                                dish: {
                                    include: {
                                        attachments: true,
                                        ingredients: true,
                                    },
                                },
                            },
                        },
                    },
                },
                user: true,
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });
        const totalOrders = await this.prisma.order.count();
        const totalPages = Math.ceil(totalOrders / perPage);
        return {
            orders: orders.map((order) => order_with_details_1.OrderWithDetails.create({
                orderId: new unique_entity_id_1.UniqueEntityID(order.id),
                clientId: new unique_entity_id_1.UniqueEntityID(order.user.id),
                code: order.code,
                status: order.status,
                amountTotal: order.amountTotal,
                currency: order.currency,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                priority: order.priority,
                label: order.label,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                cart: {
                    createdAt: order.cart.createdAt,
                    updatedAt: order.cart.updatedAt,
                    totalAmount: order.cart.totalAmount,
                    cartItems: order.cart.cartItems.map((cartItem) => ({
                        id: cartItem.dish.id,
                        name: cartItem.dish.name,
                        description: cartItem.dish.description,
                        price: cartItem.dish.price,
                        slug: cartItem.dish.slug,
                        quantity: cartItem.quantity,
                        ingredients: cartItem.dish.ingredients.map((ingredient) => ingredient.name),
                        attachments: cartItem.dish.attachments.map((attachment) => ({
                            id: attachment.id,
                            title: attachment.title,
                            url: attachment.url,
                        })),
                    })),
                },
            })),
            totalPages,
        };
    }
    async create(order) {
        const data = prisma_order_mapper_1.PrismaOrderMapper.toPrisma(order);
        await this.prisma.order.create({
            data,
        });
    }
    async save(order) {
        const data = prisma_order_mapper_1.PrismaOrderMapper.toPrisma(order);
        await Promise.all([
            this.prisma.order.update({
                where: {
                    id: order.id.toString(),
                },
                data,
            }),
        ]);
    }
};
exports.PrismaOrdersRepository = PrismaOrdersRepository;
exports.PrismaOrdersRepository = PrismaOrdersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaOrdersRepository);
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
//# sourceMappingURL=prisma-order-repository.js.map