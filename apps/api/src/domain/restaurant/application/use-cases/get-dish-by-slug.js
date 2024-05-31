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
exports.GetDishBySlugUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const resource_not_found_error_1 = require("../../../../core/errors/errors/resource-not-found-error");
const dish_repository_1 = require("../repositories/dish-repository");
let GetDishBySlugUseCase = class GetDishBySlugUseCase {
    dishRepository;
    constructor(dishRepository) {
        this.dishRepository = dishRepository;
    }
    async execute({ slug, }) {
        const dish = await this.dishRepository.findBySlugWithDetails(slug);
        if (!dish) {
            return (0, either_1.left)(new resource_not_found_error_1.ResourceNotFoundError());
        }
        return (0, either_1.right)({
            dish,
        });
    }
};
exports.GetDishBySlugUseCase = GetDishBySlugUseCase;
exports.GetDishBySlugUseCase = GetDishBySlugUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dish_repository_1.DishRepository])
], GetDishBySlugUseCase);
//# sourceMappingURL=get-dish-by-slug.js.map