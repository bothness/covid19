# How fast is COVID-19 spreading?
This is the code repository for this [very simple data visualization dashboard](https://bothness.github.io/covid19/) (one map, one line chart) intended to give an idea of the present rate of spread of COVID-19 in different countries based on the latest [data collected by Johns Hopkins CSSE](https://github.com/CSSEGISandData/COVID-19/).

The percentages in the visuals represent a 7-day rolling average of the daily % increase in reported COVID-19 related deaths in each country. Countries with relatively fewer deaths to date are not (yet) included in the visuals.

### How was it made?
The data is automatically processed from the source by a Google spreadsheet (CSV feeds available from the [map](https://docs.google.com/spreadsheets/d/e/2PACX-1vTEVpFkUojjr3MWNgzL8RR3vFpNVz1BPVbf3eYDxYOsgsavWVn-iz-fjcJyGy_D9VOgoyNB1PeOk8O-/pub?gid=190862641&single=true&output=csv) and [chart](https://docs.google.com/spreadsheets/d/e/2PACX-1vTEVpFkUojjr3MWNgzL8RR3vFpNVz1BPVbf3eYDxYOsgsavWVn-iz-fjcJyGy_D9VOgoyNB1PeOk8O-/pub?gid=1461513963&single=true&output=csv)).

The map and line chart are coded using [Plot.ly](https://plot.ly/javascript/), a library built on top of [D3.js](https://d3js.org/). The mobile-responsive layout makes use of [Bootstrap](https://getbootstrap.com/).

### Can I use the code?
Yes, you don't even need to give credit. This code was written by Ahmad Barclay, and is shared under an Unlicense (no rights reserved, no warranty). Please note that I cannot promise that the [underlying Google spreadsheet](https://docs.google.com/spreadsheets/d/1eOB2Ag1mCTnQNzP_QYE4OIkRNw_0KBr9idXIlGzTB0A/edit?usp=sharing) will continue to run as intended on an indefinite basis. You'll probably want to make a copy of it and set up your own instance (or feed the data a different way).
