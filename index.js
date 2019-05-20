// ************************************************************************************************** //
// Document Ready

$('document').ready(() => {
  $('[data-toggle="popover"]').popover();
  setup(); update(); simulate();
})

// ************************************************************************************************** //
// Parameters

var width = 1366, height = 768;

var timeSpan = 20, displaySpan = 5, dt = 0.01;
var display_index = Math.floor(displaySpan/dt), start_index = 0, end_index = 0;
var start_time = 0, end_time = 0;
var time_array = d3.range(0,timeSpan+0.5*dt,dt), time = 0, time_index = 0;
var amp_min = 1, amp_delta = 4, amp_max = amp_min+amp_delta;
var freq_min = 1, freq_delta = 9, freq_max = freq_min+freq_delta;

var line_gen = d3.line().x((d) => { return d.x }).y((d) => { return d.y });
var area_gen = d3.area().x((d) => { return d.x }).y0(0).y1((d) => { return d.y });

var startTime = 0, simulationRunning = false;
var timeDial;

var toggleSuperposedView = true;

// ************************************************************************************************** //
// Setup

function setup(){
  wave_1 = new Wave();
  wave_2 = new Wave();
  wave_3 = new SuperposedWave(wave_1, wave_2);

  wave_1.stroke = 'steelblue';

  wave_1.phaser.x = 0;
  wave_1.phaser.y = 0;
  wave_1.phaser.width = 0.3*width;
  wave_1.phaser.height = 0.25*height;
  wave_1.createPhasor();

  wave_1.graph.x = 0.3*width;
  wave_1.graph.y = 0;
  wave_1.graph.width = 0.5*width;
  wave_1.graph.height = 0.25*height;
  wave_1.createGraph();

  wave_1.createConnector();

  /**************************************/

  wave_2.stroke = 'orange';

  wave_2.phaser.x = 0;
  wave_2.phaser.y = 0.25*height;
  wave_2.phaser.width = 0.3*width;
  wave_2.phaser.height = 0.25*height;
  wave_2.createPhasor();

  wave_2.graph.x = 0.3*width;
  wave_2.graph.y = 0.25*height;
  wave_2.graph.width = 0.5*width;
  wave_2.graph.height = 0.25*height;
  wave_2.createGraph();

  wave_2.createConnector();

  /**************************************/

  wave_3.stroke = 'green';

  wave_3.phaser.x = 0;
  wave_3.phaser.y = 0.5*height;
  wave_3.phaser.width = 0.3*width;
  wave_3.phaser.height = 0.5*height;
  wave_3.createPhasor();

  wave_3.graph.x = 0.3*width;
  wave_3.graph.y = 0.5*height;
  wave_3.graph.width = 0.5*width;
  wave_3.graph.height = 0.5*height;
  wave_3.createGraph();

  wave_3.createConnector();

  /**************************************/

  createControls();
  createEventListeners();
}

// ************************************************************************************************** //
// Update

function update(){
  wave_1.setup();
  wave_2.setup();
  wave_3.setup();

  start_index = 0;
  end_index = display_index;

  start_time = 0;
  end_time = displaySpan;

  wave_1.updateGraph(start_index, end_index, start_time);
  wave_2.updateGraph(start_index, end_index, start_time);
  wave_3.updateGraph(start_index, end_index, start_time);

  wave_1.rotatePhasor(0);
  wave_1.updateConnector(0);
  wave_2.rotatePhasor(0);
  wave_2.updateConnector(0);
  wave_3.rotatePhasor(0);
  wave_3.updateConnector(0);

  updateDials();
}

// ************************************************************************************************** //
// Simulate

function simulate(){
  time = 0.001*(Date.now() - startTime);
  time_index = parseInt(time/dt);

  if(time_index < time_array.length){

    if(time_index > display_index){ end_index = time_index; start_index = time_index - display_index; }
    else { start_index = 0; end_index = time_index; }

    if(time > displaySpan){ end_time = time; start_time = time - displaySpan;}
    else { start_time = 0; end_time = time; }

    wave_1.rotatePhasor(time_index);
    wave_1.updateGraph(start_index, end_index, start_time);
    wave_1.updateConnector(time_index);

    wave_2.rotatePhasor(time_index);
    wave_2.updateGraph(start_index, end_index, start_time);
    wave_2.updateConnector(time_index);

    wave_3.rotatePhasor(time_index);
    wave_3.updateGraph(start_index, end_index, start_time);
    wave_3.updateConnector(time_index);
  }

  if(time_index >= time_array.length){ stop(); update(); return }
  if(simulationRunning){ window.requestAnimationFrame(simulate); }
}

// ************************************************************************************************** //
// Timer functions

function play(){
  d3.select('#play-pause').html('Stop');
  startTime = Date.now();
  simulationRunning = true;
  simulate();
}

function stop(){
  d3.select('#play-pause').html('Play');
  simulationRunning = false;
}

// ************************************************************************************************** //
// Create Controls

function createControls(){
  createDials();
  d3.select('#play-pause-div').styles({ top: (1*height+20)+'px', left: (0*width+650)+'px' });
}

// ************************************************************************************************** //
// Create Event Listeners

function createEventListeners(){
  wave_1.dial_amp.dispatch.on("drag", function(data){
    var temp = data.value;
    wave_1.amp = temp;
    stop(); update();
  })

  wave_1.dial_freq.dispatch.on("drag", function(data){
    var temp = data.value;
    wave_1.freq = temp;
    stop(); update();
  })

  wave_1.dial_phase.dispatch.on("drag", function(data){
    var temp = data.value;
    wave_1.phase_degrees = temp;
    wave_1.phase = wave_1.phase_degrees*Math.PI/180;
    stop(); update();
  })

  wave_2.dial_amp.dispatch.on("drag", function(data){
    var temp = data.value;
    wave_2.amp = temp;
    stop(); update();
  })

  wave_2.dial_freq.dispatch.on("drag", function(data){
    var temp = data.value;
    wave_2.freq = temp;
    stop(); update();
  })

  wave_2.dial_phase.dispatch.on("drag", function(data){
    var temp = data.value;
    wave_2.phase_degrees = temp;
    wave_2.phase = wave_2.phase_degrees*Math.PI/180;
    stop(); update();
  })

  timeDial.dispatch.on("drag", function(data){
    var temp = data.value;
    displaySpan = temp;
    display_index = Math.floor(displaySpan/dt);
    stop(); update();
  })

  d3.select('#play-pause').on('click', function(){
    if(simulationRunning == true){ stop(); }
    else{ play(); }
  })
}