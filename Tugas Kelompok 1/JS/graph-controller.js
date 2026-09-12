import { GraphBuilder } from './graph-builder.js';
import Regression from './regression.js'

const form = document.getElementById('data-input');
const canvas = document.getElementById("cartesian-graph");

const graph = new GraphBuilder(canvas, { scale: 30 });

graph.grid().axes();



form.addEventListener('submit', function(event){
    event.preventDefault();

    const x = form.elements["x-data"].value.split(",").map(Number);
    const y = form.elements["y-data"].value.split(",").map(Number);

    graph.clear().grid().axes();
    let regression = new Regression(x,y);
    let regressionResult = regression.fit()

    for (let i = 0; i < x.length; i++) {
        graph.point(x[i], y[i]);
    }

    let xMin = -15;
    let xMax = 15;

    let regressionLineStart = regressionResult[0] * xMin;
    let regressionInterceptStart = regressionResult[1];
    let regressionLineEnd = regressionResult[0] * xMax;
    let regressionInterceptEnd = regressionResult[1];

    let ypredictStart = regressionLineStart + regressionInterceptStart;
    let ypredictEnd = regressionLineEnd + regressionInterceptEnd;

    graph.line(xMin, ypredictStart, xMax, ypredictEnd);

})
