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
exports.CreateAccountUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const client_1 = require("../../enterprise/entities/client");
const hash_generator_1 = require("../cryptography/hash-generator");
const clients_repository_1 = require("../repositories/clients-repository");
const client_already_exists_error_1 = require("./errors/client-already-exists-error");
let CreateAccountUseCase = class CreateAccountUseCase {
    clientsRepository;
    hashGenerator;
    constructor(clientsRepository, hashGenerator) {
        this.clientsRepository = clientsRepository;
        this.hashGenerator = hashGenerator;
    }
    async execute({ name, email, password, }) {
        const clientWithSameEmail = await this.clientsRepository.findByEmail(email);
        if (clientWithSameEmail) {
            return (0, either_1.left)(new client_already_exists_error_1.ClientAlreadyExistsError(email));
        }
        const hashedPassword = await this.hashGenerator.hash(password);
        const client = client_1.Client.create({
            name,
            email,
            password: hashedPassword,
        });
        await this.clientsRepository.create(client);
        return (0, either_1.right)({
            client,
        });
    }
};
exports.CreateAccountUseCase = CreateAccountUseCase;
exports.CreateAccountUseCase = CreateAccountUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clients_repository_1.ClientsRepository,
        hash_generator_1.HashGenerator])
], CreateAccountUseCase);
//# sourceMappingURL=register-client.js.map