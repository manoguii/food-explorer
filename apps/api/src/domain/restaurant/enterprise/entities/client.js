"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const entity_1 = require("../../../../core/entities/entity");
class Client extends entity_1.Entity {
    get name() {
        return this.props.name;
    }
    get email() {
        return this.props.email;
    }
    get password() {
        return this.props.password;
    }
    get image() {
        return this.props.image;
    }
    get role() {
        return this.props.role;
    }
    get favoriteDishes() {
        return this.props.favoriteDishes;
    }
    isAdmin() {
        return this.props.role === 'ADMIN';
    }
    static create(props, id) {
        const client = new Client({
            ...props,
            role: props.role ?? 'CLIENT',
        }, id);
        return client;
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map