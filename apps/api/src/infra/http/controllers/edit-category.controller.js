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
exports.EditCategoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const resource_not_found_error_1 = require("../../../core/errors/errors/resource-not-found-error");
const edit_category_1 = require("../../../domain/restaurant/application/use-cases/edit-category");
const roles_decorator_1 = require("../../auth/roles-decorator");
const roles_enum_1 = require("../../auth/roles-enum");
const zod_validation_pipe_1 = require("../pipes/zod-validation-pipe");
const editCategoryBodySchema = zod_1.z.object({
    name: zod_1.z.string(),
});
const bodyValidationPipe = new zod_validation_pipe_1.ZodValidationPipe(editCategoryBodySchema);
let EditCategoryController = class EditCategoryController {
    editCategory;
    constructor(editCategory) {
        this.editCategory = editCategory;
    }
    async handle(body, categoryId) {
        const { name } = body;
        const result = await this.editCategory.execute({
            name,
            categoryId,
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
    }
};
exports.EditCategoryController = EditCategoryController;
__decorate([
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Body)(bodyValidationPipe)),
    __param(1, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EditCategoryController.prototype, "handle", null);
exports.EditCategoryController = EditCategoryController = __decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, common_1.Controller)('/categories/:categoryId'),
    __metadata("design:paramtypes", [edit_category_1.EditCategoryUseCase])
], EditCategoryController);
//# sourceMappingURL=edit-category.controller.js.map