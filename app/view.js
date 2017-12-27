var h = require('snabbdom/h').default;

var series = require('./series');

// Return a vnode representing the rendered view.
function view(ctrl) {
    var _series = ctrl.series();
    var width = ctrl.svg.style.width;
    var height = ctrl.svg.style.height;

    // TODO: this could look nicer....
    var s = Object.keys(_series).map( k =>
        series(Object.assign({
            width: width,
            height: height
        }, _series[k]))
    );

    return h('div.subcontainer', {}, [
        h('div', {}, [
            h('svg', ctrl.svg, s)
        ])
    ]);
}

module.exports = view;
