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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadAttachmentController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const invalid_attachment_type_error_1 = require("../../../domain/restaurant/application/use-cases/errors/invalid-attachment-type-error");
const upload_and_create_attachment_1 = require("../../../domain/restaurant/application/use-cases/upload-and-create-attachment");
let UploadAttachmentController = class UploadAttachmentController {
    uploadAndCreateAttachment;
    constructor(uploadAndCreateAttachment) {
        this.uploadAndCreateAttachment = uploadAndCreateAttachment;
    }
    async handle(file) {
        const result = await this.uploadAndCreateAttachment.execute({
            body: file.buffer,
            fileName: file.originalname,
            fileType: file.mimetype,
        });
        if (result.isLeft()) {
            const error = result.value;
            switch (error.constructor) {
                case invalid_attachment_type_error_1.InvalidAttachmentTypeError:
                    throw new common_1.BadRequestException(error.message);
                default:
                    throw new common_1.BadRequestException(error.message);
            }
        }
        const { attachment } = result.value;
        return {
            attachmentId: attachment.id.toString(),
        };
    }
};
exports.UploadAttachmentController = UploadAttachmentController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({
                maxSize: 1024 * 1024 * 6,
            }),
            new common_1.FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }),
        ],
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadAttachmentController.prototype, "handle", null);
exports.UploadAttachmentController = UploadAttachmentController = __decorate([
    (0, swagger_1.ApiTags)('Attachments'),
    (0, common_1.Controller)('/attachments'),
    __metadata("design:paramtypes", [upload_and_create_attachment_1.UploadAndCreateAttachmentsUseCase])
], UploadAttachmentController);
//# sourceMappingURL=upload-attachment.controller.js.map