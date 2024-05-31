"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishWithDetailsPresenter = void 0;
class DishWithDetailsPresenter {
    static toHTTP(dish) {
        return {
            id: dish.dishId.toString(),
            name: dish.name,
            slug: dish.slug,
            description: dish.description,
            price: dish.price,
            category: dish.category,
            ingredients: dish.ingredients,
            attachments: dish.attachments.map((attachment) => ({
                title: attachment.title,
                url: attachment.url,
                id: attachment.id.toString(),
            })),
            isFavorite: dish.isFavorite,
            createdAt: dish.createdAt,
            updatedAt: dish.updatedAt,
        };
    }
}
exports.DishWithDetailsPresenter = DishWithDetailsPresenter;
//# sourceMappingURL=dish-with-details-presenter.js.map