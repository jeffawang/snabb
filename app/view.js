var h = require('snabbdom/h').default;

var series = require('./series');

// Return a vnode representing the rendered view.
function view(ctrl) {
    var _series = ctrl.series();
    var width = ctrl.svg.style.width;
    var height = ctrl.svg.style.height;

    // TODO: this could look nicer....
    // works for arrays or an object with keys.
    var s = Object.keys(_series).map( k => {
        var data = _series[k].data;
        if (!data.length)
            domains = [[0,1],[0,1]];
        else
            domains = [
                dataminmax(data, 0),
                dataminmax(data, 1)
            ];
        var scales = [
           linearscale(domains[0], [0, width]),
           linearscale(domains[1], [0, height]).invert()
        ]
        return series(Object.assign({
            scales: scales
        }, _series[k]))
    }
    );

    return h('div.subcontainer', {}, [
        h('div', {}, [
            h('svg', ctrl.svg, s)
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

module.exports = view;
