"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpModule = void 0;
const common_1 = require("@nestjs/common");
const add_dish_to_cart_1 = require("../../domain/restaurant/application/use-cases/add-dish-to-cart");
const authenticate_client_1 = require("../../domain/restaurant/application/use-cases/authenticate-client");
const choose_dish_as_favorite_1 = require("../../domain/restaurant/application/use-cases/choose-dish-as-favorite");
const create_cart_1 = require("../../domain/restaurant/application/use-cases/create-cart");
const create_category_1 = require("../../domain/restaurant/application/use-cases/create-category");
const create_checkout_session_1 = require("../../domain/restaurant/application/use-cases/create-checkout-session");
const create_dish_1 = require("../../domain/restaurant/application/use-cases/create-dish");
const delete_category_1 = require("../../domain/restaurant/application/use-cases/delete-category");
const delete_dish_1 = require("../../domain/restaurant/application/use-cases/delete-dish");
const delete_dish_from_favorites_1 = require("../../domain/restaurant/application/use-cases/delete-dish-from-favorites");
const delete_dish_to_cart_1 = require("../../domain/restaurant/application/use-cases/delete-dish-to-cart");
const edit_cart_1 = require("../../domain/restaurant/application/use-cases/edit-cart");
const edit_category_1 = require("../../domain/restaurant/application/use-cases/edit-category");
const edit_dish_1 = require("../../domain/restaurant/application/use-cases/edit-dish");
const fetch_categories_1 = require("../../domain/restaurant/application/use-cases/fetch-categories");
const fetch_dishes_by_category_1 = require("../../domain/restaurant/application/use-cases/fetch-dishes-by-category");
const fetch_favorite_dishes_1 = require("../../domain/restaurant/application/use-cases/fetch-favorite-dishes");
const fetch_filtered_dishes_1 = require("../../domain/restaurant/application/use-cases/fetch-filtered-dishes");
const fetch_orders_1 = require("../../domain/restaurant/application/use-cases/fetch-orders");
const get_cart_by_id_1 = require("../../domain/restaurant/application/use-cases/get-cart-by-id");
const get_dashboard_metrics_1 = require("../../domain/restaurant/application/use-cases/get-dashboard-metrics");
const get_dish_by_slug_1 = require("../../domain/restaurant/application/use-cases/get-dish-by-slug");
const get_order_by_id_1 = require("../../domain/restaurant/application/use-cases/get-order-by-id");
const register_client_1 = require("../../domain/restaurant/application/use-cases/register-client");
const upload_and_create_attachment_1 = require("../../domain/restaurant/application/use-cases/upload-and-create-attachment");
const stripe_webhook_1 = require("../../domain/restaurant/application/webhooks/stripe-webhook");
const cryptography_module_1 = require("../cryptography/cryptography.module");
const database_module_1 = require("../database/database.module");
const env_module_1 = require("../env/env.module");
const env_service_1 = require("../env/env.service");
const payment_module_1 = require("../payment/payment.module");
const add_dish_to_cart_controller_1 = require("./controllers/add-dish-to-cart.controller");
const authenticate_controller_1 = require("./controllers/authenticate.controller");
const choose_dish_as_favorite_controller_1 = require("./controllers/choose-dish-as-favorite.controller");
const create_account_controller_1 = require("./controllers/create-account.controller");
const create_cart_controller_1 = require("./controllers/create-cart.controller");
const create_category_controller_1 = require("./controllers/create-category.controller");
const create_checkout_session_controller_1 = require("./controllers/create-checkout-session.controller");
const create_dish_controller_1 = require("./controllers/create-dish.controller");
const delete_category_controller_1 = require("./controllers/delete-category.controller");
const delete_dish_controller_1 = require("./controllers/delete-dish.controller");
const delete_dish_from_favorites_controller_1 = require("./controllers/delete-dish-from-favorites.controller");
const delete_dish_to_cart_controller_1 = require("./controllers/delete-dish-to-cart.controller");
const edit_cart_controller_1 = require("./controllers/edit-cart.controller");
const edit_category_controller_1 = require("./controllers/edit-category.controller");
const edit_dish_controller_1 = require("./controllers/edit-dish.controller");
const fetch_categories_controller_1 = require("./controllers/fetch-categories.controller");
const fetch_dishes_by_category_controller_1 = require("./controllers/fetch-dishes-by-category.controller");
const fetch_favorite_dishes_controller_1 = require("./controllers/fetch-favorite-dishes.controller");
const fetch_filtered_dishes_controller_1 = require("./controllers/fetch-filtered-dishes.controller");
const fetch_orders_controller_1 = require("./controllers/fetch-orders.controller");
const get_cart_by_id_controller_1 = require("./controllers/get-cart-by-id.controller");
const get_dashboard_metrics_controller_1 = require("./controllers/get-dashboard-metrics.controller");
const get_dish_by_slug_controller_1 = require("./controllers/get-dish-by-slug.controller");
const get_order_by_id_controller_1 = require("./controllers/get-order-by-id.controller");
const upload_attachment_controller_1 = require("./controllers/upload-attachment.controller");
const stripe_webhook_controller_1 = require("./webhooks/stripe-webhook.controller");
let HttpModule = class HttpModule {
};
exports.HttpModule = HttpModule;
exports.HttpModule = HttpModule = __decorate([
    (0, common_1.Module)({
        imports: [
            env_module_1.EnvModule,
            database_module_1.DatabaseModule,
            cryptography_module_1.CryptographyModule,
            payment_module_1.PaymentModule.forRootAsync({
                inject: [env_service_1.EnvService],
                useFactory: (envService) => {
                    const apiKey = envService.get('STRIPE_API_SECRET_KEY');
                    return {
                        apiKey,
                        options: {
                            apiVersion: '2023-10-16',
                        },
                    };
                },
            }),
        ],
        controllers: [
            create_account_controller_1.CreateAccountController,
            create_dish_controller_1.CreateDishController,
            authenticate_controller_1.AuthenticateController,
            create_category_controller_1.CreateCategoryController,
            get_dish_by_slug_controller_1.GetDishBySlugController,
            upload_attachment_controller_1.UploadAttachmentController,
            edit_dish_controller_1.EditDishController,
            choose_dish_as_favorite_controller_1.ChooseDishAsFavoriteController,
            delete_category_controller_1.DeleteCategoryController,
            delete_dish_controller_1.DeleteDishController,
            edit_category_controller_1.EditCategoryController,
            fetch_favorite_dishes_controller_1.FetchFavoriteDishesController,
            create_cart_controller_1.CreateCartController,
            edit_cart_controller_1.EditCartController,
            fetch_dishes_by_category_controller_1.FetchDishesByCategoryController,
            fetch_categories_controller_1.FetchCategoriesController,
            fetch_filtered_dishes_controller_1.FetchFilteredDishesController,
            delete_dish_from_favorites_controller_1.DeleteDishFromFavoritesController,
            get_cart_by_id_controller_1.GetCartByIdController,
            add_dish_to_cart_controller_1.AddDishToCartController,
            delete_dish_to_cart_controller_1.DeleteDishToCartController,
            create_checkout_session_controller_1.CreateCheckoutSessionController,
            stripe_webhook_controller_1.StripeWebhookController,
            fetch_orders_controller_1.FetchOrdersController,
            get_order_by_id_controller_1.GetOrderByIdController,
            get_dashboard_metrics_controller_1.GetDashboardMetricsController,
        ],
        providers: [
            register_client_1.CreateAccountUseCase,
            create_dish_1.CreateDishUseCase,
            authenticate_client_1.AuthenticateClientUseCase,
            create_category_1.CreateCategoryUseCase,
            get_dish_by_slug_1.GetDishBySlugUseCase,
            upload_and_create_attachment_1.UploadAndCreateAttachmentsUseCase,
            edit_dish_1.EditDishUseCase,
            choose_dish_as_favorite_1.ChooseDishAsFavoriteUseCase,
            delete_category_1.DeleteCategoryUseCase,
            delete_dish_1.DeleteDishUseCase,
            edit_category_1.EditCategoryUseCase,
            fetch_favorite_dishes_1.FetchFavoriteDishesUseCase,
            create_cart_1.CreateCartUseCase,
            edit_cart_1.EditCartUseCase,
            fetch_dishes_by_category_1.FetchDishesByCategoryUseCase,
            fetch_categories_1.FetchCategoriesUseCase,
            fetch_filtered_dishes_1.FetchFilteredDishesUseCase,
            delete_dish_from_favorites_1.DeleteDishFromFavoritesUseCase,
            get_cart_by_id_1.GetCartByIdUseCase,
            add_dish_to_cart_1.AddDishToCartUseCase,
            delete_dish_to_cart_1.DeleteDishToCartUseCase,
            create_checkout_session_1.CreateCheckoutSessionUseCase,
            stripe_webhook_1.StripeWebhookUseCase,
            fetch_orders_1.FetchOrdersUseCase,
            get_order_by_id_1.GetOrderByIdUseCase,
            get_dashboard_metrics_1.GetDashboardMetricsUseCase,
        ],
    })
], HttpModule);
//# sourceMappingURL=http.module.js.map