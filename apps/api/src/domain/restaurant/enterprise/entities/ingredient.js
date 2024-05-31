"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ingredient = void 0;
const entity_1 = require("../../../../core/entities/entity");
class Ingredient extends entity_1.Entity {
    get name() {
        return this.props.name;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    static create(props, id) {
        const ingredient = new Ingredient({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
        return ingredient;
    }
}
exports.Ingredient = Ingredient;
//# sourceMappingURL=ingredient.js.map