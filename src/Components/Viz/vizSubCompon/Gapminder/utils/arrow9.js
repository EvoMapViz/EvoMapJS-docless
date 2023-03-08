export default function arrow9(scale) { //https://observablehq.com/d/7759e56ba89ced03
    
    let id = "d3-arrow-1";

    function draw(context, id, scale, refX, refY, d){
      let defs = context.select("defs");
      if (defs.empty()) {
        defs = context.append("defs");
      }
    
     defs.append("marker")
          .attr("id", id)
          .attr("refX", (refX - 4) * scale )
          .attr("refY", refY * scale)
          .attr("markerWidth", refX + 3 * scale)
          .attr("markerHeight", refY * 3 * scale)
          .attr("markerUnits", "userSpaceOnUse")
          .attr("orient", "auto-start-reverse")
        .append("path")
          .attr("d", d)
        .append('polygon') // Very weird, but appending an extra dummy element (does *not* have to be polygon) 
                           // is the only way I found to make the marker not get crushed on zoom
    }

    function arrow(context){
      draw(
        context,
        id,
        scale,
        18,
        5,
        `M 0 0 L ${18 * scale} ${5 * scale} L 0 ${10 * scale} Z`
      );
    }
    
    arrow.id = function(string){ return arguments.length ? (id = string, arrow) : id; }
    
    return arrow;
  }