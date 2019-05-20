// ************************************************************************************************** //
// Create Dials

function createDials(){

  //*********** Wave 1 - Amplitude Dial ********************//
  var params = {
    min: amp_min, max: amp_max, step: 0.1,
    svg: 'canvas',
    symbol: 'X', color: 'steelblue', unit: 'rad',
    cx: 0.85*width, cy: 0.2*height, size: 0.08*height,
    active: true,
  };

  wave_1.dial_amp = new Dial();
  wave_1.dial_amp.setup(params);
  wave_1.dial_amp.create();
  //*********** Wave 1 - Amplitude Dial ********************//

  //*********** Wave 1 - Frequency Dial ********************//
  var params = {
    min: freq_min, max: freq_max, step: 0.1,
    svg: 'canvas',
    symbol: 'ω', color: 'orange', unit: 'Hz',
    cx: 0.91*width, cy: 0.2*height, size: 0.08*height,
    active: true,
  };

  wave_1.dial_freq = new Dial();
  wave_1.dial_freq.setup(params);
  wave_1.dial_freq.create();
  //*********** Wave 1 - Frequency Dial ********************//

  //*********** Wave 1 - Phase Dial ********************//
  var params = {
    min: 0, max: 360, step: 1,
    svg: 'canvas',
    symbol: 'Ф', color: 'green', unit: 'degree',
    cx: 0.97*width, cy: 0.2*height, size: 0.08*height,
    active: true,
  };

  wave_1.dial_phase = new Dial();
  wave_1.dial_phase.setup(params);
  wave_1.dial_phase.create();
  //*********** Wave 1 - Phase Dial ********************//

  //*********** Wave 2 - Amplitude Dial ********************//
  var params = {
    min: amp_min, max: amp_max, step: 0.1,
    svg: 'canvas',
    symbol: 'X', color: 'steelblue', unit: 'rad',
    cx: 0.85*width, cy: 0.4*height, size: 0.08*height,
    active: true,
  };

  wave_2.dial_amp = new Dial();
  wave_2.dial_amp.setup(params);
  wave_2.dial_amp.create();
  //*********** Wave 2 - Amplitude Dial ********************//

  //*********** Wave 2 - Frequency Dial ********************//
  var params = {
    min: freq_min, max: freq_max, step: 0.1,
    svg: 'canvas',
    symbol: 'ω', color: 'orange', unit: 'Hz',
    cx: 0.91*width, cy: 0.4*height, size: 0.08*height,
    active: true,
  };

  wave_2.dial_freq = new Dial();
  wave_2.dial_freq.setup(params);
  wave_2.dial_freq.create();
  //*********** Wave 2 - Frequency Dial ********************//

  //*********** Wave 2 - Phase Dial ********************//
  var params = {
    min: 0, max: 360, step: 1,
    svg: 'canvas',
    symbol: 'Ф', color: 'green', unit: 'degree',
    cx: 0.97*width, cy: 0.4*height, size: 0.08*height,
    active: true,
  };

  wave_2.dial_phase = new Dial();
  wave_2.dial_phase.setup(params);
  wave_2.dial_phase.create();
  //*********** Wave 2 - Phase Dial ********************//

  //*********** TimeSpan Dial ********************//
  var params = {
    min: 1, max: 20, step: 1,
    svg: 'canvas',
    symbol: 't', color: 'gray', unit: 's',
    cx: 0.85*width, cy: 0.6*height, size: 0.08*height,
    active: true,
  };

  timeDial = new Dial();
  timeDial.setup(params);
  timeDial.create();
  //*********** TimeSpan Dial ********************//
}

// ************************************************************************************************** //
// Update Dials

function updateDials(){
  wave_1.dial_amp.update(wave_1.amp);
  wave_1.dial_freq.update(wave_1.freq);
  wave_1.dial_phase.update(wave_1.phase_degrees);

  wave_2.dial_amp.update(wave_2.amp);
  wave_2.dial_freq.update(wave_2.freq);
  wave_2.dial_phase.update(wave_2.phase_degrees);

  timeDial.update(displaySpan);
}
