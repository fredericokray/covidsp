/* global $, _, crossfilter, d3  */
(function(learnviz) {
    'use strict';
    const urlParams = new URLSearchParams(window.location.search);
    const nome_munic = urlParams.get('nome_munic');
    var query;
    if(nome_munic == null) {
        query = "http://localhost:5000/api/covidcasestotal";
    }
    else {
        query = "http://localhost:5000/api/covidcases?nome_munic=" + nome_munic;
    }
    var query_laststate = "http://localhost:5000/api/covidcases_laststate";
    var q = queue();
    q.defer(learnviz.getDataFromAPI, query);
    q.defer(learnviz.getDataFromAPI, query_laststate);
    q.defer(d3.json, "static/data/sp_munic.geojson");
    q.await(ready);

    function ready(error, data, data_laststate, map) {
        if(error){
            return console.warn(error);
        }
        learnviz.makeFilterAndDimensions(data);
        learnviz.updateChart(data);
        learnviz.updateChart2(data);
        learnviz.updateChart3(data);
        learnviz.updateChart4(data);
        learnviz.initMap(data_laststate, map);
        learnviz.buildTable(data_laststate);
    }
}(window.learnviz = window.learnviz || {}));
