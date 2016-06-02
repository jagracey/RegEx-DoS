![](https://raw.githubusercontent.com/jagracey/Regex-DoS/a204c3d105f215309fee1da2eb035443f254059b/resources/Banner.jpg)
# :cop: :punch: RegEx Denial of Service (ReDos) Scanner

As usual, install with NPM.
```
npm install redos
```

You can run redos on the CLI:
```bash
# Use "Find" to run Regex-DoS for any set of JS files you want.
find . -name "*.js" -not -path "./node_modules/*" -exec node redos.js {} \;
```


Or to run as a node module:
```javascript
var redos = require('redos');

// Using a Callback
redos(" 'aaaa'.split(/a+b?c*/g); ", function(regexNodes){
  console.log( regexNodes.results() );
};


// Or Without a Callback
redos(" 'aaaa'.split(/a+b?c*/g); ").results();


// Or With Better Content to Parse
const fs      = require('fs');
const content = fs.readFileSync('./foobar.js'); // <--- Your own file Here.
redos( content ).results();

```
