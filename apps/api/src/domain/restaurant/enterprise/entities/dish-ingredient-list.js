"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishIngredientList = void 0;
const watched_list_1 = require("../../../../core/entities/watched-list");
class DishIngredientList extends watched_list_1.WatchedList {
    compareItems(a, b) {
        return a.ingredientName === b.ingredientName;
    }
}
exports.DishIngredientList = DishIngredientList;
//# sourceMappingURL=dish-ingredient-list.js.map