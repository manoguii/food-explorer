"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishWithDetails = void 0;
const value_object_1 = require("../../../../../core/entities/value-object");
class DishWithDetails extends value_object_1.ValueObject {
    get dishId() {
        return this.props.dishId;
    }
    get name() {
        return this.props.name;
    }
    get description() {
        return this.props.description;
    }
    get price() {
        return this.props.price;
    }
    get slug() {
        return this.props.slug;
    }
    get category() {
        return this.props.category;
    }
    get ingredients() {
        return this.props.ingredients;
    }
    get attachments() {
        return this.props.attachments;
    }
    get isFavorite() {
        return this.props.isFavorite;
    }
    set isFavorite(value) {
        this.props.isFavorite = value;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    static create(props) {
        return new DishWithDetails(props);
    }
}
exports.DishWithDetails = DishWithDetails;
//# sourceMappingURL=dish-with-details.js.map