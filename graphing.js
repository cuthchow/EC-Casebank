const graph1 = document.getElementById('graph1');
const graph2 = document.getElementById('graph2');


Plotly.plot(graph1, [{
    x: [1,2,3,4,5],
    y: [1,2,4,8,16], 
    z: [2,4,6,7,10]
}], {
    margin: {t:10}
});

let trace = {
    x:[12,24,26,35, 39, 41, 44, 55, 51], 
    y: [3, 5, 7, 1, 3, 5, 10, 12, 4],
    mode: 'markers',  
    name: 'Sick Leave Days',
    marker: {
        size: [14, 30, 40, 4, 10, 10, 50, 60, 20],
        symbol: 300,
        color: 'purple'
    }
}

let trace2 = {
    x:[12,60],
    y:[3,10],
    name: 'Trend',
    mode: 'line',
    showLegend: false
}

let layout = {
    title: {text: 'Employee Compensation', font: {size: 25, color: 'white'}},
    showLegend: false,
    xaxis: {
        title: {text: 'Age at Incident'}
    }, 
    yaxis: {
        title: {text: '% Loss Awarded'}
    },
    legend: {borderwidth: 0, orientation: 'h'},
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)'
}

data = [trace, trace2];

Plotly.newPlot(graph2, data, layout);

var x1 = [];
var x2 = [];
var y1 = [];
var y2 = [];
for (var i = 1; i < 500; i++) 
{
  k = Math.random();
  x1.push(k*5);
  x2.push(k*10);
  y1.push(k);
  y2.push(k*4);
}
var trace3 = {
  x: x1,
  y: y1,
  name: 'Service Worker',
  autobinx: false, 
  histnorm: "count", 
  marker: {
    color: "rgba(255, 100, 102, 0.7)", 
     line: {
      color:  "rgba(255, 100, 102, 1)", 
      width: 1
    }
  },  
  opacity: 0.5, 
  type: "histogram", 
  xbins: {
    end: 2.8, 
    size: 0.06, 
    start: .5
  }
};
var trace4 = {
  x: x2,
  y: y2, 
  autobinx: false, 
  marker: {
          color: "rgba(100, 200, 102, 0.7)",
           line: {
            color:  "rgba(100, 200, 102, 1)", 
            width: 1
    } 
       }, 
  name: "Construction Worker", 
  opacity: 0.75, 
  type: "histogram", 
  xbins: { 
    end: 4, 
    size: 0.06, 
    start: -3.2

  }
};
var data2 = [trace3, trace4];
var layout2 = {
  bargap: 0.05, 
  bargroupgap: 0.2, 
  barmode: "overlay", 
  title: {text: "Assessed %", font: {size: 25, color :'white'}}, 
  xaxis: {title: "Percentage"}, 
  autosize: true, 
  legend: {orientation: 'h', y: -0.2},
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)'
};
Plotly.newPlot(graph1, data2, layout2);
