var h = require('snabbdom/h').default;

/*
 * series
 *
 *      - data
 *      - color?
 *      - name
 *      - xscale
 *      - yscale
 *
 */

function view(ctrl) {
    const data = ctrl.data,
          style = ctrl.style,
          name = ctrl.name,
          scales = ctrl.scales;
    function v() {}

    return h('path', {
        style: ctrl.style,
        attrs: {
            d: data.length ? myline_d(data, scales) : '',
        }
    });
}

function myline_d(data, scales) {

    var x = scales[0];
    var y = scales[1];

    var xys = data.map((d) => [x(d[0]), y(d[1])]);

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
