import * as d3 from "d3";

export default function UpdateTime(
  data, arrows, isArrows,
  XDomain,
  YDomain,
  XRange,
  YRange,
  time,
  valueSizes,
  sizeSel,
  colorSel,
  SizeExponent,
  SizeRange,
  SizeDomain,
  SizeIncreasing,
  FontRange,
  FontDomain,
  FontExponent,
  OpacityRange,
  OpacityDomain,
  OpacityExponent,
  Colortype,
  Colorrange,
  Colorbins,
  Colordomain,
  trans_d3
) {
  console.log("Update Main Circles");

  const zoom_group = d3.select(".zoom_group_g");
  const svg = d3.select(".svg-content-responsive");
  const label_mult_nudge = 0.12; // label nudge away from circles
  const arrow_text_dodge = 0.5; // nudge text away from arrow

  /* Time Label */
  svg.selectAll(".timeLabel").text(time);

  /* Scales */

  const x = d3.scaleLinear().domain(XDomain).range(XRange);
  const y = d3
    .scaleLinear()
    .domain(YDomain) //-4 leaves room for time label
    .range(YRange);

  var color = []
  if (Colortype === "discrete") {
    color = d3
      .scaleOrdinal() // https://stackoverflow.com/questions/20847161/how-can-i-generate-as-many-colors-as-i-want-using-d3
      .domain(Colordomain)
      .range(Colorrange);
  }
  if (Colortype === "continuous") {
    color = d3
      .scaleThreshold() // Requires similar update in ColorLegend/Draw.js and Draw.js
      .domain(Colordomain)
      .range(Colorrange);
  }
  const max_data = d3.max(data, (d) => d[colorSel]);
  const size = d3
    .scalePow()
    .exponent(SizeExponent)
    .domain(SizeDomain)
    .range(SizeRange);
  const fontScale = d3
    .scalePow()
    .exponent(FontExponent)
    .domain(FontDomain)
    .range(FontRange);
  const opacityScale = d3
    .scalePow()
    .exponent(OpacityExponent)
    .domain(OpacityDomain)
    .range(OpacityRange);

  /*  */
  /* Update Firm circles */
  /*  */

  /* Transition circles with non-missing data */

  const f_circ = zoom_group.selectAll(".circle-firm").data(
    data.filter((d) => d.time === time),
    (d) => d.name // d=>d.name is animation key
  );

  if (Colortype === "discrete") {
    f_circ
    .transition()
    .duration(200)
    .ease(d3.easeLinear)
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
    .attr("r", function (d) {
      if (valueSizes === "true") {
        if (SizeIncreasing === "true") {
          return size(d[sizeSel]) / trans_d3.k;
        } else {
          return size(SizeDomain[1] - d[sizeSel]) / trans_d3.k;
        }
      } else {
        return 4 / trans_d3.k;
      }
    })
    .transition()
    .duration(1) // adding an extra transition guarantees the circles are only visible after they have moved
    .ease(d3.easeLinear)
    .attr('visibility', 'visible')
  }

  if(Colortype === "continuous") {
    f_circ
    .transition()
    .duration(200)
    .ease(d3.easeLinear)
    .attr("cx", (d) => x(d.x))
    .attr("cy", (d) => y(d.y))
    .attr("r", function (d) {
      if (valueSizes === "true") {
        if (SizeIncreasing === "true") {
          return size(d[sizeSel]) / trans_d3.k;
        } else {
          return size(SizeDomain[1] - d[sizeSel]) / trans_d3.k;
        }
      } else {
        return 4 / trans_d3.k;
      }
    })
    .attr("fill", function (d) {
      if (SizeIncreasing === "true") {
        return color(d[colorSel]);
      }
      if (SizeIncreasing === "false") {
        return color(max_data - d[colorSel]);
      }
    })
    .transition()
    .duration(1) // adding an extra transition guarantees the circles are only visible after they have moved
    .ease(d3.easeLinear)
    .attr('visibility', 'visible')
  }
   

  /* Hide circles with missing data */

  zoom_group
    .selectAll(".circle-firm")
    .filter((d) => d.time !== time)
    .attr("visibility", "hidden");

  /*  */
  /* Update labels */
  /*  */

   /* Transition labels with non-missing data */

  let labels = zoom_group.selectAll(".firmLabel").data(
    data.filter((d) => d.time === time),
    (d) => d.name
  ); // d=>d.name is animation key

  labels
    .transition()
    .duration(200)
    .ease(d3.easeLinear)
    .attr("x", function (d) {
      if (valueSizes === "true") {
        if (SizeIncreasing === "true") {
          return x(
            d.x + label_mult_nudge * (Math.sqrt(size(d[sizeSel])) / trans_d3.k)
          );
        } else {
          return x(
            d.x +
              label_mult_nudge *
                (Math.sqrt(size(SizeDomain[1] - d[sizeSel])) / trans_d3.k)
          );
        }
      } else {
        return x(d.x + (label_mult_nudge * Math.sqrt(4)) / trans_d3.k);
      }
    }) // adjust for size of circle
    .attr("y", function (d) {
      if (valueSizes === "true") {
        if (SizeIncreasing === "true") {
          return y(
            d.y + label_mult_nudge * (Math.sqrt(size(d[sizeSel])) / trans_d3.k)
          );
        } else {
          return y(
            d.y +
              label_mult_nudge *
                (Math.sqrt(size(SizeDomain[1] - d[sizeSel])) / trans_d3.k)
          );
        }
      } else {
        return y(d.y + label_mult_nudge * (Math.sqrt(4) / trans_d3.k));
      }
    })
    .attr("font-size", function (d) {
      if (valueSizes === "true") {
        if (SizeIncreasing === "true") {
          return fontScale(d[sizeSel]) / trans_d3.k;
        } else {
          return fontScale(SizeDomain[1] - d[sizeSel]) / trans_d3.k;
        }
      } else {
        return 12 / trans_d3.k;
      }
    })
    .attr("opacity", function (d) {
      if (valueSizes === "true") {
        if (SizeIncreasing === "true") {
          return opacityScale(d[sizeSel]);
        } else {
          return opacityScale(SizeDomain[1] - d[sizeSel]);
        }
      } else {
        return 0.7;
      }
    })
    .transition()
    .duration(1) // adding an extra transition guarantees the labels are only visible after they have moved.
                 // Using on.('end') method instead (https://stackoverflow.com/a/10692220/14095529) creates severe lags in the time animation 
    .attr('visibility', 'visible')
                                                              
/* Hide labels with missing data */

zoom_group
  .selectAll(".firmLabel")
  .filter((d) => d.time !== time)
  .attr("visibility", "hidden");
  

if(isArrows){  
  /*  */
  /* Update explainer arrows */
  /*  */

  let arrow_nodes = zoom_group
                .selectAll(".explainer-arrow")
                .data(
                  arrows.filter((d) => d.time === time),
                  (d) => d.name
                ); // d=>d.name is animation key

  arrow_nodes
    .transition()
    .duration(200)
    .ease(d3.easeLinear)
    .attr("x1", x(0))
    .attr("y1", y(0))
    .attr("x2", (d) => x(d.x))
    .attr("y2", (d) => y(d.y))
    .attr("stroke-width", 2/trans_d3.k)

  /*  */
  /* Update explainer text */
  /*  */

  let arrow_text_nodes = zoom_group
    .selectAll(".arrow-text")
    .data(
      arrows.filter((d) => d.time === time),
      (d) => d.name
    ); // d=>d.name is animation key

  arrow_text_nodes
    .transition()
    .duration(200)
    .ease(d3.easeLinear)
    .attr('x', function(d){
      const alpha = Math.abs(d.y/d.x)
      return( 
        x(
          d.x + Math.sign(d.x) * ( 
            (arrow_text_dodge/trans_d3.k)/(Math.sqrt(1 + alpha**2)) 
            )
        )
      )
    })
    .attr('y', function(d){
      const alpha = Math.abs(d.y/d.x)
      return( 
        y(
          d.y + Math.sign(d.y) * ( 
            (arrow_text_dodge/trans_d3.k) * (alpha/(Math.sqrt(1 + alpha**2))) 
            )
        )
      )
    })
    .attr('font-size', 12/trans_d3.k)
}


}
