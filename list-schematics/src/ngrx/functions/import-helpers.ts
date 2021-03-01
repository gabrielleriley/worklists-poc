import { strings } from "@angular-devkit/core";

export function getFilePath(name: string, fileType: string) {
    return `./${strings.dasherize(name)}.${fileType}`;
}

export function getFileName(name: string, fileType: string) {
    return `${strings.dasherize(name)}.${fileType}`;
}

export function getEntityServiceFileName(name: string) {
    return `${strings.dasherize(name)}-entity.service`;
}

