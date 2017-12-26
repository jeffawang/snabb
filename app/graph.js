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

    function update(i, d) {
        env.series[i].data = d;
        render();
    }

    function refresh(i, endpoint) {
            fetch(endpoint)
                .then(response => {
                    if (response.ok){
                        return Promise.resolve(response);
                    }
                    else
                        return Promise.reject(new Error('Failed to load'));
                })
                .then(response => response.json())
                .then(data => {
                    truedata = data;
                    //container = patch(container, vnode(truedata));
                    update(i, data);
                })
                .catch(function(error) {
                    throw error;
                    //console.log(`Error: ${error.message}`);
                });
        }

    render();

    return {
        update: update,
        refresh: refresh
    }
}

module.exports = app;
