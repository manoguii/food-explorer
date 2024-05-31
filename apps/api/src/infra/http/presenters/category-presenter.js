"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryPresenter = void 0;
class CategoryPresenter {
    static toHTTP(category) {
        return {
            id: category.id.toString(),
            name: category.name,
            createdAt: category.createdAt,
        };
    }
}
exports.CategoryPresenter = CategoryPresenter;
//# sourceMappingURL=category-presenter.js.map