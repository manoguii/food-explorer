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
exports.ChooseDishAsFavoriteController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const choose_dish_as_favorite_1 = require("../../../domain/restaurant/application/use-cases/choose-dish-as-favorite");
const conflict_exception_error_1 = require("../../../domain/restaurant/application/use-cases/errors/conflict-exception-error");
const current_user_decorator_1 = require("../../auth/current-user-decorator");
const zod_validation_pipe_1 = require("../pipes/zod-validation-pipe");
const pageQueryParamSchema = zod_1.z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(zod_1.z.number().min(1));
const queryValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(pageQueryParamSchema);
let ChooseDishAsFavoriteController = class ChooseDishAsFavoriteController {
    chooseDishAsFavorite;
    constructor(chooseDishAsFavorite) {
        this.chooseDishAsFavorite = chooseDishAsFavorite;
    }
    async handle(page, user, dishId) {
        const result = await this.chooseDishAsFavorite.execute({
            page,
            dishId,
            clientId: user.sub,
        });
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case conflict_exception_error_1.ConflictExceptionError:
                    throw new common_1.BadRequestException(error.message);
                default:
                    throw new common_1.BadRequestException(error.message);
            }
        }
    }
};
exports.ChooseDishAsFavoriteController = ChooseDishAsFavoriteController;
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Query)('page', queryValidationPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Param)('dishId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, String]),
    __metadata("design:returntype", Promise)
], ChooseDishAsFavoriteController.prototype, "handle", null);
exports.ChooseDishAsFavoriteController = ChooseDishAsFavoriteController = __decorate([
    (0, swagger_1.ApiTags)('Dish'),
    (0, common_1.Controller)('/dishes/:dishId/favorite'),
    __metadata("design:paramtypes", [choose_dish_as_favorite_1.ChooseDishAsFavoriteUseCase])
], ChooseDishAsFavoriteController);
//# sourceMappingURL=choose-dish-as-favorite.controller.js.map