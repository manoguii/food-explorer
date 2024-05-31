"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slug = void 0;
class Slug {
    value;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new Slug(value);
    }
    static createFromText(text) {
        const slugText = text
            .normalize('NFKD')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/_/g, '-')
            .replace(/--+/g, '-')
            .replace(/-$/g, '');
        return new Slug(slugText);
    }
}
exports.Slug = Slug;
//# sourceMappingURL=slug.js.map