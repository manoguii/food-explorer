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
exports.UploadAndCreateAttachmentsUseCase = void 0;
const common_1 = require("@nestjs/common");
const either_1 = require("../../../../core/either");
const attachment_1 = require("../../enterprise/entities/attachment");
const attachments_repository_1 = require("../repositories/attachments-repository");
const uploader_1 = require("../storage/uploader");
const invalid_attachment_type_error_1 = require("./errors/invalid-attachment-type-error");
let UploadAndCreateAttachmentsUseCase = class UploadAndCreateAttachmentsUseCase {
    attachmentsRepository;
    uploader;
    constructor(attachmentsRepository, uploader) {
        this.attachmentsRepository = attachmentsRepository;
        this.uploader = uploader;
    }
    async execute({ fileName, fileType, body, }) {
        if (!/^(image\/(jpeg|png))$/.test(fileType)) {
            return (0, either_1.left)(new invalid_attachment_type_error_1.InvalidAttachmentTypeError(fileType));
        }
        const { url } = await this.uploader.upload({
            fileName,
            fileType,
            body,
        });
        const attachment = attachment_1.Attachment.create({
            title: fileName,
            url,
        });
        await this.attachmentsRepository.create(attachment);
        return (0, either_1.right)({
            attachment,
        });
    }
};
exports.UploadAndCreateAttachmentsUseCase = UploadAndCreateAttachmentsUseCase;
exports.UploadAndCreateAttachmentsUseCase = UploadAndCreateAttachmentsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attachments_repository_1.AttachmentsRepository,
        uploader_1.Uploader])
], UploadAndCreateAttachmentsUseCase);
//# sourceMappingURL=upload-and-create-attachment.js.map