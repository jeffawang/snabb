var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default, // attaches event listeners
  require('snabbdom/modules/attributes').default,
]);
var h = require('snabbdom/h').default; // helper function for creating vnodes

var svg_params = {
    style: {
        height: 500,
        width: 1000,
        border: '1px solid #bada55'
    }
};

var container = document.getElementById('container');

function vnode(data) {
    return h('div#subcontainer', {},[
        h('div', {}, [
            h('svg', svg_params, [
                h('circle', {attrs: {cx: 50, cy: 50, r: 40, stroke: 'green', 'stroke-width': 4, fill: 'yellow'}}),
                h('path', {
                    style: {},
                    attrs: {
                        d: myline_d(data),
                        stroke: "green",
                        'stroke-width': "3",
                        fill:"aliceblue",
                        opacity: 0.25
                    }
                })
            ]
        )])
    ]);
}

class Plot {
    constructor(params = {}, children = []) {
        this.params = params;
        this.children = children
    }
    render() {
        return h('div.plot-container', {}, [
            h('svg', this.params,
                this.children.map((c) => c.render(this.params))
             )
        ]);
    }
}

class LineGraph {
    constructor(params = {}, children = []) {
        this.data = params.data;
    }
    get scales() {
    }
    d() {
        
    }
}

function linearscale(domain, range) {
    var domain = domain.slice();
    var range = range.slice();
    function scale(x) {
        var ratio = (x - domain[0]) / (domain[1] - domain[0]);
        var ranged = range[0] + ratio * (range[1] - range[0]);
        return ranged;
    }
    scale.invert = function() {
        range.reverse();
        return scale;
    };
    return scale;
}

function linegraph(ctrl) {
    var data = ctrl.data();
    var w = ctrl.w;
    var h = ctrl.h;
    var d = ctrl.d; // data

    function lg() {}

    lg.x = linearscale(dataminmax(data, 0), [0, w]);
    lg.y = linearscale(dataminmax(data, 1), [0, h]).invert();

    return lg;
}

function myline_d(data) {
    var lg_params = {
        w: svg_params['style']['width'],
        h: svg_params['style']['height'],
        d: [[],[]],
        data: function(){return data;},
    }

    var lg = linegraph(lg_params);

    var xys = data.map((d) => [lg.x(d[0]), lg.y(d[1])]);

    var path = new Path();
    path.moveto(...xys[0]);
    xys.forEach((xy) => path.lineto(...xy));

    return path.d();
}


class LinearScale {
    constructor(domain, range) {
        // copy values, not reference
        this.domain = domain.slice();
        this.range = range.slice();
    }
    scale(v) {
        var ratio = (v - this.domain[0]) / (this.domain[1] - this.domain[0]);
        var ranged = this.range[0] + ratio * (this.range[1] - this.range[0]);
        return ranged;
    }
    invert() {
        this.range.reverse();
        return this;
    }
}

function dataminmax(data, i) {
    var first = data[0];
    var val = data.reduce(function(acc, c) {
        if (c[i] < acc[0])
            acc[0] = c[i];
        else if (c[i] > acc[1])
            acc[1] = c[i];
        return acc
    }, [first[i], first[i]]);
    return val;
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

fetch('/data.json')
    .then(response => {
        if (response.ok){
            return Promise.resolve(response);
        }
        else
            return Promise.reject(new Error('Failed to load'));
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        truedata = data;
        container = patch(container, vnode(truedata));
    })
    .catch(function(error) {
        throw error;
        //console.log(`Error: ${error.message}`);
    });
