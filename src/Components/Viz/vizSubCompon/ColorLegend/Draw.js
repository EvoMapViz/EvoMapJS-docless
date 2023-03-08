import * as d3 from 'd3';
import truncate from 'utils/truncate.js'

export default function Draw(data, meta,
                                    colorSel,
                                    Colortype, Colorrange, Colorbins, Colordomain, Colorincreasing,
                                    setColgroup,
                                    refcur,
                                    winWidth){

console.log('DRAWING color legend')

const colorSelMeta = meta.filter((d) => d.name === colorSel);
const yGap = 55;
const increasing = Colorincreasing;

if (Colortype === "discrete") {
  var options = data.map((d) => d[colorSel]);
  var uniqueOptions = [...new Set(options)];
  var height = 30 + yGap * uniqueOptions.length;
}

if (Colortype === "continuous") {
  var unit = "";
  if (typeof colorSelMeta[0].unit !== "undefined") {
    unit = colorSelMeta[0].unit;
  }
  var height = 30 + yGap * Colorbins.length;
}

var width = 500;
if (winWidth < 768) {
  width = 1000;
}
const svg = d3
  .select(refcur)
  .style("width", "100%")
  .style("height", "70%")
  .classed("color-legend-svg-container", true)
  .append("svg")
  .attr("viewBox", "0 0 " + width + " " + height)
  .attr("class", "color-legend-svg-content-responsive")
  .attr("cursor", "pointer");

//                
/* Click functions */
//

svg.on("click", function (event) {
  if (
    event.target.className.baseVal === "color-legend-svg-content-responsive"
  ) {
    // if click is not a legend item
    setColgroup("Show All");
    svg
      .selectAll(".color_legend")
      .attr("opacity", 1)
      .attr("data-clicked", false);
  }
});

// Discrete

function clickDiscrete(event) {
  let tthis = svg.selectAll(".color_legend").filter(function (e) {
    return d3.select(this).attr("data-name") === event;
  });
  if (tthis.attr("data-clicked") === "false") {
    svg
      .selectAll(".color_legend")
      .attr("opacity", 0.25)
      .attr("data-clicked", false);
    tthis.attr("opacity", 1);
    setColgroup(event);
    tthis.attr("data-clicked", true);
  } else if (tthis.attr("data-clicked") === "true") {
    svg
      .selectAll(".color_legend")
      .attr("opacity", 1)
      .attr("data-clicked", false);
    setColgroup("Show All");
  }
}

// Continuous

function clickContinuous(event) {
  let tthis = svg.selectAll(".color_legend").filter(function (e) {
    return d3.select(this).attr("data-name") === event.toString();
  });

  if (tthis.attr("data-clicked") === "false") {
    svg
      .selectAll(".color_legend")
      .attr("opacity", 0.25)
      .attr("data-clicked", false);
    tthis.attr("opacity", 1);
    setColgroup(tthis.attr("data-bounds"));
    tthis.attr("data-clicked", true);
  } else if (tthis.attr("data-clicked") === "true") {
    svg
      .selectAll(".color_legend")
      .attr("opacity", 1)
      .attr("data-clicked", false);
    setColgroup("Show All");
  }
}

//
/* Construct legend and attach click event */
//

// Discrete

if (Colortype === "discrete") {
  uniqueOptions.sort((a, b) => d3.ascending(a[colorSel], b[colorSel]));

  var color = d3
    .scaleOrdinal() // https://stackoverflow.com/questions/20847161/how-can-i-generate-as-many-colors-as-i-want-using-d3
    .domain(Colordomain)
    .range(Colorrange);
  // http://jnnnnn.github.io/category-colors-constrained.html

  var xDrift = 180;
  if (winWidth < 768) {
    xDrift = xDrift + 250;
  }

  svg
    .selectAll("color-legend")
    .data(uniqueOptions)
    .enter()
    .append("circle")
    .attr("cursor", "pointer")
    .attr("cx", xDrift)
    .attr("cy", function (d, i) {
      return 15 + i * yGap;
    })
    .attr("r", 7)
    .style("fill", function (d) {
      return color(d);
    })
    .classed("color_legend", "true")
    .attr("data-name", (d) => d)
    .attr("data-clicked", "false")
    .attr("cursor", "pointer")
    .on("click", function (d, event) {
      clickDiscrete(event, d);
    });

  svg
    .selectAll("color-legend-labels")
    .data(uniqueOptions)
    .enter()
    .append("text")
    .attr("cursor", "pointer")
    .attr("x", xDrift + 20)
    .attr("y", function (d, i) {
      return 15 + i * yGap;
    })
    .text(function (d) {
      return truncate(d, 25);
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .classed("color_legend", "true")
    .attr("data-name", (d) => d)
    .attr("data-clicked", "false")
    .attr("cursor", "pointer")
    .on("click", function (d, event) {
      clickDiscrete(event, d);
    });
}

// Continous

if (Colortype === "continuous") {
  const min_data = d3.min(data, d => d[colorSel])
  const max_data = d3.max(data, d => d[colorSel])
  const colbins = JSON.parse(JSON.stringify(Colorbins)) // `[...x]` is simple way to create a deep-copy, as opposed to `const colbins = Colorbins` which would create a shallow-copy.

  const low = Math.min(min_data, colbins[0])
  const high = Math.max(max_data, colbins[colbins.length - 1])

  if(colbins[0] !== low){colbins.unshift(Math.floor(low))}
  if(colbins.slice(-1) !== high){colbins[colbins.length] = Math.ceil(high)}

  const bins_plus_min = colbins.slice(0,-1)
  const extended_bins = colbins

  // !! scaleThreshold for *continuous* (here), and scaleOrdinal for *discrete* (above) => must be definied within each "if"
  const color = d3.scaleThreshold()
              .domain(Colordomain)
              .range(Colorrange);

  let xDrift = 180;

  if (increasing === "true") {
    svg
      .selectAll("color-legend")
      .data(bins_plus_min)
      .enter()
      .append("circle")
      .attr("cursor", "pointer")
      .attr("cx", xDrift)
      .attr("cy", function (d, i) {
        return 15 + i * yGap;
      })
      .attr("r", 7)
      .style("fill", function (d) {
        return color(d);
      })
      .classed("color_legend", "true")
      .attr("data-bounds", function (d, i) {
        return [extended_bins[i], extended_bins[i + 1]];
      })
      .attr("data-name", (d) => d)
      .attr("data-clicked", "false")
      .attr("cursor", "pointer")
      .on("click", function (d, event) {
        clickContinuous(event);
      });

    svg
      .selectAll("color-legend-labels")
      .data(bins_plus_min)
      .enter()
      .append("text")
      .attr("x", xDrift + 20)
      .attr("y", function (d, i) {
        return 15 + i * yGap;
      })
      .text(function (d, i) {
        return extended_bins[i] + unit + " to " + extended_bins[i + 1] + unit;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .classed("color_legend", "true")
      .attr("data-bounds", function (d, i) {
        return [extended_bins[i], extended_bins[i + 1]];
      })
      .attr("data-name", (d) => d)
      .attr("data-clicked", "false")
      .attr("cursor", "pointer")
      .on("click", function (d, event) {
        clickContinuous(event);
      });
  }
  if (increasing === "false") {
    svg
      .selectAll("color-legend")
      .data(bins_plus_min)
      .enter()
      .append("circle")
      .attr("cx", xDrift)
      .attr("cy", function (d, i) {
        return 15 + i * yGap;
      })
      .attr("r", 7)
      .style("fill", function (d) {
        return color(d);
      })
      .classed("color_legend", "true")
      .attr("data-bounds", function (d, i) {
        return [extended_bins[i], extended_bins[i + 1]];
      })
      .attr("data-name", (d) => d)
      .attr("data-clicked", "false")
      .attr("cursor", "pointer")
      .on("click", function (d, event) {
        clickContinuous(event);
      });

    svg
      .selectAll("color-legend-labels")
      .data(bins_plus_min)
      .enter()
      .append("text")
      .attr("x", xDrift + 20)
      .attr("y", function (d, i) {
        return 15 + i * yGap;
      })
      .text(function (d, i) {
        return extended_bins[i] + unit + " to " + extended_bins[i + 1] + unit;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .classed("color_legend", "true")
      .attr("data-bounds", function (d, i) {
        return [extended_bins[i], extended_bins[i + 1]];
      })
      .attr("data-name", (d) => d)
      .attr("data-clicked", "false")
      .attr("cursor", "pointer")
      .on("click", function (d, event) {
        clickContinuous(event);
      });
  }
}

}