#!/usr/bin/env node
'use strict';


const fs      = require('fs');
const chalk   = require('chalk');
const esprima = require('esprima');
const safeReg    = require('safe-regex');


function traverse(node, work) {
  work(node);
  for (let key in node) {
    if (node.hasOwnProperty(key)) {
        let child = node[key];
        if (typeof child === 'object' && child !== null) {
          if (Array.isArray(child))
            child.forEach(node => traverse(node, work) );
          else
            traverse(child, work);
        }
    }
  }
}


const parse = function(content, cb){
  const regexNodes = new RegexNodes();
  const ast = esprima.parse( content, {
    sourceType: 'module',
    loc: true
  });

  traverse( ast, function(node) {
    if (node.regex && node.regex.pattern)
      regexNodes.add( new Node(node) );
  });

  if ( typeof cb === 'function')
    cb(regexNodes);
  else
    return regexNodes;
};


const utility = {
  rPad: function(str, n, char, max){
    return str + Array( Math.max(n - str.length, 0)).slice(0,max).join(' ');
  },
  lPad: function(str, n, char, max){
    return Array( Math.max(n - str.length, 0)).slice(0,max).join(' ') + str;
  },
  trimShebang: function(text) {
    return text.toString().replace( /^#!([^\r\n]+)/ , function(_, captured) {
      return "/* #!"+ captured +' */';
    });
  }
};


const RegexNodes = function(){
  const self = this;
  const nodes = [];

  this.get = i => nodes[i];
  this.add = node => nodes.push(node);
  this.results = () => nodes.map( n=>n.getData() );

  // Not important, simply gets the max string lenght of the pattern for formatting output. not really used.
  this.maxPatternLength = function(){
    return nodes.reduce((max,n)=> Math.max(max,n.pattern().length), 0);
  }
  this.printAll = function(){
    nodes.map(n=>console.log(n.format()) );
  };
};


const Node = function(node){
  // Since Nodes are static, there isn't too much of a point adding functions,
  // but it does make formatting strings cleaner.
  const safe  = safeReg(node.regex.pattern);
  const color = safe ? chalk.green: chalk.red;
  const pattern = node.regex.pattern; // Redundant, but cleaner...

  const colorPattern = () => color(pattern);
  this.pattern       = () => pattern;
  this.getData       = () =>({ safe, pattern, loc: node.loc });

  this.formatLine = function(){
    const start = node.loc.start;
    const end   = node.loc.end;
    return 'Line[' + start.line +':'+ start.column +'->'+ end.line +':'+ end.column+']';
  };

  this.toString = function(){
    return  chalk.gray( this.formatLine() ) +'  '+ colorPattern();
  };
  this.format = function(){
    return  chalk.gray( utility.lPad( this.formatLine(),34) ) +'  '+ colorPattern();
  }
};


  // Do if running directly from CLI.
if (require.main === module) {

  if (process.argv.length !== 3){
    console.error('Redos CLI command requires a JavaScript filename as the only parameter.');
    process.exit(1);
  }

  const regNodes = new RegexNodes();
  const file    = process.argv[2];
  let content;

  try{
    content = utility.trimShebang( fs.readFileSync(file) );
  }
  catch(e){
    console.error('Redos encountered an error when trying to read from file: '+file);
    console.error(e);
    process.exit(1);
  }
  
  parse(content, function(regNodes){
    console.log( chalk.blue('Processing:'), chalk.white(file));
    regNodes.printAll();
  });

}


module.exports = parse;
