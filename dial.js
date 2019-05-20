function Dial(){
  this.knobCenter = {};
	this.minAngle = -0.8*Math.PI;
	this.maxAngle = 0.8*Math.PI;
	this.valueShown = true;
  this.changeActive = false;
  this.dragValues = {};
}

// ************************************************************************************************** //
// Setup

Dial.prototype.setup = function(params){
  this.min = params.min;
  this.max = params.max;
  this.step = params.step;

  this.svgID = params.svg;

  this.symbol = params.symbol;
  this.color = params.color;
  this.unit = params.unit;

  this.cx = params.cx;
  this.cy = params.cy;
  this.size = params.size;
  this.radius = 0.5*this.size;

  this.active = params.active;
  this.dispatch = d3.dispatch("start", "drag", "end");

  this.arc = d3.arc().innerRadius(this.radius).outerRadius(1.13*this.radius);

  this.angle_to_value = d3.scaleLinear().domain([this.minAngle, this.maxAngle]).range([this.min, this.max]);
  this.dragScale = d3.scaleLinear().domain([0, 4*this.radius]).range([0, this.max-this.min]);
}

// ************************************************************************************************** //
// Create

Dial.prototype.create = function(){
  this.svg = d3.select('#'+this.svgID);
  this.g = this.svg.append('g').attrs({ 'transform': 'translate(' +this.cx+ ',' +this.cy+ ')' }).styles({  });

  this.symbol = this.g.append('text').attrs({ y: -0.4*this.radius }).styles({"font-size": 0.8*this.radius, 'dominant-baseline': 'middle', 'text-anchor': 'middle'}).styles({ 'fill': '#555' }).text(this.symbol);
  this.valueText = this.g.append('text').attrs({ y: 0.3*this.radius }).styles({"font-size": 0.6*this.radius, 'dominant-baseline': 'middle', 'text-anchor': 'middle'}).styles({ 'fill': '#AAA' });

  this.circle = this.g.append('circle').attrs({ r: this.radius }).styles({ fill: 'white', "fill-opacity": 0, "cursor": "col-resize" });

  this.arc_1 = this.g.append('path').styles({ fill: this.color });
  this.arc_2 = this.g.append('path').styles({ fill: this.color, 'fill-opacity': 0.6 });;
  this.knob = this.g.append('circle').attrs({ r: 0.15*this.radius }).styles({ "stroke": this.color, "stroke-width": 3, "fill": "white" });

  if(this.active){ this.createEvents(); }
}

// ************************************************************************************************** //
// Create Events

Dial.prototype.createEvents = function(){
  this.g.data([this]).call(d3.drag()
    .on("start", function(d){ d.dragStart(d3.event);  })
    .on("drag", function(d){ d.dragDrag(d3.event);  })
    .on("end", function(d){ d.dragEnd(d3.event);  })
  )
}

// ************************************************************************************************** //
// Update

Dial.prototype.update = function(value){
  this.value = value;
  this.angle = this.angle_to_value.invert(value);

  this.arc.startAngle(-0.8*Math.PI).endAngle(this.angle);
  this.arc_1.attr("d", this.arc);

  this.arc.startAngle(this.angle).endAngle(0.8*Math.PI);
  this.arc_2.attr("d", this.arc);

  this.knobCenter.x = 1.05*this.radius * Math.sin(this.angle);
  this.knobCenter.y = -1.05*this.radius * Math.cos(this.angle);
  this.knob.attrs({ cx: this.knobCenter.x, cy: this.knobCenter.y });

  this.valueText.text( parseFloat(this.value.toFixed(1)) );
}

// ************************************************************************************************** //
// Drag Events

Dial.prototype.dragStart = function(event){
  this.dragValues.startX = event.x;
  this.dragValues.startY = event.y;
  this.dragValues.initialValue = this.value;
  this.dispatch.call("start", this, { value: this.value });
}

Dial.prototype.dragDrag = function(event){
  var temp = this.dragValues.initialValue + this.dragScale(event.x-this.dragValues.startX);
  if(temp < this.min){ temp = this.min; }
  if(temp > this.max){ temp = this.max; }

  temp = this.step*Math.round(temp/this.step);
  this.dispatch.call("drag", this, { value: temp });
}

Dial.prototype.dragEnd = function(event){
  this.dispatch.call("end", this, { value: this.value });
}