"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const entity_1 = require("../../../../core/entities/entity");
class Category extends entity_1.Entity {
    get name() {
        return this.props.name;
    }
    set name(name) {
        this.props.name = name;
        this.touch();
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    touch() {
        this.props.updatedAt = new Date();
    }
    static create(props, id) {
        const category = new Category({
            ...props,
            createdAt: props.createdAt ?? new Date(),
        }, id);
        return category;
    }
}
exports.Category = Category;
//# sourceMappingURL=category.js.map