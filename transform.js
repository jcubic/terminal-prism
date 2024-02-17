#!/usr/bin/env node

import fs from 'fs';
import css from 'css';
import util from 'util';
import Color from 'colorjs.io';

const input= fs.readFileSync(0, 'utf-8');
const ast = css.parse(input);

ast.stylesheet.rules = ast.stylesheet.rules.map(rule => {
    if (rule.selectors) {
        if (rule.selectors.some(selector => selector.match(/pre|code/))) {
            return null;
        }
        const selectors = rule.selectors.flatMap(selector => {
            if (selector.match(/token/)) {
                return [`.terminal ${selector}`, `.cmd ${selector}`, `.terminal-external ${selector}`];
            }
            return selector;
        });
        const declarations = rule.declarations.filter(function(declaration) {
            return declaration.property !== 'background';
        }).map(function(declaration) {
            if (declaration.property === 'color') {
                const property = '--color';
                const color = new Color(declaration.value);
                color.alpha = 0.997
                const value = color.toString({commas: true, format: 'rgba'});
                return {...declaration, property, value};
            }
            return declaration;
        });
        return {...rule, declarations, selectors};
    }
    if (rule.type === 'comment' && rule.comment.match(/prism.js/)) {
        return rule;
    }
    return null;
}).filter(Boolean);

if (false) {
    console.log(util.inspect(ast, false, null, true));
}

process.stdout.write(css.stringify(ast) + "\n");
