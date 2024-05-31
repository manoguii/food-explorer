"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const webhook_event_1 = require("../../domain/restaurant/application/payment/webhook-event");
const attachments_repository_1 = require("../../domain/restaurant/application/repositories/attachments-repository");
const cart_item_repository_1 = require("../../domain/restaurant/application/repositories/cart-item-repository");
const cart_repository_1 = require("../../domain/restaurant/application/repositories/cart-repository");
const category_repository_1 = require("../../domain/restaurant/application/repositories/category-repository");
const clients_repository_1 = require("../../domain/restaurant/application/repositories/clients-repository");
const dish_attachments_repository_1 = require("../../domain/restaurant/application/repositories/dish-attachments-repository");
const dish_ingredients_repository_1 = require("../../domain/restaurant/application/repositories/dish-ingredients-repository");
const dish_repository_1 = require("../../domain/restaurant/application/repositories/dish-repository");
const favorite_dish_repository_1 = require("../../domain/restaurant/application/repositories/favorite-dish-repository");
const orders_repository_1 = require("../../domain/restaurant/application/repositories/orders-repository");
const uploader_1 = require("../../domain/restaurant/application/storage/uploader");
const env_module_1 = require("../env/env.module");
const r2_storage_1 = require("../storage/r2-storage");
const prisma_service_1 = require("./prisma/prisma.service");
const prisma_attachments_repository_1 = require("./prisma/repositories/prisma-attachments-repository");
const prisma_cart_item_repository_1 = require("./prisma/repositories/prisma-cart-item-repository");
const prisma_cart_repository_1 = require("./prisma/repositories/prisma-cart-repository");
const prisma_category_repository_1 = require("./prisma/repositories/prisma-category-repository");
const prisma_client_repository_1 = require("./prisma/repositories/prisma-client-repository");
const prisma_dish_attachments_repository_1 = require("./prisma/repositories/prisma-dish-attachments-repository");
const prisma_dish_ingredient_repository_1 = require("./prisma/repositories/prisma-dish-ingredient-repository");
const prisma_dish_repository_1 = require("./prisma/repositories/prisma-dish-repository");
const prisma_favorite_dish_repository_1 = require("./prisma/repositories/prisma-favorite-dish-repository");
const prisma_order_repository_1 = require("./prisma/repositories/prisma-order-repository");
const prisma_webhook_event_repository_1 = require("./prisma/repositories/prisma-webhook-event-repository");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [env_module_1.EnvModule],
        providers: [
            prisma_service_1.PrismaService,
            {
                provide: dish_repository_1.DishRepository,
                useClass: prisma_dish_repository_1.PrismaDishRepository,
            },
            {
                provide: clients_repository_1.ClientsRepository,
                useClass: prisma_client_repository_1.PrismaClientsRepository,
            },
            {
                provide: category_repository_1.CategoryRepository,
                useClass: prisma_category_repository_1.PrismaCategoryRepository,
            },
            {
                provide: attachments_repository_1.AttachmentsRepository,
                useClass: prisma_attachments_repository_1.PrismaAttachmentsRepository,
            },
            {
                provide: dish_attachments_repository_1.DishAttachmentsRepository,
                useClass: prisma_dish_attachments_repository_1.PrismaDishAttachmentsRepository,
            },
            {
                provide: dish_ingredients_repository_1.DishIngredientsRepository,
                useClass: prisma_dish_ingredient_repository_1.PrismaDishIngredientsRepository,
            },
            {
                provide: favorite_dish_repository_1.FavoriteDishRepository,
                useClass: prisma_favorite_dish_repository_1.PrismaFavoriteDishRepository,
            },
            {
                provide: cart_repository_1.CartRepository,
                useClass: prisma_cart_repository_1.PrismaCartRepository,
            },
            {
                provide: cart_item_repository_1.CartItemsRepository,
                useClass: prisma_cart_item_repository_1.PrismaCartItemsRepository,
            },
            {
                provide: uploader_1.Uploader,
                useClass: r2_storage_1.R2Storage,
            },
            {
                provide: orders_repository_1.OrdersRepository,
                useClass: prisma_order_repository_1.PrismaOrdersRepository,
            },
            {
                provide: webhook_event_1.WebhookEventRepository,
                useClass: prisma_webhook_event_repository_1.PrismaWebhookEventRepository,
            },
        ],
        exports: [
            prisma_service_1.PrismaService,
            dish_repository_1.DishRepository,
            clients_repository_1.ClientsRepository,
            category_repository_1.CategoryRepository,
            attachments_repository_1.AttachmentsRepository,
            uploader_1.Uploader,
            dish_attachments_repository_1.DishAttachmentsRepository,
            dish_ingredients_repository_1.DishIngredientsRepository,
            favorite_dish_repository_1.FavoriteDishRepository,
            cart_repository_1.CartRepository,
            cart_item_repository_1.CartItemsRepository,
            orders_repository_1.OrdersRepository,
            webhook_event_1.WebhookEventRepository,
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map