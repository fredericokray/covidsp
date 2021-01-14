/* global $, _, crossfilter, d3, topojson  */
(function(learnviz) {
    'use strict';
    var mapContainer = d3.select('#map');
    var boundingRect = mapContainer.node().getBoundingClientRect();
    var width = boundingRect.width,
        height = boundingRect.height;
    var svg = mapContainer.append('svg');

    var colorScale = d3.scale.threshold()
                       .domain([1000,10000, 50000,450000])
                       .range(["#CFE3FF", "#8BBAFF", "#418FFF", "#0068FF"]);

    learnviz.initMap = function(data, map) {
        var features = map.features;
        var projection = d3.geoEquirectangular()
                           .scale(193 * 22 * (height/480))
                           .center([-20,-50])
                           .translate([3.45*width, 4.75*height])
                           .precision(0.5);
        var path = d3.geoPath().projection(projection);
        var tooltip = d3.select('#map-tooltip');

        svg.append("g")
           .attr("class", "counties")
           .selectAll('path')
           .data(features, function(d) {
                return d.properties.nome
           })
           .enter()
           .append('path')
           .attr('fill', function(d) {
                var nome_munic = d.properties.nome;
                var data_munic = data.find(d => d.nome_munic == nome_munic);
                if(data_munic) {
                    return colorScale(data_munic.casos);
                }
                else {
                    return "#FFFFFF";
                }
           })
           .attr('d', path)
           .style('stroke', 'black')
           .on('mouseenter', function(d) {
                d3.select(this).classed('active', true);
                var munic = d3.select(this).datum();
                tooltip.select('h2').text(munic.properties.nome);
                var d_munic = data.find(s => s.nome_munic == munic.properties.nome)
                var casos = d_munic.casos;
                var casos_pc = d_munic.casos_pc;
                var obitos = d_munic.obitos;
                var obitos_pc = d_munic.obitos_pc;
                tooltip.select('#casos').text('Casos: ' + casos);
                tooltip.select('#casos_pc').text('Casos por 100 mil: ' + casos_pc);
                tooltip.select('#obitos').text('Obitos: ' + obitos);
                tooltip.select('#obitos_pc').text('Obitos por 100 mil: ' + obitos_pc);
                var mouseCoords = d3.mouse(this);
                var w = parseInt(tooltip.style('width')),
                    h = parseInt(tooltip.style('height'));
                tooltip.style('top', (mouseCoords[1] - h/2)+'px');
                tooltip.style('left', (mouseCoords[0])+'px');
            })
           .on('mouseout', function(d) {
                d3.select(this).classed('active', false);
                tooltip.style('left', -9999 + 'px');
            });

            var colorLegend = d3.legend.color()
                                .labelFormat(d3.format(d3.format(",.0f")))
                                .labels(["Até 1000", "Até 10000", "Até 50000", "Até 450000"])
                                .cells(4)
                                .scale(colorScale)

            svg.append("g").attr("transform", "translate(470, 0)").call(colorLegend);
    };
}(window.learnviz = window.learnviz || {}));
