var app = require('./graph');

var svg = {
    style: {
        height: 250,
        width: 500,
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
        series: {
            0: series_a,
            'hello': series_b
        },
        svg: svg,
    });

a.refresh(0, '/data.json');
a.refresh('hello', '/data2.json');
