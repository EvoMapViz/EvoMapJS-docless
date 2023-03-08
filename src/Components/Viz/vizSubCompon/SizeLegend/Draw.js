import * as d3 from 'd3';

export default function Draw(data, meta,
                                    sizeSel,
                                    refcur,
                                    winWidth){

    const sizeSelMeta = meta.filter(d => d.name === sizeSel)
    var locExponent = 1
    if(typeof sizeSelMeta[0].scale_exponent !== 'undefined'){locExponent = Number(sizeSelMeta[0].scale_exponent)}
    var maxSize = 50
    if(typeof sizeSelMeta[0].scale_maxSize !== 'undefined'){maxSize = Number(sizeSelMeta[0].scale_maxSize)}
    var minSize = 1
    if(typeof sizeSelMeta[0].scale_minSize !== 'undefined'){minSize = Number(sizeSelMeta[0].scale_minSize)}
    var increasing = 'true'
    if(typeof sizeSelMeta[0].scale_increasing !== 'undefined'){increasing = sizeSelMeta[0].scale_increasing}
    const dom = d3.extent(data, d => d[sizeSel])
    var bins = [Math.round(d3.quantile(data.map(d => d[sizeSel]), 0.1)),
                Math.round(d3.quantile(data.map(d => d[sizeSel]), 0.5)),
                Math.round(d3.quantile(data.map(d => d[sizeSel]), 1))
                ]
    if(typeof sizeSelMeta[0].size_legend_bins !== 'undefined'){bins = sizeSelMeta[0].size_legend_bins}
    var unit = ""
    if(typeof sizeSelMeta[0].unit !== 'undefined'){unit = sizeSelMeta[0].unit}
    var extra_line_length = 10
    if(typeof sizeSelMeta[0].legend_dline_extral !== 'undefined'){extra_line_length = sizeSelMeta[0].legend_dline_extral}
    
    const size = d3.scalePow()
                .exponent(locExponent)
                .domain(dom)
                .range([minSize, maxSize])

    const max_data = dom[1]
    var width = 2*size(max_data);
/*     if(winWidth < 768){width = 1000} */
    const height = 2*size(max_data);
        
// Responsive SVG, see 
// https://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js or
// https://stackoverflow.com/questions/9400615/whats-the-best-way-to-make-a-d3-js-visualisation-layout-responsive

// Need to match responsive framework of main viz for circle sizes to match (even after responsive resizes)
// This requires the ratio of js-width and html width of the container to be the same for legend and main viz (since responsive svg adapts width to size of container).
// For example, suppose the main viz and legend container have the same pixel width.
// Then if main viz has js-width of 1000 and css-width of 50%, the ratio is 2000.
// Then if legend has js-width of 200, its css-width must be 10% so the ratio is also 2000.
// In short, the ratio of js-width and css-width (the latter being a percentage) is what determines the svg scale.
// !! If the css containers do NOT have the same width (e.g., one is a size 6-out-of-12 and the other a size 3-out-of-12 column, this must be taken into account and compensated for)
// Then, easiest way is to set both at 100% width, and let the ratio of container sizes to js-width be equal.
    const svg = d3.select(refcur)
                .style('width', '100%')
                .style('height', '15%')
                .classed("legend-svg-container", true)
                .append('svg')
                .style('height', '100%' )
                .style('width', '100%' )
                // Responsive SVG needs these 2 attributes and no width and height attr.
/*                 .attr("preserveAspectRatio", "xMinYMin meet")  */
                .attr("viewBox", "0 0 " + width + " " + height)
                // Class to make it responsive.
                .attr("class", 'legend-svg-content-responsive')

// Compute distances and sizes
 
let fs = 18
var valuesAndTextPad = bins.map(function(d){
    var canvas = document.createElement('canvas'); // Compute width of label text, see https://stackoverflow.com/questions/16478836/measuring-length-of-string-in-pixel-in-javascript
    var ctx = canvas.getContext("2d");
    ctx.font = fs + "px BlinkMacSystemFont"; 
        var textWidth = ctx.measureText(d.toLocaleString() + " " + unit).width;
        if(increasing === "false"){ 
                return ({"label": d, 
                        "ordered_val": dom[1] - d, 
                        "segSize": size(d), 
                        "pad": textWidth })       
        } else {
                return ({"label": d, 
                        "ordered_val": d, 
                        "segSize": size(bins[bins.length -1]) - size(d), 
                        "pad": textWidth }) 
        }
})

var xDrift = 0

const extremes = valuesAndTextPad.map(function(d, i){
        if(unit.length === 0){
                return xDrift + 
                        Math.pow(-1,i) * (size(d.ordered_val) + d.segSize +  extra_line_length) +
                        - (1-((1+Math.pow(-1,i))/2)) * (d.pad - 5) // Only affects labels on the left
                } else {
                        return xDrift + 
                        Math.pow(-1,i) * (size(d.ordered_val) + d.segSize +  extra_line_length) +
                        - (1-((1+Math.pow(-1,i))/2)) * (d.pad) // Only affects labels on the left
                }
})
const minX = Math.min(...extremes)
const Xwidth = Math.max(...extremes) - minX

const paddings = valuesAndTextPad.map(d => d.pad)
const max_pad = d3.max(paddings)
var top_radius = 0
if(increasing === 'true'){
        top_radius = size(valuesAndTextPad[valuesAndTextPad.length-1]['ordered_val'])
} else {
        top_radius = size(valuesAndTextPad[0]['ordered_val'])
}

/* if(winWidth < 768){xDrift = xDrift + 250} */
/* size(max_data) + segSize + max_pad */ // Value of xDrift to have legend right on the left of the ViewBox
/* if(winWidth < 768){width = 1000} */
svg.attr("viewBox", minX + ' ' +  (2*size(max_data) - 2*top_radius) + ' ' + (Xwidth+max_pad) + ' ' +  (2*size(max_data) + top_radius)) 

// Add legend: circles

svg
.selectAll(".size_legend")
.remove()

const yDrift = 10

svg
.selectAll("size_legend")
.data(valuesAndTextPad)
.enter()
.append("circle")
.attr("cy", d => 2*size(max_data) - size(d.ordered_val) + yDrift)
.attr("cx", xDrift)
.attr("r", function(d){ return size(d.ordered_val) })
.style("fill", "none")
.attr("stroke", "black")
.attr('class', 'size_legend')

// Add legend: segments
svg
.selectAll("size_legend")
.data(valuesAndTextPad)
.enter()
.append("line")
.attr('x1', (d, i) =>  xDrift + Math.pow(-1,i) * size(d.ordered_val) )
.attr('x2', (d, i) =>  xDrift + 
                        Math.pow(-1,i) * (size(d.ordered_val) + d.segSize + extra_line_length) 
                        )
.attr('y1', d => 2*size(max_data) - size(d.ordered_val) + yDrift)
.attr('y2', d => 2*size(max_data) - size(d.ordered_val) + yDrift)
.attr('stroke', 'black')
.style('stroke-dasharray', ('2,2'))
.attr('class', 'size_legend')

// Add legend: labels
svg
.selectAll("size_legend")
.data(valuesAndTextPad)
.enter()
.append("text")
.attr('x', function(d, i){
        if(unit.length === 0){
                return xDrift + 
                        Math.pow(-1,i) * (size(d.ordered_val) + d.segSize +  extra_line_length) +
                        - (1-((1+Math.pow(-1,i))/2)) * (d.pad - 5) // Only affects labels on the left
                } else {
                        return xDrift + 
                        Math.pow(-1,i) * (size(d.ordered_val) + d.segSize +  extra_line_length) +
                        - (1-((1+Math.pow(-1,i))/2)) * (d.pad) // Only affects labels on the left
                }
})
.attr('y', function(d){ return 2*size(max_data) - size(d.ordered_val) + yDrift} )
.text( function(d){ 
        if(unit.length === 0){
        return d.label.toLocaleString()
        } else {
        return d.label.toLocaleString() + " " + unit
        }
 } )
.style("font-size", fs + 'px')
.attr('alignment-baseline', 'middle')
.attr('class', 'size_legend')

}