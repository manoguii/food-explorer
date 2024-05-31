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
exports.GetDashboardMetricsUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const clients_repository_1 = require("../repositories/clients-repository");
const orders_repository_1 = require("../repositories/orders-repository");
const unauthorized_error_1 = require("./errors/unauthorized-error");
let GetDashboardMetricsUseCase = class GetDashboardMetricsUseCase {
    ordersRepository;
    clientsRepository;
    constructor(ordersRepository, clientsRepository) {
        this.ordersRepository = ordersRepository;
        this.clientsRepository = clientsRepository;
    }
    async execute({ clientId, startDate, endDate, }) {
        const client = await this.clientsRepository.findById(clientId);
        if (!client) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        if (!client.isAdmin()) {
            return (0, either_1.left)(new unauthorized_error_1.UnauthorizedError(clientId));
        }
        const [sales, recentSales, totalRevenue, activeClients, overview] = await Promise.all([
            this.ordersRepository.getSales(startDate, endDate),
            this.ordersRepository.getRecentSales(startDate, endDate),
            this.ordersRepository.getTotalRevenue(startDate, endDate),
            this.ordersRepository.getActiveClients(startDate, endDate),
            this.ordersRepository.getOverview(),
        ]);
        const metrics = {
            sales,
            recentSales,
            totalRevenue,
            activeClients,
            overview,
        };
        return (0, either_1.right)(metrics);
    }
};
exports.GetDashboardMetricsUseCase = GetDashboardMetricsUseCase;
exports.GetDashboardMetricsUseCase = GetDashboardMetricsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_repository_1.OrdersRepository,
        clients_repository_1.ClientsRepository])
], GetDashboardMetricsUseCase);
//# sourceMappingURL=get-dashboard-metrics.js.map