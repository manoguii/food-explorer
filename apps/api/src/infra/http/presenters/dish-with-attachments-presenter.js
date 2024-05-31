"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishWithAttachmentsPresenter = void 0;
class DishWithAttachmentsPresenter {
    static toHTTP(dish) {
        return {
            id: dish.dishId.toString(),
            name: dish.name,
            slug: dish.slug,
            description: dish.description,
            price: dish.price,
            attachments: dish.attachments.map((attachment) => ({
                title: attachment.title,
                url: attachment.url,
            })),
            createdAt: dish.createdAt,
            updatedAt: dish.updatedAt,
        };
    }
}
exports.DishWithAttachmentsPresenter = DishWithAttachmentsPresenter;
//# sourceMappingURL=dish-with-attachments-presenter.js.map