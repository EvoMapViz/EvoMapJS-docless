import * as d3 from 'd3';

export default function Draw(varHeader, varLabel, instance, refcur, winWidth){

    var width = 500;
    if(winWidth < 768){width = 1000}
    const height = 30;
        
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
            .append('svg')
            // Responsive SVG needs these 2 attributes and no width and height attr.
            .attr("preserveAspectRatio", "xMinYMin meet") 
            .attr("viewBox", "0 0 " + width + " " + height)
            .classed('legend-title-svg-responsive-container_' + instance, true)

svg
.append("text")
.attr('x', '50%')
.attr('y', '70%')
.attr('text-anchor', 'middle')
.text(varHeader + ' ' + varLabel)
.attr('font-size', '26px')
.classed('legend-title', true)

}