import { TAB } from "./constants";

export interface ILineIndent {
    lineContents: string;
    indents: number;
}
export const line = (lineContents: string, indents: number = 1) => ({ lineContents, indents });

export function convertLines(lines: ILineIndent[]) {
    const getIndent = (indents: number) => TAB.repeat(indents);
    return `${lines.map(l => `${getIndent(l.indents)}${l.lineContents}`).join('\n')}`;
}