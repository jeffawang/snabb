var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default, // attaches event listeners
  require('snabbdom/modules/attributes').default,
]);
var h = require('snabbdom/h').default; // helper function for creating vnodes

var view = require('./view');

// element: html element to mount
function app(element, env) {
    var vnode = element;

    var ctrl = {
        series: () => env.series,
        svg: env.svg,
    }

    function render() {
        vnode = patch(vnode, view(ctrl))
    }

    render();

    return {
        update: function(i, d) {
            env.series[i].data = d;
            render();
        }
    }
}

module.exports = app;
