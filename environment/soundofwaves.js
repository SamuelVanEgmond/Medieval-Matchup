/* global MMU */ 

// Sound required user interaction!
// Started by the menu.play()
MMU.startWaves = function() {
  MMU.wavesaudioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Create an empty three-second stereo buffer at the sample rate of the AudioContext
  const myArrayBuffer = MMU.wavesaudioContext.createBuffer(
    2,
    MMU.wavesaudioContext.sampleRate * 3,
    MMU.wavesaudioContext.sampleRate,
  );

  // Fill the buffer with some pink(?) noise;
  // Just random values between -1.0 and 1.0 
  for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
    // This gives us the actual array that contains the data
    const nowBuffering = myArrayBuffer.getChannelData(channel);
    let v = 0;
    for (let i = 0; i < myArrayBuffer.length; i++) {
      // Use sine for the wave volume
      let s = Math.sin(i/myArrayBuffer.length*Math.PI*2) * 0.02 + 0.03;
      
      // Math.random() is in [0; 1.0]
      // audio needs to be in [-1.0; 1.0]
      // We do a 'moving average' to filter out the high frequencies to get a better wave-like sound
      nowBuffering[i] = (v*10 + (Math.random() * 2 - 1) * s)/11;
      v = nowBuffering[i];
    }
  }

  // Get an AudioBufferSourceNode.
  // This is the AudioNode to use when we want to play an AudioBuffer
  MMU.waves = MMU.wavesaudioContext.createBufferSource();

  // set the buffer in the AudioBufferSourceNode
  MMU.waves.buffer = myArrayBuffer;
  MMU.waves.loop = true;

  // connect the AudioBufferSourceNode to the
  // destination so we can hear the sound
  MMU.waves.connect(MMU.wavesaudioContext.destination);

  // start the waves sound
  MMU.waves.start();
}