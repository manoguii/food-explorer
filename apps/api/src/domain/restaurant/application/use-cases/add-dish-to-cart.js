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
exports.AddDishToCartUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const cart_item_1 = require("../../enterprise/entities/cart-item");
const cart_item_list_1 = require("../../enterprise/entities/cart-item-list");
const cart_item_repository_1 = require("../repositories/cart-item-repository");
const cart_repository_1 = require("../repositories/cart-repository");
const dish_repository_1 = require("../repositories/dish-repository");
let AddDishToCartUseCase = class AddDishToCartUseCase {
    cartRepository;
    cartItemsRepository;
    dishRepository;
    constructor(cartRepository, cartItemsRepository, dishRepository) {
        this.cartRepository = cartRepository;
        this.cartItemsRepository = cartItemsRepository;
        this.dishRepository = dishRepository;
    }
    async execute({ cartId, dishId, quantity, }) {
        const cart = await this.cartRepository.findById(cartId);
        if (!cart) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        const dish = await this.dishRepository.findById(dishId);
        if (!dish) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        const currentCartItems = await this.cartItemsRepository.findManyByCartId(cart.id.toString());
        const cartItemList = new cart_item_list_1.CartItemList(currentCartItems);
        const cartItem = currentCartItems.find((cartItem) => cartItem.dishId.toString() === dishId);
        if (!cartItem) {
            const newCartItem = cart_item_1.CartItem.create({
                dishId: new unique_entity_id_1.UniqueEntityID(dishId),
                cartId: new unique_entity_id_1.UniqueEntityID(cartId),
                cost: dish.price * quantity,
                quantity,
            });
            cartItemList.add(newCartItem);
        }
        else {
            cartItem.quantity += quantity;
            cartItem.cost = cartItem.quantity * dish.price;
            await this.cartItemsRepository.save(cartItem);
        }
        const totalAmount = cartItemList.currentItems.reduce((acc, item) => {
            return acc + item.cost;
        }, 0);
        cart.items = cartItemList;
        cart.totalAmount = totalAmount;
        await this.cartRepository.save(cart);
        return (0, either_1.right)({
            cart,
        });
    }
};
exports.AddDishToCartUseCase = AddDishToCartUseCase;
exports.AddDishToCartUseCase = AddDishToCartUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cart_repository_1.CartRepository,
        cart_item_repository_1.CartItemsRepository,
        dish_repository_1.DishRepository])
], AddDishToCartUseCase);
//# sourceMappingURL=add-dish-to-cart.js.map