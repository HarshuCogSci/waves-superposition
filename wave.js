function Wave(){
  this.phaser = {};
  this.graph = {};
  this.connector = {};

  this.amp = amp_min+amp_delta*Math.random();
  this.amp = 0.1*parseInt(this.amp*10)

  this.freq = freq_min+freq_delta*Math.random();
  this.freq = 0.1*parseInt(this.freq*10);

  this.phase = 360*Math.random();
  this.phase = parseInt(this.phase);
  this.phase_degrees = this.phase;
  this.phase = this.phase*Math.PI/180;

  this.setup();
}

// ************************************************************************************************** //
// Setup

Wave.prototype.setup = function(){
  this.t = time_array;
  this.angle = numeric.add(numeric.mul(this.freq, this.t), this.phase);
  this.y = numeric.mul(this.amp, numeric.sin( this.angle ));
  this.x = numeric.mul(this.amp, numeric.cos( this.angle ));

  this.stroke = 'black';
}

// ************************************************************************************************** //
// Create Phasor

Wave.prototype.createPhasor = function(){
  this.phaser.length = d3.min([this.phaser.width, this.phaser.height]);
  this.phaser.scale = d3.scaleLinear().domain([0, 1*amp_max]).range([0, 0.5*this.phaser.length]);
  this.graph.yScale = d3.scaleLinear().domain([-1*amp_max, 1*amp_max]).range([0.5*this.phaser.length, -0.5*this.phaser.length]);

  this.phaser.cx = this.phaser.x+0.5*this.phaser.width;
  this.phaser.cy = this.phaser.y+0.5*this.phaser.height;

  this.phaser.g = d3.select('#canvas').append('g');
  this.phaser.g.attrs({ 'transform': 'translate(' +this.phaser.cx+ ',' +this.phaser.cy+ ')' });
  this.phaser.g.append('line').attrs({ x1: -0.5*this.phaser.length, y1: 0, x2: 0.5*this.phaser.length, y2: 0 }).styles({ 'stroke-width': 1, 'stroke': 'gray' });
  this.phaser.g.append('line').attrs({ y1: -0.5*this.phaser.length, x1: 0, y2: 0.5*this.phaser.length, x2: 0 }).styles({ 'stroke-width': 1, 'stroke': 'gray' });

  this.phaser.vector = this.phaser.g.append('line').attrs({ x1: 0, y1: 0, 'marker-end': "url(#arrow)" }).styles({ 'stroke-width': 2, 'stroke': this.stroke });
  this.rotatePhasor();
}

// ************************************************************************************************** //
// Rotate Phasor

Wave.prototype.rotatePhasor = function(){
  var x = this.phaser.scale(this.x[time_index]);
  var y = this.phaser.scale(this.y[time_index]);

  this.phaser.vector.attrs({ x2: x, y2: -y });
}

// ************************************************************************************************** //
// Create Graph

Wave.prototype.createGraph = function(){
  this.graph.xScale = d3.scaleLinear().domain([0,5]).range([0, this.graph.width-10]);
  // this.graph.yScale = d3.scaleLinear().domain([-6, 6]).range([0.5*this.graph.height, -0.5*this.graph.height]);

  this.graph.cx = this.graph.x+5;
  this.graph.cy = this.graph.y+0.5*this.graph.height;

  this.graph.g = d3.select('#canvas').append('g');
  this.graph.g.attrs({ 'transform': 'translate(' +this.graph.cx+ ',' +this.graph.cy+ ')' });
  this.graph.g.append('g').call( d3.axisBottom(this.graph.xScale).ticks(0) );
  this.graph.g.append('g').call( d3.axisLeft(this.graph.yScale).ticks(0) );

  this.graph.area = this.graph.g.append('path').styles({ 'stroke': this.stroke, 'stroke-width': 2, 'fill': this.stroke, 'fill-opacity': 0.5 });
  this.graph.path = this.graph.g.append('path').styles({ 'stroke': this.stroke, 'stroke-width': 2, 'fill': 'none' });

  this.updateGraph();
}

// ************************************************************************************************** //
// Update Graph

Wave.prototype.updateGraph = function(){
  if(time < displaySpan){
    var t_array = this.t.slice(0, time_index+1);
    var y_array = this.y.slice(0, time_index+1);
    var data = d3.range(t_array.length).map((d,i) => { return { x: this.graph.xScale(t_array[i]), y: this.graph.yScale(y_array[i]) } });
    this.graph.area.attrs({ d: area_gen(data) });
  } else {
    var t_array = this.t.slice(time_index+1-(displaySpan/dt), time_index+1);
    var y_array = this.y.slice(time_index+1-(displaySpan/dt), time_index+1);
    var data = d3.range(t_array.length).map((d,i) => { return { x: this.graph.xScale(t_array[i]), y: this.graph.yScale(y_array[i]) } });
    this.graph.area.attrs({ d: area_gen(data) });
  }
}

// ************************************************************************************************** //
// Create Connector

Wave.prototype.createConnector = function(){
  this.connector.g = d3.select('#canvas').append('g');
  this.connector.line = this.connector.g.append('line').styles({ 'stroke': 'gray', 'stroke-dasharray': '3,3' });

  this.updateConnector();
}

// ************************************************************************************************** //
// Update Connector

Wave.prototype.updateConnector = function(){
  var x1 = this.phaser.cx + this.phaser.scale(this.x[time_index]);
  var y1 = this.phaser.cy - this.phaser.scale(this.y[time_index]);
  var x2 = this.graph.cx + this.graph.xScale(this.t[time_index]);
  var y2 = this.graph.cy + this.graph.yScale(this.y[time_index]);

  this.connector.line.attrs({ x1: x1, y1: y1, x2: x2, y2:y2 });
}
