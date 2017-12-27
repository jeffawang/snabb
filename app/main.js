var app = require('./graph');

var svg = {
    style: {
        height: 300,
        width: 1000,
        border: '1px solid #bada55'
    }
};

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
}

var a = app(container,
    {
        series: [series_a, series_b],
        svg: svg,
    });

a.refresh(0, '/data.json');
a.refresh(1, '/data2.json');
