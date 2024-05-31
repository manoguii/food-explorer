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
exports.CreateCategoryUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const category_1 = require("../../enterprise/entities/category");
const category_repository_1 = require("../repositories/category-repository");
const conflict_exception_error_1 = require("./errors/conflict-exception-error");
let CreateCategoryUseCase = class CreateCategoryUseCase {
    categoryRepository;
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    async execute({ name, }) {
        const categoryExists = await this.categoryRepository.findByName(name);
        if (categoryExists) {
            return (0, either_1.left)(new conflict_exception_error_1.ConflictExceptionError(categoryExists.id.toString()));
        }
        const category = category_1.Category.create({
            name,
        });
        await this.categoryRepository.create(category);
        return (0, either_1.right)({
            category,
        });
    }
};
exports.CreateCategoryUseCase = CreateCategoryUseCase;
exports.CreateCategoryUseCase = CreateCategoryUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [category_repository_1.CategoryRepository])
], CreateCategoryUseCase);
//# sourceMappingURL=create-category.js.map