"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attachment = void 0;
const entity_1 = require("../../../../core/entities/entity");
class Attachment extends entity_1.Entity {
    get title() {
        return this.props.title;
    }
    get url() {
        return this.props.url;
    }
    static create(props, id) {
        const attachment = new Attachment(props, id);
        return attachment;
    }
}
exports.Attachment = Attachment;
//# sourceMappingURL=attachment.js.map