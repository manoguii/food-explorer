"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Price = void 0;
class Price {
    value;
    constructor(value) {
        this.value = value;
    }
    static create(value) {
        return new Price(value);
    }
}
exports.Price = Price;
//# sourceMappingURL=price.js.map