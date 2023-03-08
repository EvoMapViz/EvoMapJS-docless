import * as d3 from 'd3';

export default function Update(varHeader, varLabel, instance, winWidth){

const svg = d3.select('.legend-title-svg-responsive-container_' + instance )

svg
.selectAll('text')
.remove()

var width = 500;
if(winWidth < 768){width = 1000}
const height = 30;

svg
.attr("viewBox", "0 0 " + width + " " + height)
.append("text")
.attr('x', '50%')
.attr('y', '70%')
.attr('text-anchor', 'middle')
.text(varHeader + ' ' + varLabel)
.attr('font-size', '26px')
.classed('legend-title', true)

}