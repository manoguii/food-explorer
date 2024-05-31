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
exports.FetchAllOrdersUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const clients_repository_1 = require("../repositories/clients-repository");
const orders_repository_1 = require("../repositories/orders-repository");
const client_not_found_error_1 = require("./errors/client-not-found-error");
const unauthorized_error_1 = require("./errors/unauthorized-error");
let FetchAllOrdersUseCase = class FetchAllOrdersUseCase {
    ordersRepository;
    clientsRepository;
    constructor(ordersRepository, clientsRepository) {
        this.ordersRepository = ordersRepository;
        this.clientsRepository = clientsRepository;
    }
    async execute({ clientId, page, }) {
        const client = await this.clientsRepository.findById(clientId);
        if (!client) {
            return (0, either_1.left)(new client_not_found_error_1.ClientNotFoundError(clientId));
        }
        if (!client.isAdmin()) {
            return (0, either_1.left)(new unauthorized_error_1.UnauthorizedError(clientId));
        }
        const { orders, totalPages } = await this.ordersRepository.findAllWithDetails({
            page,
        });
        return (0, either_1.right)({
            orders,
            totalPages,
        });
    }
};
exports.FetchAllOrdersUseCase = FetchAllOrdersUseCase;
exports.FetchAllOrdersUseCase = FetchAllOrdersUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_repository_1.OrdersRepository,
        clients_repository_1.ClientsRepository])
], FetchAllOrdersUseCase);
//# sourceMappingURL=fetch-all-orders.js.map