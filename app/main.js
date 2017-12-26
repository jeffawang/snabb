var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default, // attaches event listeners
  require('snabbdom/modules/attributes').default,
]);
var h = require('snabbdom/h').default; // helper function for creating vnodes

svg_style = {
 height : 500,
 width  : 1000,
 border : '1px solid #bada55'
}

rawdata = [435,281,64,315,87,263,478,19,217,237,68,328,148,406,351,489,15,311,420,87,]
truedata = rawdata.map((d,i) => [i, d]);

var container = document.getElementById('container');

function vnode(data) {
    return h('div#subcontainer', {},[
        h('button', { on: {click: buttonclick}}, 'hi' ),
        mysvg(data)
    ]);
}

function buttonclick() {
    truedata.shift();
    container = patch(container, vnode(truedata));
}

function mysvg(data) {
    return h('div', {}, [
            h('svg', { style: svg_style }, [
                h('circle', {attrs: {cx: 50, cy: 50, r: 40, stroke: 'green', 'stroke-width': 4, fill: 'yellow'}}),
                myline(data),
            ]
        )])
}

function myline(data) {
    return h('path', {
        style: {},
        attrs: {
            d: myline_d(data),
           stroke: "green",
          'stroke-width': "3",
           fill:"aliceblue",
           opacity: 0.25
        }
    });
}

xstep = 10;

class LinearScale {
    constructor(domain, range) {
        this.domain = domain;
        this.range = range;
        return 0;
    }
    scale(v) {
        var d_min = this.domain[0];
        var d_max = this.domain[1];
        var r_min = this.range[0];
        var r_max = this.range[1];
        var ratio = (v - d_min) / (d_max - d_min);
        var ranged = r_min + ratio * (r_max - r_min);
        return ranged;
    }
}

function dataminmax(data) {
    var val = data.reduce(function(acc, c) {
        acc[0] = Math.min(c[0], acc[0]);
        acc[1] = Math.max(c[1], acc[1]);
        return acc
    }, data[0]);
    console.log(val);
    return val
}

function myline_d(data) {
    var x = new LinearScale([0, data.length-1], [0, svg_style['width']]);
    var minmax = dataminmax(data);
    var y = new LinearScale([minmax[0], minmax[1]], [0, svg_style['height']]);


    console.log(x.domain, x.range);
    console.log(y.domain, y.range);
    var xys = data.map((d) => [x.scale(d[0]), y.scale(d[1])]);

    var path = new Path();
    path.moveto(...xys[0]);
    xys.forEach((xy) => path.lineto(...xy));

    return path.d();
}

/*
 * M = moveto
 * L = lineto
 * H = horizontal lineto
 * V = vertical lineto
 * C = curveto
 * S = smooth curveto
 * Q = quadratic Bézier curve
 * T = smooth quadratic Bézier curveto
 * A = elliptical Arc
 * Z = closepath
 */

class Path {
    constructor() {
        this.commands = [];
    }

    // returns a string suitable for use as the 'd' path attr
    d() { return this.commands.join(" "); }

    // generates and stores commands
    lineto(x, y) { return this.commands.push(`L ${x} ${y}`); }
    moveto(x, y) { return this.commands.push(`M ${x} ${y}`); }
    closepath() { return this.commands.push('Z'); }
}

container = patch(container, vnode(truedata));

fetch('/data.json')
    .then(response => {
        if (response.ok)
            return Promise.resolve(response);
        else
            return Promise.reject(new Error('Failed to load'));
    })
    .then(response => response.json())
    //.then(data => console.log(data))
    .catch(function(error) {
        console.log(`Error: ${error.message}`);
    });
