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

function refresh(app, index, data_endpoint) {
    fetch(data_endpoint)
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
            app.update(index, data);
        })
        .catch(function(error) {
            throw error;
            //console.log(`Error: ${error.message}`);
        });
}

var rawcontainer = document.getElementById('container');
var container = patch(rawcontainer, h('div#container', [
    h('div'),
    h('div'),
]));

c = container.children;

var series_a = {
    data: [],
    style: {
        opacity: 0.25,
        stroke: 'green',
        'stroke-width': 3,
        fill: 'none',
    },
    name: 'a',
    width: svg.style.width,
    height: svg.style.height
}

var series_b = {
    data: [],
    style: {
        opacity: 0.25,
        stroke: 'red',
        'stroke-width': 3,
        fill: 'none',
    },
    name: 'a',
    width: svg.style.width,
    height: svg.style.height
}

var a = app(container.children[0],
    {
        series: [series_a, series_b],
        svg: svg,
    });

refresh(a, 0, '/data.json');
refresh(a, 1, '/data2.json');
