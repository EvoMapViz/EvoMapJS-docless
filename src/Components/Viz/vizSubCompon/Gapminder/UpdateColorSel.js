import * as d3 from 'd3';
import clearSVG from "./utils/clearSVG";

export default function UpdateColorSel(data, meta,
                                      colorSel, 
                                      Colortype, Colorrange, Colordomain, Colorincreasing,
                                      SizeIncreasing,
                                      setJustClicked, allNames,
                                      sizeSel, time, OpacityRange, OpacityDomain, OpacityExponent){

console.log("Color selector Update");

const svg = d3.select(".svg-content-responsive");

const circ = svg.selectAll(".circle-firm");
const lab = svg.selectAll(".firmLabel");
const trace = svg.selectAll(".trace");

const selRank = 'rank-' + sizeSel;

// Update on-click event so setJustClicked and thereby traces added later on have the right cluster (d[colorSel]) associated with them.
const zoom_group = d3.selectAll(".zoom_group_g");
circ.on("click", function (event, d) {
  let tthis = d3.select(this);
  let cur_count = parseInt(zoom_group.attr("data-high-count"));

  if (tthis.attr("data-highlighted") === "true") {
    tthis.attr("data-highlighted", "false");
    setJustClicked(["dehigh", d.name, tthis, d[colorSel], d[selRank]]);
    zoom_group.attr("data-high-count", cur_count - 1);
  } else {
    tthis.attr("data-highlighted", "true");
    setJustClicked(["high", d.name, tthis, d[colorSel], d[selRank]]);
    zoom_group.attr("data-high-count", cur_count + 1);
  }

  if (zoom_group.attr("data-high-count") === "0") {
    clearSVG(
      svg,
      allNames,
      data,
      sizeSel,
      time,
      OpacityRange,
      OpacityDomain,
      OpacityExponent
    );
    zoom_group.attr("data-high-count", 0);
  }
});

// Update colors and attributes
if (Colortype === "discrete") {
  const color = d3
    .scaleOrdinal() // https://stackoverflow.com/questions/20847161/how-can-i-generate-as-many-colors-as-i-want-using-d3
    .domain(Colordomain)
    .range(Colorrange);

  circ
    //.attr("data-colgroup", (d) => d[colorSel])
    .transition()
    .duration(700)
    .attr("fill", (d) => color(d[colorSel]));

  //lab.attr("data-colgroup", (d) => d[colorSel]);
  //trace.attr("data-colgroup", (d) => d[colorSel]);
}

if (Colortype === "continuous") {
  
  const color = d3
    .scaleThreshold() // Requires similar update in ColorLegend/Draw.js and Draw.js
    .domain(Colordomain)
    .range(Colorrange);

  if (Colorincreasing === "true") {
    circ
      //attr("data-colgroup", (d) => d[colorSel])
      .transition()
      .duration(700)
      .attr("fill", (d) => color(d[colorSel]));
  }
  if (Colorincreasing === "false") {

    circ
      //.attr("data-colgroup", (d) => d[colorSel])
      .transition()
      .duration(700)
      .attr("fill", (d) => color(d[colorSel]));
  }

  //lab.attr("data-colgroup", (d) => d[colorSel]);
  //trace.attr("data-colgroup", (d) => d[colorSel]);
}

}