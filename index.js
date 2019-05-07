// ************************************************************************************************** //
// Document Ready

$('document').ready(() => {
  $('[data-toggle="popover"]').popover();
  setup();
})

// ************************************************************************************************** //
// Setup

var width = 1366, height = 768;

var timeSpan = 5, displaySpan = 5, dt = 0.01;
var time_array = d3.range(0,timeSpan,dt), time = 0, time_index = 0;
var amp_min = 1, amp_delta = 4, amp_max = amp_min+amp_delta;
var freq_min = 1, freq_delta = 9, freq_max = freq_min+freq_delta;

var line_gen = d3.line().x((d) => { return d.x }).y((d) => { return d.y });
var area_gen = d3.area().x((d) => { return d.x }).y0(0).y1((d) => { return d.y });

var startTime = 0, simulationRunning = false;

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

  startTime = Date.now();
  simulate();
}

// ************************************************************************************************** //
// Update

function update(){
  wave_1.setup();
  wave_2.setup();
  wave_3.setup();
  startTime = Date.now();
  simulate();
}

// ************************************************************************************************** //
// Simulate

function simulate(){
  time = 0.001*(Date.now() - startTime);
  time_index = parseInt(time/dt);

  if(time_index < time_array.length){
    wave_1.rotatePhasor();
    wave_1.updateGraph();
    wave_1.updateConnector();

    wave_2.rotatePhasor();
    wave_2.updateGraph();
    wave_2.updateConnector();

    wave_3.rotatePhasor();
    wave_3.updateGraph();
    wave_3.updateConnector();
  }

  if(time_index < time_array.length){ window.requestAnimationFrame(simulate); }
}

// ************************************************************************************************** //
// Create Controls

function createControls(){

  // Wave 1
  d3.select('#wave1_controls_div').styles({ top: (1*height+20)+'px', left: (0*width+50)+'px' });

  d3.select('#wave1_amp').attrs({ min: amp_min, max: amp_max, step: 0.1, value: wave_1.amp })
    .on('change', function(){
      wave_1.amp = parseFloat(d3.select(this).property('value'));
      update();
      d3.select('#wave1_amp_text').html('X = '+wave_1.amp.toFixed(1));
    });
  d3.select('#wave1_amp_text').html('X = '+wave_1.amp.toFixed(1));

  d3.select('#wave1_freq').attrs({ min: freq_min, max: freq_max, step: 0.1, value: wave_1.freq })
    .on('change', function(){
      wave_1.freq = parseFloat(d3.select(this).property('value'));
      update();
      d3.select('#wave1_freq_text').html('X = '+wave_1.freq.toFixed(1));
    });
  d3.select('#wave1_freq_text').html('ω = '+wave_1.freq.toFixed(1) + ' Hz');

  d3.select('#wave1_phase').attrs({ min: 0, max: 360, step: 1, value: wave_1.phase_degrees })
    .on('change', function(){
      wave_1.phase_degrees = parseFloat(d3.select(this).property('value'));
      wave_1.phase = wave_1.phase_degrees*Math.PI/180;
      update();
      d3.select('#wave1_phase_text').html('X = '+wave_1.phase_degrees.toFixed(1));
    });
  d3.select('#wave1_phase_text').html('θ = '+wave_1.phase_degrees.toFixed(0) + '°');

  // Wave 2
  d3.select('#wave2_controls_div').styles({ top: (1*height+20)+'px', left: (0*width+350)+'px' });

  d3.select('#wave2_amp').attrs({ min: amp_min, max: amp_max, step: 0.1, value: wave_1.amp })
    .on('change', function(){
      wave_2.amp = parseFloat(d3.select(this).property('value'));
      update();
      d3.select('#wave2_amp_text').html('X = '+wave_2.amp.toFixed(1));
    });
  d3.select('#wave2_amp_text').html('X = '+wave_2.amp.toFixed(1));

  d3.select('#wave2_freq').attrs({ min: freq_min, max: freq_max, step: 0.1, value: wave_2.freq })
    .on('change', function(){
      wave_2.freq = parseFloat(d3.select(this).property('value'));
      update();
      d3.select('#wave2_freq_text').html('X = '+wave_2.freq.toFixed(1));
    });
  d3.select('#wave2_freq_text').html('ω = '+wave_2.freq.toFixed(1) + ' Hz');

  d3.select('#wave2_phase').attrs({ min: 0, max: 360, step: 1, value: wave_2.phase_degrees })
    .on('change', function(){
      wave_2.phase_degrees = parseFloat(d3.select(this).property('value'));
      wave_2.phase = wave_2.phase_degrees*Math.PI/180;
      update();
      d3.select('#wave2_phase_text').html('X = '+wave_2.phase_degrees.toFixed(1));
    });
  d3.select('#wave2_phase_text').html('θ = '+wave_2.phase_degrees.toFixed(0) + '°');

  // Play/pause
  d3.select('#play-pause').styles({ top: (1*height+20)+'px', left: (0*width+650)+'px' });

}
