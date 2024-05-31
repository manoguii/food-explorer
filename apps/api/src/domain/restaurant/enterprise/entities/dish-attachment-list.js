"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishAttachmentList = void 0;
const watched_list_1 = require("../../../../core/entities/watched-list");
class DishAttachmentList extends watched_list_1.WatchedList {
    compareItems(a, b) {
        return a.attachmentId.equals(b.attachmentId);
    }
}
exports.DishAttachmentList = DishAttachmentList;
//# sourceMappingURL=dish-attachment-list.js.map