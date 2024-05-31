"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishIngredient = void 0;
const entity_1 = require("../../../../core/entities/entity");
class DishIngredient extends entity_1.Entity {
    get dishId() {
        return this.props.dishId;
    }
    get ingredientName() {
        return this.props.ingredientName;
    }
    static create(props, id) {
        const dishIngredient = new DishIngredient(props, id);
        return dishIngredient;
    }
}
exports.DishIngredient = DishIngredient;
//# sourceMappingURL=dish-ingredient.js.map