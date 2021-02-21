import { strings } from "@angular-devkit/core";

export function getFilePath(name: string, fileType: string) {
    return `./${strings.dasherize(name)}.${fileType}`;
}
