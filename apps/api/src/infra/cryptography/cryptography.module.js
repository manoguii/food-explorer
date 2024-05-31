"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptographyModule = void 0;
const common_1 = require("@nestjs/common");
const encrypter_1 = require("../../domain/restaurant/application/cryptography/encrypter");
const hash_comparer_1 = require("../../domain/restaurant/application/cryptography/hash-comparer");
const hash_generator_1 = require("../../domain/restaurant/application/cryptography/hash-generator");
const bcrypt_hasher_1 = require("./bcrypt-hasher");
const jwt_encrypter_1 = require("./jwt-encrypter");
let CryptographyModule = class CryptographyModule {
};
exports.CryptographyModule = CryptographyModule;
exports.CryptographyModule = CryptographyModule = __decorate([
    (0, common_1.Module)({
        providers: [
            { provide: encrypter_1.Encrypter, useClass: jwt_encrypter_1.JwtEncrypter },
            { provide: hash_comparer_1.HashComparer, useClass: bcrypt_hasher_1.BcryptHasher },
            { provide: hash_generator_1.HashGenerator, useClass: bcrypt_hasher_1.BcryptHasher },
        ],
        exports: [encrypter_1.Encrypter, hash_comparer_1.HashComparer, hash_generator_1.HashGenerator],
    })
], CryptographyModule);
//# sourceMappingURL=cryptography.module.js.map