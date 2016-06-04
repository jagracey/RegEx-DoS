![](https://raw.githubusercontent.com/jagracey/RegEx-DoS/master/resources/Banner.jpg)
# :cop: :punch: RegEx Denial of Service (ReDos) Scanner
### Helping you find Regular Expressions susceptible to Denial of Service Attacks.
*Please read the [contribution guidelines](CONTRIBUTING.md) before contributing.*

<br><br>

![](https://raw.githubusercontent.com/jagracey/RegEx-DoS/master/resources/screenshot.png)

<br>

As usual, install with NPM.
```
npm install redos
```

You can run redos on the CLI:
```bash
# Use "Find" to run Regex-DoS for any set of JS files you want.
find . -name "*.js" -not -path "./node_modules/*" -exec redos {} \;
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


<br><br>

# Tests
*Coming Soon?*


# Contributing

See the [contribution guide](CONTRIBUTING.md) for details on how to contribute. It's probably what you expect.


# Code of Conduct

See the [Code of Conduct](CODE-OF-CONDUCT.md) for details. Basically it comes down to:
>In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and orientation.


# License

The MIT License (MIT)

Copyright (c) 2016 John Gracey

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
