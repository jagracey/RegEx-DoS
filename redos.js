#!/usr/bin/env node


const fs = require('fs');
const chalk = require('chalk');
const esprima = require('esprima');
const safeReg = require('safe-regex');


const utility = {
  rPad(str, n, char, max) {
    return str + Array(Math.max(n - str.length, 0)).slice(0, max).join(' ');
  },
  lPad(str, n, char, max) {
    return Array(Math.max(n - str.length, 0)).slice(0, max).join(' ') + str;
  },
  trimShebang(text) {
    return text.toString().replace(/^#!([^\r\n]+)/, (_, captured) =>
       `/* #!${captured} */`
    );
  },
};


function Node(pattern, loc) {
  const safe = safeReg(pattern);
  const color = safe ? chalk.green : chalk.red;

  const colorPattern = color(pattern);
  this.pattern = pattern;
  this.data = { safe, pattern };

  this.formatLine = function () {
    const start = loc.start;
    const end = loc.end;
    return `Line[${start.line}:${start.column}->${end.line}:${end.column}]`;
  };

  this.toString = function () {
    return `${chalk.gray(this.formatLine())}  ${colorPattern}`;
  };
  this.format = function () {
    return `${chalk.gray(utility.lPad(this.formatLine(), 34))}  ${colorPattern}`;
  };
}


function RegexNodes() {
  const nodes = [];

  this.get = i => nodes[i];
  this.add = node => nodes.push(node);
  this.results = () => nodes.map(n => n.data);

  /* Not important. It simply gets the maximum string length of the pattern
   * for formatting output. Not really used.
   */
  this.maxPatternLength = function () {
    return nodes
      .map(n => n.pattern.length)
      .reduce((max, n) => Math.max(max, n), 0);
  };
  this.printAll = function () {
    nodes
      .map(n => n.format())
      .forEach(str => console.log(str));
  };
}


function traverse(node, work) {
  work(node);
  for (const key in node) {
    if (!node.hasOwnProperty(key)) continue;
    const child = node[key];
    if (typeof child !== 'object' || child === null) continue;
    if (Array.isArray(child)) {
      child.forEach(item => traverse(item, work));
    } else {
      traverse(child, work);
    }
  }
}


/* eslint-disable consistent-return*/
function parse(content, cb) {
  const regexNodes = new RegexNodes();
  const ast = esprima.parse(content, {
    sourceType: 'module',
    loc: true,
  });

  traverse(ast, (node) => {
    if (node.regex && node.regex.pattern) {
      regexNodes.add(new Node(node.regex.pattern, node.loc));
    } else if (
      node.type === 'CallExpression' &&
      node.callee.type === 'MemberExpression' &&
      node.callee.property.type === 'Identifier' &&
      (
        node.callee.property.name === 'match' ||
        node.callee.property.name === 'search'
      ) &&
      node.arguments.length === 1 &&
      node.arguments[0].type === 'Literal'
    ) {
      // Match function calls like foo.match("bar") or foo.search("bar")
      const stringRegex = node.arguments[0];
      regexNodes.add(new Node(stringRegex.value, stringRegex.loc));
    } else if (
      (
        node.type === 'CallExpression' ||
        node.type === 'NewExpression'
      ) &&
      node.callee.type === 'Identifier' &&
      node.callee.name === 'RegExp' &&
      node.arguments.length > 0 &&
      node.arguments[0].type === 'Literal'
    ) {
      // Match RegExp("foo")
      const stringRegex = node.arguments[0];
      regexNodes.add(new Node(stringRegex.value, stringRegex.loc));
    }
  });

  if (typeof cb === 'function') {
    cb(regexNodes);
  } else {
    return regexNodes;
  }
}
/* eslint-enable consistent-return*/


// Do if running directly from CLI.
if (require.main === module) {
  if (process.argv.length !== 3) {
    console.error('Redos CLI command requires a JavaScript filename as the only parameter.');
    process.exit(1);
  }

  const file = process.argv[2];
  let content;

  try {
    content = utility.trimShebang(fs.readFileSync(file));
  } catch (e) {
    console.error(`Redos encountered an error when trying to read from file: ${file}`);
    console.error(e);
    process.exit(1);
  }

  parse(content, (regNodes) => {
    console.log(chalk.blue('Processing:'), chalk.white(file));
    regNodes.printAll();
  });
}


module.exports = parse;
