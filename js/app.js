// GLOBALS

// Data sources
const mapcsv = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTEVpFkUojjr3MWNgzL8RR3vFpNVz1BPVbf3eYDxYOsgsavWVn-iz-fjcJyGy_D9VOgoyNB1PeOk8O-/pub?gid=190862641&single=true&output=csv";
const chartcsv = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTEVpFkUojjr3MWNgzL8RR3vFpNVz1BPVbf3eYDxYOsgsavWVn-iz-fjcJyGy_D9VOgoyNB1PeOk8O-/pub?gid=1461513963&single=true&output=csv";

// Colours for selected countries to highlight
var colors = {
  "World": "#616161"
};

const colprimary = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#3f51b5",
  "#2196f3",
  "#00bcd4",
  "#009688",
  "#8bc34a",
  "#ffc107",
  "#ff9800",
]; // + grey #9e9e9e
const colsecondary = [
  "#b71c1c",
  "#880e4f",
  "#4a148c",
  "#1a237e",
  "#0d47a1",
  "#006064",
  "#004d40",
  "#33691e",
  "#ff6f00",
  "#e65100"
]; // + grey #616161

// Coordinates (centroid) for countries broken down into districts in the raw data
const coords = {
  "US": { lat: 39.8, lon: -95.6 },
  "Australia": { lat: -25.7, lon: 134.5 },
  "Canada": { lat: 61.4, lon: -98.3 },
  "France": { lat: 46.2, lon: 2.2 },
  "United Kingdom": { lat: 54.1, lon: -2.9 },
  "China": { lat: 36.6, lon: 103.8 },
  "Netherlands": { lat: 52.4, lon: 4.9 }
};

// CHART PLOT CODE
// Called as function after running other plots
function plotChart() {
  Plotly.d3.csv(chartcsv, function (err, rows) {
    function unpack(rows, key) {
      return rows.map(function (row) { return row[key]; });
    }

    // Create array of countries
    var countries = Object.keys(rows[0]);
    countries.shift(); // Remove col heading from countries array

    var dates = unpack(rows, 'Country/Region');

    var oldest = dates[0];
    var newest = dates[dates.length - 1];
    var weekago = dates[dates.length - 8];

    var data = [];

    for (var i = 0; i < countries.length; i++) {
      var item = {};
      var line = {};
      item["type"] = "scatter";
      item["mode"] = "lines";
      item["name"] = countries[i];
      item["x"] = dates;
      item["y"] = unpack(rows, countries[i]);
      if (countries[i] in colors) {
        line["color"] = colors[countries[i]];
        line["width"] = 2;
      } else {
        line["color"] = "#cccccc";
        line["width"] = 1;
      };
      item["line"] = line;
      if (item["y"][item["y"].length - 1] != "" && item.name != "Uzbekistan" && item.name != "Cruise Ship") {
        data.push(item);
      }
    }

    var layout = {
      xaxis: {
        autorange: false,
        range: [weekago, newest],
        rangeselector: {
          buttons: [
            {
              count: 7,
              label: '7 days',
              step: 'day',
              stepmode: 'backward'
            },
            {
              count: 14,
              label: '14 days',
              step: 'day',
              stepmode: 'backward'
            },
            {
              count: 28,
              label: '28 days',
              step: 'day',
              stepmode: 'backward'
            },
            { step: 'all' }
          ]
        },
        rangeslider: { range: [oldest, newest] },
        type: 'date'
      },
      yaxis: {
        range: [0, 50],
        type: 'linear',
        fixedrange: true
      },
      annotations: [],
      showlegend: false,
      margin: {
        autoexpand: true,
        r: 120,
        l: 10,
        t: 10,
        b: 10
      },
    };

    // CODE TO ADD IN-LINE LABELS TO CHART

    // Get the data for the countries that need labels
    var keyval = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].name in colors) {
        keyval.push([data[i].name, parseFloat(data[i].y[data[i].y.length - 1])]);
      }
    }
    keyval.sort(function (a, b) {
      return a[1] - b[1];
    });

    // Add vertical space between the labels where needed
    keyval[0][2] = keyval[0][1];
    for (var i = 1; i < keyval.length; i++) {
      if (keyval[i][1] < keyval[i - 1][2] + 3) {
        keyval[i][2] = keyval[i - 1][2] + 3;
      } else {
        keyval[i][2] = keyval[i][1];
      }
    }

    // Add the labels to the chart
    for (var i = 0; i < keyval.length; i++) {
      var result = {
        xref: 'paper',
        x: 1,
        y: keyval[i][2],
        xanchor: 'left',
        yanchor: 'middle',
        text: keyval[i][1] + "% " + keyval[i][0],
        font: {
          size: 14,
          color: colors[keyval[i][0]],
        },
        showarrow: false
      }

      layout.annotations.push(result);
    }

    // Initiate chart plot
    Plotly.newPlot('chartdiv', data, layout, { displayModeBar: false, responsive: true });
    document.getElementById("chartload").remove();
  });
}

// PLOT CODE FOR MAP & BAR CHARTS
Plotly.d3.csv(mapcsv, function (err, rows) {
  function unpack(rows, key) {
    return rows.map(function (row) { return row[key]; });
  };

  // Remove redundant data
  rows = rows.filter(country => country.Today != "");
  rows = rows.filter(country => (country["Country/Region"] != "Cruise Ship" && country["Country/Region"] != "Diamond Princess"));
  rows.sort(function (a, b) {
    return a.Total - b.Total;
  });

  // Set chart heights
  var chartheight = (rows.length * 30) + "px";
  document.getElementById("bartotdiv").style.height = chartheight;
  document.getElementById("barratediv").style.height = chartheight;

  // Set colors
  for (var i = 0; i < 10; i++) {
    colors[rows[rows.length - i - 1]["Country/Region"]] = colprimary[i];
  }
  for (var i = 0; i < rows.length - 10; i++) {
    colprimary.push("#9e9e9e");
    colsecondary.push("#616161");
  }
  colprimary.reverse();
  colsecondary.reverse();

  var cName = unpack(rows, 'Country/Region'),
    cPerc = unpack(rows, 'Today'),
    cPercFloat = [],
    cTot = unpack(rows, 'Total'),
    cLat = unpack(rows, 'Lat'),
    cLon = unpack(rows, 'Long'),
    cSize = [],
    cCol = [],
    percArray = [],
    hoverText = [],
    scale = 6;

  for (perc in cPerc) {
    cPercFloat.push(parseFloat(cPerc[perc]));
  }

  for (var i = 0; i < cPerc.length; i++) {
    let percent = parseFloat(cPerc[i]);
    let currentSize = Math.pow(percent, 0.5) * scale;

    if (percent > 0) {
      let currentText = cName[i] + " " + cPerc[i];
      hoverText.push(currentText);
    } else {
      let currentText = "";
      hoverText.push(currentText);
    }
    cSize.push(currentSize);
    if (cName[i] in colors) {
      cCol.push(colors[cName[i]]);
    } else {
      cCol.push("#bbbbbb");
    }
    if (cName[i] in coords) {
      cLat[i] = coords[cName[i]].lat;
      cLon[i] = coords[cName[i]].lon;
    }
  }

  // Create sorted data for percent increase
  for (name in cName) {
    let perc = parseFloat(cPerc[name]);
    percArray.push([cName[name], perc, cCol[name]]);
  }
  percArray.sort((a, b) => a[1] - b[1]);

  var pName = percArray.map(item => item[0]);
  var pPerc = percArray.map(item => item[1] + '%');
  var pCol= percArray.map(item => item[2]);

  var mapdata = [{
    type: 'scattergeo',
    lat: cLat,
    lon: cLon,
    hoverinfo: 'text',
    text: hoverText,
    marker: {
      size: cSize,
      color: cCol,
      line: {
        color: 'black',
        width: 1
      },
    }
  }];

  var maplayout = {
    showlegend: false,
    geo: {
      scope: 'world',
      projection: {
        type: 'orthographic',
        rotation: { lon: 5, lat: 40 }
      },
      showland: true,
      landcolor: 'rgb(217, 217, 217)',
      subunitwidth: 1,
      countrywidth: 1,
      subunitcolor: 'rgb(255,255,255)',
      countrycolor: 'rgb(255,255,255)'
    },
    margin: {
      autoexpand: true,
      r: 10,
      l: 10,
      t: 10,
      b: 10
    }
  };

  var bartrace1 = {
    y: cName,
    x: unpack(rows, 'Yesterday'),
    name: 'Earlier deaths',
    orientation: 'h',
    marker: {
      color: colprimary,
      width: 1
    },
    type: 'bar'
  };

  var bartrace2 = {
    y: cName,
    x: unpack(rows, 'Diff'),
    name: 'Last 24 hours',
    orientation: 'h',
    type: 'bar',
    text: unpack(rows, 'Total'),
    textposition: 'outside',
    textfont: { color: colprimary },
    marker: {
      color: colsecondary,
      width: 1
    }
  };

  var bardata = [bartrace1, bartrace2];

  var percdata = [{
    y: pName,
    x: pPerc,
    name: 'Daily increase',
    orientation: 'h',
    marker: {
      color: pCol,
      width: 0
    },
    type: 'bar',
    text: pPerc,
    textposition: 'outside',
    textfont: { color: pCol }
  }];

  var barlayout = {
    xaxis: {
      autorange: false,
      range: [0, cTot[cTot.length - 1] * 1.2]
    },
    showlegend: false,
    barmode: 'stack',
    margin: {
      autoexpand: true,
      r: 10,
      l: 100,
      t: 10,
      b: 20
    }
  };

  var perclayout = {
    xaxis: {
      autorange: false,
      range: [0, Math.max(...cPercFloat) * 1.2]
    },
    showlegend: false,
    barmode: 'stack',
    margin: {
      autoexpand: true,
      r: 10,
      l: 100,
      t: 10,
      b: 20
    }
  };

  // Plot map
  Plotly.newPlot("mapdiv", mapdata, maplayout, { displayModeBar: false, responsive: true, showLink: false });
  document.getElementById("mapload").remove();

  // Plot total chart
  Plotly.newPlot('bartotdiv', bardata, barlayout, { staticPlot: true, responsive: true });
  document.getElementById("bartotload").remove();

  // Plot percent chart
  Plotly.newPlot('barratediv', percdata, perclayout, { staticPlot: true, responsive: true });
  document.getElementById("barrateload").remove();

  document.getElementsByClassName('scroller')[0].style.height = "450px";
  document.getElementsByClassName('scroller')[1].style.height = "450px";

  // Plot line chart (called as function)
  plotChart();

});
