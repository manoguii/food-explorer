"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishPresenter = void 0;
class DishPresenter {
    static toHTTP(dish) {
        return {
            id: dish.id.toString(),
            slug: dish.slug.value,
            name: dish.name,
            categoryId: dish.categoryId.toString(),
            description: dish.description,
            price: dish.price,
            createdAt: dish.createdAt,
            updatedAt: dish.updatedAt,
        };
    }
}
exports.DishPresenter = DishPresenter;
//# sourceMappingURL=dish-presenter.js.map