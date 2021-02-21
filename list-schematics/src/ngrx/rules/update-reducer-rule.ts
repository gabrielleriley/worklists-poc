import { Rule, Tree } from "@angular-devkit/schematics";
import { appendReducer } from "./functions/reducer-updates";

export function appendToReducerRule(filePath: string): Rule {
    return (tree: Tree) => {
        let change = appendReducer(filePath, tree);
 
        const declarationRecorder = tree.beginUpdate(filePath);
        if (change) {
            declarationRecorder.insertLeft(change.pos,change.contents);
        }
        tree.commitUpdate(declarationRecorder); // commits the update on the tree
 
        return tree;
    };
 }