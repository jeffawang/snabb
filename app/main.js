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

truedata = [435,281,64,315,87,263,478,19,217,237,68,328,148,406,351,489,15,311,420,87,]

var container = document.getElementById('container');

function vnode(data) {
    return h('div#subcontainer', {},[
        h('button', { on: {click: function() {
            truedata.shift();
            var newnode = vnode(truedata);
            container = patch(container, newnode) }}},

            ['hi']
        ),
        mysvg(data)
    ]);
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
        this.d_min = domain[0];
        this.d_max = domain[1];
        this.r_min = range[0];
        this.r_max = range[1];
        return 0;
    }
    scale(v) {
        var ratio = (v - this.d_min) / (this.d_max - this.d_min);
        var ranged = this.r_min + ratio * (this.r_max - this.r_min);
        return ranged;
    }
}

function myline_d(data) {
    var x = new LinearScale([0, data.length-1], [0, svg_style['width']]);
    var y = new LinearScale([Math.min(...data), Math.max(...data)], [0, svg_style['height']]);
    var xys = data.map((d, i) => [x.scale(i), y.scale(d)]);
    var path = new Path();
    path.moveto(...xys[0]);
    xys.forEach((xy) => path.lineto(...xy))
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

function scale(min, max) {
    var diff = max - min;
    var sc = function(val) {
        ratio = (val - min) / (max - min);
        return ratio
    }
    return sc
}

container = patch(container, vnode(truedata));

p = patch;

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
