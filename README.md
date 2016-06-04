![](https://raw.githubusercontent.com/jagracey/RegEx-DoS/master/resources/Banner.jpg)
# :cop: :punch: RegEx Denial of Service (ReDos) Scanner
### Helping you find Regular Expressions susceptible to Denial of Service Attacks.
*Please read the [contribution guidelines](CONTRIBUTING.md) before contributing.*

<br><br>

**A screenshot of ReDoS scanning in action.**
![](https://raw.githubusercontent.com/jagracey/RegEx-DoS/master/resources/screenshot.png)


# What is Regular Expression Denial of Service?
[Wikipedia](https://en.wikipedia.org/wiki/ReDoS) and [OSWAP](https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS) have decent explainations. Basically certain RegExes can take a long time for certain inputs. Here's a real example.

```javascript
>   console.time('benchmark');
    /^(([a-z])+.)+[A-Z]([a-z])+$/.test('aaaaaaaaaaaaaaa');
    console.timeEnd('benchmark');
< benchmark: 0.060ms

>   console.time('benchmark');
    /^(([a-z])+.)+[A-Z]([a-z])+$/.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    console.timeEnd('benchmark');
< benchmark: 308.656ms

>   console.time('benchmark');
    /^(([a-z])+.)+[A-Z]([a-z])+$/.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    console.timeEnd('benchmark');
< benchmark: 3179.829ms


>   console.time('benchmark');
    /^(([a-z])+.)+[A-Z]([a-z])+$/.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    console.timeEnd('benchmark');
< benchmark: 22159.769ms  // 22 seconds

>   // You can guess what would happen if you test the RegEx with 100 repeating characters.
    console.time('benchmark');
    /^(([a-z])+.)+[A-Z]([a-z])+$/.test( 'a'.repeat(100) );
    console.timeEnd('benchmark');
< benchmark: lol.....no.

```

<br>
# Installing ReDoS

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


<br>

# Tests
*Coming Soon?*

<br><br>

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
