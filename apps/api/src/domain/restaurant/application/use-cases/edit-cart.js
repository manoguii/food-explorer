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
exports.EditCartUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const cart_item_repository_1 = require("../repositories/cart-item-repository");
const cart_repository_1 = require("../repositories/cart-repository");
const dish_repository_1 = require("../repositories/dish-repository");
let EditCartUseCase = class EditCartUseCase {
    cartRepository;
    cartItemsRepository;
    dishRepository;
    constructor(cartRepository, cartItemsRepository, dishRepository) {
        this.cartRepository = cartRepository;
        this.cartItemsRepository = cartItemsRepository;
        this.dishRepository = dishRepository;
    }
    async execute({ cartId, dish, }) {
        const cart = await this.cartRepository.findById(cartId);
        if (!cart) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        const dishOnDb = await this.dishRepository.findById(dish.dishId);
        if (!dishOnDb) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        const currentCartItems = await this.cartItemsRepository.findManyByCartId(cart.id.toString());
        const cartItem = currentCartItems.find((cartItem) => cartItem.dishId.toString() === dish.dishId);
        if (!cartItem) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        cartItem.quantity = dish.quantity;
        cartItem.cost = dish.quantity * dishOnDb.price;
        await this.cartItemsRepository.save(cartItem);
        cart.totalAmount = currentCartItems.reduce((acc, cartItem) => acc + cartItem.cost, 0);
        await this.cartRepository.save(cart);
        return (0, either_1.right)({
            cart,
        });
    }
};
exports.EditCartUseCase = EditCartUseCase;
exports.EditCartUseCase = EditCartUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cart_repository_1.CartRepository,
        cart_item_repository_1.CartItemsRepository,
        dish_repository_1.DishRepository])
], EditCartUseCase);
//# sourceMappingURL=edit-cart.js.map