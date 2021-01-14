/* global $, _, crossfilter, d3  */
(function(learnviz) {
    'use strict';
    learnviz.buildTable = function(data) {
        var data = data.sort(function(a, b) {
            return b.casos - a.casos;
        })
        data = data.slice(0, 30);
        var rows = d3.select("#list tbody").selectAll("tr").data(data);
        rows.enter().append("tr");
        var cells = rows.selectAll("td").data(function(d) {
            return [d.nome_munic, d.casos, d.casos_pc, d.obitos, d.obitos_pc, d.pop];
        })
        cells.enter().append("td");
        cells.text(function(d) {
            return d;
        })
    }
}(window.learnviz = window.learnviz || {}));
