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


var container = document.getElementById('container');

var vnode = h('div#subcontainer', {},[
        h('button', { on: {click: function() {console.log('hi')}}},
            ['hi']
        ),
        mysvg()
    ]);

function mysvg() {
    return h('div', {}, [
            h('svg', { style: svg_style }, [
                h('circle', {attrs: {cx: 50, cy: 50, r: 40, stroke: 'green', 'stroke-width': 4, fill: 'yellow'}}),
                myline(),
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

function myline() {
    return h('path', {
        style: {},
        attrs: {
            d: myline_d(),
           stroke: "green",
          'stroke-width': "3",
           fill:"none"
        }
    });
}

xstep = 10;

function myline_d() {

    var data = [
        280,134,477,201,380,477,24,222,280,262,14,145,335,195,173,116,62,190,481,428,378,90,282,483,446,419,131,340,382,410,82,19,251,424,115,382,223,60,59,94,466,116,222,81,429,192,41,380,389,129,248,101,175,459,435,369,465,164,250,491,366,72,170,375,162,322,222,218,312,45,127,295,60,479,224,249,87,181,187,415,163,234,297,24,242,161,95,15,62,366,169,183,237,342,424,291,129,473,283,415,235,415,210,421,380,82,1,322,74,285,227,70,316,130,483,249,363,1,159,135,359,81,427,118,73,475,291,114,167,480,292,335,169,223,385,337,482,74,81,499,205,125,173,67,449,89,405,249,339,279,419,13,275,280,3,422,234,492,349,372,424,17,186,96,73,17,356,14,249,482,200,364,385,353,432,400,293,227,373,487,22,255,455,307,232,280,390,407,58,373,265,94,253,445,181,204,424,304,115,496,
        ]
    var x = 0;
    var y = 0;
    var d = "M0 " + data.shift();

    var sc = scale(Math.min(...data) - 10, Math.max(...data) + 10);
    for (var i = 0; i < data.length; ++i) {
        x += 10;
        y = data.shift();
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

patch(container, vnode);

/* TODO
 *
 * - axis mapping
 * - ajax/websocket?
 *
 */
