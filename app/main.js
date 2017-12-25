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
 height : '500',
 width  : '1000',
 border : '1px solid #bada55'
}

truedata = [435,281,64,315,87,263,478,19,217,237,68,328,148,406,351,489,15,311,420,87,]

var container = document.getElementById('container');

function vnode(data) {
    return h('div#subcontainer', {},[
        h('button', { on: {click: function() {
            truedata.shift();
            var newnode = vnode(truedata);
            console.log(newnode);
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

function myline(data) {
    return h('path', {
        style: {},
        attrs: {
            d: myline_d(data),
           stroke: "green",
          'stroke-width': "3",
           fill:"none"
        }
    });
}

xstep = 10;

function myline_d(data) {

    var x = 0;
    var y = 0;
    var d = "M0 " + data[0];

    var sc = scale(Math.min(...data) - 10, Math.max(...data) + 10);
    for (var i = 1; i < data.length; ++i) {
        x += 10;
        y = data[i];
        d += ['', 'L', x, svg_style['height'] * sc(y)].join(" ");
    }
    return d;
}

function scale(min, max) {
    var diff = max - min
    console.log(diff);
    var sc = function(val) {
        ratio = (val - min) / (max - min);
        return ratio
    }
    return sc
}

console.log(Date.now());

container = patch(container, vnode(truedata));

/* TODO
 *
 * - axis mapping
 * - ajax/websocket?
 *
 */

p = patch
