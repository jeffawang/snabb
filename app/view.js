var h = require('snabbdom/h').default;

// Return a vnode representing the rendered view.
function view(ctrl) {
    var data = ctrl.data();
    var width = ctrl.svg.style.width;
    var height = ctrl.svg.style.height;
    return h('div.subcontainer', {}, [
        h('div', {}, [
            h('svg', ctrl.svg, [
                h('circle', {attrs: {cx: 50, cy: 50, r: 40, stroke: 'green', 'stroke-width': 4, fill: 'yellow'}}),
                h('path', {
                    style: {},
                    attrs: {
                        d: data.length ? myline_d(data, width, height) : "",
                        stroke: "green",
                        'stroke-width': "3",
                        fill:"aliceblue",
                        opacity: 0.25
                    }
                }),
            ])
        ])
    ]);
}

function linearscale(domain, range) {
    var domain = domain.slice();
    var range = range.slice();
    function scale(x) {
        const ratio = (x - domain[0]) / (domain[1] - domain[0]);
              ranged = range[0] + ratio * (range[1] - range[0]);
        return ranged;
    }
    scale.invert = function() {
        range.reverse();
        return scale;
    };
    scale.domain = function() { return domain; }
    scale.range = function() { return range; }
    return scale;
}

function linegraph(params) {
    const data = params.data;

    function lg() {}

    lg.x = linearscale(dataminmax(data, 0), [0, params.width]);
    lg.y = linearscale(dataminmax(data, 1), [0, params.height]).invert();

    console.log(lg.x.domain(), lg.x.range());
    console.log(lg.y.domain(), lg.y.range());

    return lg;
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

function myline_d(data, width, height) {
    var lg_params = {
        width: width,
        height: height,
        data: data,
    }

    console.log(lg_params);

    var lg = linegraph(lg_params);

    var xys = data.map((d) => [lg.x(d[0]), lg.y(d[1])]);

    var p = path();
    p.moveto(...xys[0]);
    xys.forEach((xy) => p.lineto(...xy));

    return p.d();
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

function path() {
    var commands = [];

    function p() {};

    // returns a string suitable for use as the 'd' path attr
    p.d = function() { return commands.join(" "); };

    // generates and stores commands
    p.lineto = function(x, y) { return commands.push(`L ${x} ${y}`); };
    p.moveto = function(x, y) { return commands.push(`M ${x} ${y}`); };
    p.closepath = function() { return commands.push('Z'); };

    return p;
}

module.exports = view;
