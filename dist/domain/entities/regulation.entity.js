"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegulationEntity = exports.RegulationStatus = void 0;
var RegulationStatus;
(function (RegulationStatus) {
    RegulationStatus["DRAFT"] = "DRAFT";
    RegulationStatus["PUBLISHED"] = "PUBLISHED";
})(RegulationStatus || (exports.RegulationStatus = RegulationStatus = {}));
class RegulationEntity {
    id;
    title;
    description;
    content;
    fileUrl;
    status;
    institutionId;
    authorId;
    createdAt;
    updatedAt;
    constructor(id, title, description, content, fileUrl, status, institutionId, authorId, createdAt, updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.content = content;
        this.fileUrl = fileUrl;
        this.status = status;
        this.institutionId = institutionId;
        this.authorId = authorId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.RegulationEntity = RegulationEntity;
//# sourceMappingURL=regulation.entity.js.map