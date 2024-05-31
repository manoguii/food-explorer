"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.right = exports.left = exports.Right = exports.Left = void 0;
class Left {
    value;
    constructor(value) {
        this.value = value;
    }
    isRight() {
        return false;
    }
    isLeft() {
        return true;
    }
}
exports.Left = Left;
class Right {
    value;
    constructor(value) {
        this.value = value;
    }
    isRight() {
        return true;
    }
    isLeft() {
        return false;
    }
}
exports.Right = Right;
const left = (value) => {
    return new Left(value);
};
exports.left = left;
const right = (value) => {
    return new Right(value);
};
exports.right = right;
//# sourceMappingURL=either.js.map