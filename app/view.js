var h = require('snabbdom/h').default;

var series = require('./series');

// Return a vnode representing the rendered view.
function view(ctrl) {
    var data = ctrl.data();
    var width = ctrl.svg.style.width;
    var height = ctrl.svg.style.height;

    var s = series({
        data: data,
        style: {},
        name: 'hello',
        width: width,
        height: height,
    });

    return h('div.subcontainer', {}, [
        h('div', {}, [
            h('svg', ctrl.svg, [
                h('circle', {attrs: {cx: 50, cy: 50, r: 40, stroke: 'green', 'stroke-width': 4, fill: 'yellow'}}),
                s,
            ])
        ])
    ]);
}

module.exports = view;
