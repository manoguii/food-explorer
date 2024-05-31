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
exports.CreateDishController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const create_dish_1 = require("../../../domain/restaurant/application/use-cases/create-dish");
const roles_decorator_1 = require("../../auth/roles-decorator");
const roles_enum_1 = require("../../auth/roles-enum");
const zod_validation_pipe_1 = require("../pipes/zod-validation-pipe");
const createDishBodySchema = zod_1.z.object({
    name: zod_1.z.string(),
    price: zod_1.z.number(),
    description: zod_1.z.string(),
    categoryId: zod_1.z.string(),
    ingredients: zod_1.z.array(zod_1.z.string()),
    attachmentsIds: zod_1.z.array(zod_1.z.string().uuid()),
});
const bodyValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(createDishBodySchema);
let CreateDishController = class CreateDishController {
    createDish;
    constructor(createDish) {
        this.createDish = createDish;
    }
    async handle(body) {
        const { description, name, price, categoryId, ingredients, attachmentsIds, } = body;
        const result = await this.createDish.execute({
            name,
            price,
            description,
            categoryId,
            ingredients,
            attachmentsIds,
        });
        if (result.isLeft()) {
            throw new common_1.BadRequestException();
        }
    }
};
exports.CreateDishController = CreateDishController;
__decorate([
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)(bodyValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CreateDishController.prototype, "handle", null);
exports.CreateDishController = CreateDishController = __decorate([
    (0, swagger_1.ApiTags)('Dish'),
    (0, common_1.Controller)('/dishes'),
    __metadata("design:paramtypes", [create_dish_1.CreateDishUseCase])
], CreateDishController);
//# sourceMappingURL=create-dish.controller.js.map