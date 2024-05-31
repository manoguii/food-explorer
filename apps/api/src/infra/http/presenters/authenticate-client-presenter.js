"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPresenter = void 0;
class ClientPresenter {
    static toHTTP(client, accessToken) {
        return {
            id: client.id.toString(),
            name: client.name,
            email: client.email,
            access_token: accessToken,
        };
    }
}
exports.ClientPresenter = ClientPresenter;
//# sourceMappingURL=authenticate-client-presenter.js.map