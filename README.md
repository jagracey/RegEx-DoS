# Regex-DoS
:cop: :punch: RegEx Denial of Service (ReDos) Scanner

As usual, install with NPM.
```
npm install redos
```

You can run redos on the CLI:
```bash
# Use "Find" to run Regex-DoS for any set of JS files you want.
find . -name "*.js" -not -path "./node_modules/*" -exec node app.js {} \;
```


Or to run as a node module:
```javascript
var redos = require('redos');

// Using a Callback
redos(" 'aaaa'.split(/a+b?c*/g); ", function(rNodes){
  console.log( rNodes.results() );
};


// Or without a Callback
redos(" 'aaaa'.split(/a+b?c*/g); ").results();


// Or with some better content to parse
const fs      = require('fs');
const content = fs.readFileSync(file);
redos( content ).results();

```
