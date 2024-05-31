"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dish = void 0;
const aggregate_root_1 = require("../../../../core/entities/aggregate-root");
const dish_attachment_list_1 = require("./dish-attachment-list");
const dish_ingredient_list_1 = require("./dish-ingredient-list");
const slug_1 = require("./value-objects/slug");
class Dish extends aggregate_root_1.AggregateRoot {
    get categoryId() {
        return this.props.categoryId;
    }
    set categoryId(categoryId) {
        this.props.categoryId = categoryId;
        this.touch();
    }
    get attachments() {
        return this.props.attachments;
    }
    set attachments(attachments) {
        this.props.attachments = attachments;
        this.touch();
    }
    get ingredients() {
        return this.props.ingredients;
    }
    set ingredients(ingredients) {
        this.props.ingredients = ingredients;
        this.touch();
    }
    get name() {
        return this.props.name;
    }
    set name(name) {
        this.props.name = name;
        this.props.slug = slug_1.Slug.createFromText(name);
        this.touch();
    }
    get description() {
        return this.props.description;
    }
    set description(description) {
        this.props.description = description;
        this.touch();
    }
    get price() {
        return this.props.price.value;
    }
    set price(price) {
        this.props.price.value = price;
        this.touch();
    }
    get slug() {
        return this.props.slug;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    touch() {
        this.props.updatedAt = new Date();
    }
    static create(props, id) {
        const dish = new Dish({
            ...props,
            slug: props.slug ?? slug_1.Slug.createFromText(props.name),
            attachments: props.attachments ?? new dish_attachment_list_1.DishAttachmentList([]),
            ingredients: props.ingredients ?? new dish_ingredient_list_1.DishIngredientList(),
            createdAt: props.createdAt ?? new Date(),
        }, id);
        return dish;
    }
}
exports.Dish = Dish;
//# sourceMappingURL=dish.js.map