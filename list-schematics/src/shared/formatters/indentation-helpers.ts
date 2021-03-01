export const TAB = `\xa0\xa0\xa0\xa0`;

export interface ILineIndent {
    lineContents: string;
    indents: number;
}
export const line = (lineContents: string, indents: number = 1): ILineIndent => ({ lineContents, indents });

export function convertLines(lines: ILineIndent[]) {
    const getIndent = (indents: number) => TAB.repeat(indents);
    return `${lines.map(l => `${getIndent(l.indents)}${l.lineContents}`).join('\n')}`;
}