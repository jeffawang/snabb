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

var svg = {
    style: {
        height: 250,
        width: 500,
        border: '1px solid #bada55'
    }
};

var container = document.getElementById('container');
var a = app(container,
    {
        data: [],
        svg: svg,
    });

// element: html element to mount
function app(element, env) {
    var vnode = element;

    var ctrl = {
        data: () => env.data,
        svg: env.svg,
    }

    function render() {
        vnode = patch(vnode, view(ctrl))
    }

    render();

    return {
        update: function(d) {
            env.data = d;
            render();
        }
    }
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
        truedata = data;
        //container = patch(container, vnode(truedata));
        a.update(data);
    })
    .catch(function(error) {
        throw error;
        //console.log(`Error: ${error.message}`);
    });
