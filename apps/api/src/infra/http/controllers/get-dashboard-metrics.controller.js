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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDashboardMetricsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const date_fns_1 = require("date-fns");
const zod_1 = require("zod");
const resource_not_found_error_1 = require("../../../core/errors/errors/resource-not-found-error");
const get_dashboard_metrics_1 = require("../../../domain/restaurant/application/use-cases/get-dashboard-metrics");
const current_user_decorator_1 = require("../../auth/current-user-decorator");
const zod_validation_pipe_1 = require("../pipes/zod-validation-pipe");
const today = new Date();
const oneMonthAgo = (0, date_fns_1.subMonths)(today, 1);
const searchParamsSchema = zod_1.z
    .object({
    startDate: zod_1.z.string().optional().default((0, date_fns_1.formatISO)(oneMonthAgo)),
    endDate: zod_1.z.string().optional().default((0, date_fns_1.formatISO)(today)),
})
    .refine((data) => {
    const startDate = Date.parse(data.startDate);
    const endDate = Date.parse(data.endDate);
    return !isNaN(startDate) && !isNaN(endDate) && startDate <= endDate;
}, {
    message: 'startDate and endDate must be valid dates and startDate should be less than or equal to endDate',
    path: ['startDate', 'endDate'],
})
    .transform((data) => {
    return {
        startDate: (0, date_fns_1.parseISO)(data.startDate),
        endDate: (0, date_fns_1.parseISO)(data.endDate),
    };
});
const searchParamsValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(searchParamsSchema);
let GetDashboardMetricsController = class GetDashboardMetricsController {
    getDashboardMetrics;
    constructor(getDashboardMetrics) {
        this.getDashboardMetrics = getDashboardMetrics;
    }
    async handle(user, searchParams) {
        const { startDate, endDate } = searchParams;
        const result = await this.getDashboardMetrics.execute({
            clientId: user.sub,
            startDate,
            endDate,
        });
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case resource_not_found_error_1.ResourceNotFoundError:
                    throw new common_1.NotFoundException(error.message);
                default:
                    throw new common_1.BadRequestException(error.message);
            }
        }
        const metrics = result.value;
        return { metrics };
    }
};
exports.GetDashboardMetricsController = GetDashboardMetricsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)(searchParamsValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GetDashboardMetricsController.prototype, "handle", null);
exports.GetDashboardMetricsController = GetDashboardMetricsController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard Metrics'),
    (0, common_1.Controller)('/dashboard-metrics'),
    __metadata("design:paramtypes", [get_dashboard_metrics_1.GetDashboardMetricsUseCase])
], GetDashboardMetricsController);
//# sourceMappingURL=get-dashboard-metrics.controller.js.map