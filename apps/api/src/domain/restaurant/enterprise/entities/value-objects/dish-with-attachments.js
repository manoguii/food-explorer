"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishWithAttachments = void 0;
const value_object_1 = require("../../../../../core/entities/value-object");
class DishWithAttachments extends value_object_1.ValueObject {
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
    get attachments() {
        return this.props.attachments;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    static create(props) {
        return new DishWithAttachments(props);
    }
}
exports.DishWithAttachments = DishWithAttachments;
//# sourceMappingURL=dish-with-attachments.js.map