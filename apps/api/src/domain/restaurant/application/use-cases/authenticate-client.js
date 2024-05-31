"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateClientUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const encrypter_1 = require("../cryptography/encrypter");
const hash_comparer_1 = require("../cryptography/hash-comparer");
const clients_repository_1 = require("../repositories/clients-repository");
const wrong_credentials_error_1 = require("./errors/wrong-credentials-error");
let AuthenticateClientUseCase = class AuthenticateClientUseCase {
    clientsRepository;
    hashComparer;
    encrypter;
    constructor(clientsRepository, hashComparer, encrypter) {
        this.clientsRepository = clientsRepository;
        this.hashComparer = hashComparer;
        this.encrypter = encrypter;
    }
    async execute({ email, password, }) {
        const client = await this.clientsRepository.findByEmail(email);
        if (!client) {
            return (0, either_1.left)(new wrong_credentials_error_1.WrongCredentialsError());
        }
        const isPasswordValid = await this.hashComparer.compare(password, client.password);
        if (!isPasswordValid) {
            return (0, either_1.left)(new wrong_credentials_error_1.WrongCredentialsError());
        }
        const accessToken = await this.encrypter.encrypt({
            sub: client.id.toString(),
        });
        return (0, either_1.right)({
            user: client,
            accessToken,
        });
    }
};
exports.AuthenticateClientUseCase = AuthenticateClientUseCase;
exports.AuthenticateClientUseCase = AuthenticateClientUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clients_repository_1.ClientsRepository,
        hash_comparer_1.HashComparer,
        encrypter_1.Encrypter])
], AuthenticateClientUseCase);
//# sourceMappingURL=authenticate-client.js.map