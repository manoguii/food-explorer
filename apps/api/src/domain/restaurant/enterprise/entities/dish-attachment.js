"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishAttachment = void 0;
const entity_1 = require("../../../../core/entities/entity");
class DishAttachment extends entity_1.Entity {
    get dishId() {
        return this.props.dishId;
    }
    get attachmentId() {
        return this.props.attachmentId;
    }
    static create(props, id) {
        const dishAttachment = new DishAttachment(props, id);
        return dishAttachment;
    }
}
exports.DishAttachment = DishAttachment;
//# sourceMappingURL=dish-attachment.js.map