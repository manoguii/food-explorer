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
exports.DeleteDishToCartUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const cart_item_list_1 = require("../../enterprise/entities/cart-item-list");
const cart_item_repository_1 = require("../repositories/cart-item-repository");
const cart_repository_1 = require("../repositories/cart-repository");
let DeleteDishToCartUseCase = class DeleteDishToCartUseCase {
    cartRepository;
    cartItemsRepository;
    constructor(cartRepository, cartItemsRepository) {
        this.cartRepository = cartRepository;
        this.cartItemsRepository = cartItemsRepository;
    }
    async execute({ cartId, dishId, }) {
        const cart = await this.cartRepository.findById(cartId);
        if (!cart) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        const currentCartItems = await this.cartItemsRepository.findManyByCartId(cartId);
        const cartItemList = new cart_item_list_1.CartItemList(currentCartItems);
        const cartItem = currentCartItems.find((cartItem) => cartItem.dishId.toString() === dishId);
        if (!cartItem) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        cartItemList.remove(cartItem);
        const totalAmount = cartItemList.currentItems.reduce((acc, cartItem) => acc + cartItem.cost, 0);
        cart.items = cartItemList;
        cart.totalAmount = totalAmount;
        await this.cartRepository.save(cart);
        return (0, either_1.right)({
            cart,
        });
    }
};
exports.DeleteDishToCartUseCase = DeleteDishToCartUseCase;
exports.DeleteDishToCartUseCase = DeleteDishToCartUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cart_repository_1.CartRepository,
        cart_item_repository_1.CartItemsRepository])
], DeleteDishToCartUseCase);
//# sourceMappingURL=delete-dish-to-cart.js.map