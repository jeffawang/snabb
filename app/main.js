var app = require('./graph');

var svg = {
    style: {
        height: 250,
        width: 500,
        border: '1px solid #bada55'
    }
};

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

var container = document.getElementById('container');

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

var a = app(container,
    {
        series: [series_a, series_b],
        svg: svg,
    });

refresh(a, 0, '/data.json');
refresh(a, 1, '/data2.json');
