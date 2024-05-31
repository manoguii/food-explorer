"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteDish = void 0;
const entity_1 = require("../../../../core/entities/entity");
class FavoriteDish extends entity_1.Entity {
    get dishId() {
        return this.props.dishId;
    }
    get clientId() {
        return this.props.clientId;
    }
    static create(props, id) {
        const favoriteDish = new FavoriteDish(props, id);
        return favoriteDish;
    }
}
exports.FavoriteDish = FavoriteDish;
//# sourceMappingURL=favorite-dish.js.map