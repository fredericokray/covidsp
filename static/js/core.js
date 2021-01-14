/* global $, _, crossfilter, d3  */
(function(learnviz) {
    'use strict';
    learnviz.getDataFromAPI = function(resource, callback){
        d3.json(resource, function(error, data) {
            if(error){
                return callback(error);
            }
            else{
                var parseDate = d3.time.format("%Y-%m-%d").parse;
                data.forEach(function(d) {
                    d["datahora"] = parseDate(d["datahora"]);
                })
                callback(null, data)
            }
        });
    };

    learnviz.makeFilterAndDimensions = function(data){
        learnviz.filter = crossfilter(data)
        learnviz.municDim = learnviz.filter.dimension(function (o){
            return o.nome_munic;
        });
        learnviz.semeDim = learnviz.filter.dimension(function (o) {
            return o.semana_epidem;
        });
        learnviz.datahoraDim = learnviz.filter.dimension(function (o) {
            return o.datahora;
        });
    }
}(window.learnviz = window.learnviz || {}));
