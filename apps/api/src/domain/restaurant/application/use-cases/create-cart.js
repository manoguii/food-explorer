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
exports.CreateCartUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const unique_entity_id_1 = require("../../../../core/entities/unique-entity-id");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const cart_1 = require("../../enterprise/entities/cart");
const cart_repository_1 = require("../repositories/cart-repository");
const clients_repository_1 = require("../repositories/clients-repository");
let CreateCartUseCase = class CreateCartUseCase {
    cartRepository;
    clientsRepository;
    constructor(cartRepository, clientsRepository) {
        this.cartRepository = cartRepository;
        this.clientsRepository = clientsRepository;
    }
    async execute({ clientId, }) {
        const client = await this.clientsRepository.findById(clientId);
        if (!client) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        const cartExists = await this.cartRepository.findEmptyCartByClientId(clientId);
        if (cartExists) {
            return (0, either_1.right)({
                cart: cartExists,
            });
        }
        const cart = cart_1.Cart.create({
            clientId: new unique_entity_id_1.UniqueEntityID(clientId),
        });
        await this.cartRepository.create(cart);
        return (0, either_1.right)({
            cart,
        });
    }
};
exports.CreateCartUseCase = CreateCartUseCase;
exports.CreateCartUseCase = CreateCartUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cart_repository_1.CartRepository,
        clients_repository_1.ClientsRepository])
], CreateCartUseCase);
//# sourceMappingURL=create-cart.js.map