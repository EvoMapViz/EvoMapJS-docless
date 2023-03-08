import * as d3 from 'd3';

export default function svgButton(zoom) { //https://bl.ocks.org/pbogden/7487564

  var dispatch = d3.dispatch('press', 'release');

  var padding = 10,
      radius = 10

  function my(selection) {
    selection.each(function(d) {
      var g = d3.select(this)
          .attr('transform', 'translate(' + d.x + ',' + d.y + ')');

      var text = g.append('text').text(d.label);
      var defs = g.append('defs');
      var bbox = text.node().getBBox();
      var rect = g.insert('rect', 'text')
          .attr('id',d => 'button-' + d.type)
          .attr("x", bbox.x - padding)
          .attr("y", bbox.y - padding)
          .attr("width", bbox.width + 2 * padding)
          .attr("height", bbox.height + 2 * padding)
          .attr('rx', radius)
          .attr('ry', radius)
          .on('mouseover', activate)
          .on('mouseout', deactivate)
          .on('click', function(){clicked(d.type)})
    });
  }

  function activate() {
    d3.select(this).attr('class','button-mousedover')
  }

  function deactivate() {
    d3.select(this).attr('class','button-mousedout')
  }

  function clicked(type) {

    if(type === 'in'){

      d3.select("#button-"+type)
        .transition()
        .duration(150)
        .attr('class','button-clicked')
        .transition()
        .duration(150)
        .attr('class','button-baseline')

      d3.select('.back-fore').transition().call(zoom.scaleBy, 1.5)
    }
    if(type === 'out'){
      d3.select("#button-"+type)
      .transition()
      .duration(150)
      .attr('class','button-clicked')
      .transition()
      .duration(150)
      .attr('class','button-baseline')

      d3.select('.back-fore').transition().call(zoom.scaleBy, 0.6)
    }

    if(type === 'reset'){
      d3.select("#button-"+type)
      .transition()
      .duration(150)
      .attr('class','button-clicked')
      .transition()
      .duration(150)
      .attr('class','button-baseline')
      
      d3.select('.back-fore').transition().call(zoom.transform, d3.zoomIdentity);
    }

  }

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}