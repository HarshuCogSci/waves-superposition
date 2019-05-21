function SuperposedWave(wave_1, wave_2){
  this.wave_1 = wave_1;
  this.wave_2 = wave_2;
  this.t = time_array;

  this.stroke = 'black';
  this.area_gen = d3.area().x((d) => { return d.x }).y0((d) => { return d.baseline }).y1((d) => { return d.y });

  this.phaser = {};
  this.graph = {};
  this.connector = {};

  this.setup();
}

// ************************************************************************************************** //
// Setup

SuperposedWave.prototype.setup = function(){
  this.y = numeric.add(wave_1.y, wave_2.y);
  this.x = numeric.add(wave_1.x, wave_2.x);

  this.amp = numeric.sqrt(  numeric.add(numeric.mul(this.x, this.x), numeric.mul(this.y, this.y)) );
  this.angle = numeric.atan2( numeric.div(numeric.y, numeric.x) );
}

// ************************************************************************************************** //
// Create Phasor

SuperposedWave.prototype.createPhasor = function(){
  this.phaser.length = d3.min([this.phaser.width, this.phaser.height]);
  this.phaser.scale = d3.scaleLinear().domain([0, 2*amp_max]).range([0, 0.5*this.phaser.length]);
  this.graph.yScale = d3.scaleLinear().domain([-2*amp_max, 2*amp_max]).range([0.5*this.phaser.length, -0.5*this.phaser.length]);

  this.phaser.cx = this.phaser.x+0.5*this.phaser.width;
  this.phaser.cy = this.phaser.y+0.5*this.phaser.height;

  this.phaser.g = d3.select('#canvas').append('g');
  this.phaser.g.attrs({ 'transform': 'translate(' +this.phaser.cx+ ',' +this.phaser.cy+ ')' });
  this.phaser.g.append('line').attrs({ x1: -0.5*this.phaser.length, y1: 0, x2: 0.5*this.phaser.length, y2: 0 }).styles({ 'stroke-width': 1, 'stroke': 'gray' });
  this.phaser.g.append('line').attrs({ y1: -0.5*this.phaser.length, x1: 0, y2: 0.5*this.phaser.length, x2: 0 }).styles({ 'stroke-width': 1, 'stroke': 'gray' });

  this.phaser.vector = this.phaser.g.append('line').attrs({ x1: 0, y1: 0, 'marker-end': "url(#arrow)" }).styles({ 'stroke-width': 2, 'stroke': this.stroke });
  this.phaser.wave1_vector = this.phaser.g.append('line').attrs({ x1: 0, y1: 0, 'marker-end': "url(#arrow)" }).styles({ 'stroke-width': 2, 'stroke': this.wave_1.stroke });
  this.phaser.wave2_vector = this.phaser.g.append('line').attrs({ x1: 0, y1: 0, 'marker-end': "url(#arrow)" }).styles({ 'stroke-width': 2, 'stroke': this.wave_2.stroke });

  this.phaser.circle = this.phaser.g.append('circle').attrs({ cx: 0, cy: 0 }).styles({ 'stroke': this.stroke, 'fill': 'none' });
  this.phaser.circle_1 = this.phaser.g.append('circle').attrs({ cx: 0, cy: 0 }).styles({ 'stroke': this.wave_1.stroke, 'fill': 'none' });
  this.phaser.circle_2 = this.phaser.g.append('circle').attrs({ cx: 0, cy: 0 }).styles({ 'stroke': this.wave_2.stroke, 'fill': 'none' });
}

// ************************************************************************************************** //
// Rotate Phasor

SuperposedWave.prototype.rotatePhasor = function(time_index){
  var x2 = this.phaser.scale(this.x[time_index]);
  var y2 = this.phaser.scale(this.y[time_index]);
  this.phaser.vector.attrs({ x2: x2, y2: -y2 });

  var x1 = this.phaser.scale(this.wave_1.x[time_index]);
  var y1 = this.phaser.scale(this.wave_1.y[time_index]);
  this.phaser.wave1_vector.attrs({ x2: x1, y2: -y1 });

  this.phaser.wave2_vector.attrs({ x1: x1, y1: -y1, x2: x2, y2: -y2 });

  var r = Math.sqrt(x2*x2 + y2*y2);
  this.phaser.circle.attrs({ r: r });
  this.phaser.circle_1.attrs({ r: this.phaser.scale(this.wave_1.amp) })
  this.phaser.circle_2.attrs({ cx: x1, cy: -y1, r: this.phaser.scale(this.wave_2.amp) })

  if(toggleSuperposedView == false){
    this.phaser.circle.styles({ 'display': 'none' });
    this.phaser.circle_1.styles({ 'display': null });
    this.phaser.circle_2.styles({ 'display': null });
  } else {
    this.phaser.circle.styles({ 'display': null });
    this.phaser.circle_1.styles({ 'display': 'none' });
    this.phaser.circle_2.styles({ 'display': 'none' });
  }
}

// ************************************************************************************************** //
// Create Graph

SuperposedWave.prototype.createGraph = function(){
  this.graph.cx = this.graph.x+5;
  this.graph.cy = this.graph.y+0.5*this.graph.height;

  this.graph.g = d3.select('#canvas').append('g');
  this.graph.g.attrs({ 'transform': 'translate(' +this.graph.cx+ ',' +this.graph.cy+ ')' });
  this.graph.xAxis = this.graph.g.append('g');
  this.graph.yAxis = this.graph.g.append('g');

  this.graph.path = this.graph.g.append('path').styles({ 'stroke': this.stroke, 'stroke-width': 2, 'fill': 'none' });
  this.graph.wave1_path = this.graph.g.append('path');
  this.graph.wave2_path = this.graph.g.append('path');

  this.graph.area = this.graph.g.append('path').styles({ 'stroke': this.stroke, 'stroke-width': 2, 'fill': this.stroke, 'fill-opacity': 0.5 });
  this.graph.wave1_area = this.graph.g.append('path').styles({ 'stroke': 'none', 'fill': this.wave_1.stroke, 'opacity': 0.5 });
  this.graph.wave2_area = this.graph.g.append('path').styles({ 'stroke': 'none', 'fill': this.wave_2.stroke, 'opacity': 0.4 });
}

// ************************************************************************************************** //
// Update Graph

SuperposedWave.prototype.updateGraph = function(start_index, end_index, start_time){
  this.graph.xScale = d3.scaleLinear().domain([start_time,start_time+displaySpan]).range([0, this.graph.width-10]);
  this.graph.xAxis.call( d3.axisBottom(this.graph.xScale).ticks(2) );
  this.graph.yAxis.call( d3.axisLeft(this.graph.yScale).ticks(2) );

  // this.graph.wave1_area.attrs({ d: null });
  // this.graph.wave2_area.attrs({ d: null });
  // this.graph.area.attrs({ d: null });
  // this.graph.path.attrs({ d: null });

  var t_array = this.t.slice(start_index, end_index);

  if(toggleSuperposedView == false){
    this.graph.wave1_area.styles({ display: null });
    this.graph.wave2_area.styles({ display: null });
    this.graph.area.styles({ display: 'none' });

    var y_array = this.wave_1.y.slice(start_index, end_index);
    var data = d3.range(t_array.length).map((d,i) => { return { x: this.graph.xScale(t_array[i]), y: this.graph.yScale(y_array[i]) } });
    this.graph.wave1_area.attrs({ d: area_gen(data) });

    var y_array = this.y.slice(start_index, end_index);
    var baseline_array = this.wave_1.y.slice(start_index, end_index);
    var data = d3.range(t_array.length).map((d,i) => { return { x: this.graph.xScale(t_array[i]), y: this.graph.yScale(y_array[i]), baseline: this.graph.yScale(baseline_array[i]) } });
    this.graph.wave2_area.attrs({ d: this.area_gen(data) });

    this.graph.path.attrs({ d: line_gen(data) });
  } else {
    this.graph.wave1_area.styles({ display: 'none' });
    this.graph.wave2_area.styles({ display: 'none' });
    this.graph.area.styles({ display: null });

    var y_array = this.y.slice(start_index, end_index);
    var data = d3.range(t_array.length).map((d,i) => { return { x: this.graph.xScale(t_array[i]), y: this.graph.yScale(y_array[i]) } });
    this.graph.path.attrs({ d: line_gen(data) });
    this.graph.area.attrs({ d: area_gen(data) });
  }

}

// ************************************************************************************************** //
// Create Connector

SuperposedWave.prototype.createConnector = function(){
  this.connector.g = d3.select('#canvas').append('g');
  this.connector.line = this.connector.g.append('line').styles({ 'stroke': 'gray', 'stroke-dasharray': '3,3' });
}

// ************************************************************************************************** //
// Update Connector

SuperposedWave.prototype.updateConnector = function(time_index){
  var x1 = this.phaser.cx + this.phaser.scale(this.x[time_index]);
  var y1 = this.phaser.cy - this.phaser.scale(this.y[time_index]);
  var x2 = this.graph.cx + this.graph.xScale(this.t[time_index]);
  var y2 = this.graph.cy + this.graph.yScale(this.y[time_index]);

  this.connector.line.attrs({ x1: x1, y1: y1, x2: x2, y2:y2 });
}
