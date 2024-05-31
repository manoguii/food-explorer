"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptHasher = void 0;
const bcryptjs_1 = require("bcryptjs");
class BcryptHasher {
    HASH_SALT_LENGTH = 8;
    hash(plain) {
        return (0, bcryptjs_1.hash)(plain, this.HASH_SALT_LENGTH);
    }
    compare(plain, hash) {
        return (0, bcryptjs_1.compare)(plain, hash);
    }
}
exports.BcryptHasher = BcryptHasher;
//# sourceMappingURL=bcrypt-hasher.js.map