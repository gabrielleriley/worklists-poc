import * as Helpers from '../../functions';

export function createIndexExports(name: string) {
    const exports = [
        Helpers.getFilePath(name, 'module'),
        Helpers.getFilePath(name, 'entity'),
        Helpers.getFilePath(name, 'actions'),
        Helpers.getFilePath(name, 'selectors')
    ];
    return exports.map(exportPath => `export * from '${exportPath}';`).join('\n');
}