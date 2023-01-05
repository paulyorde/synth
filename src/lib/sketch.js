// import '../css/style.css';
import {p5} from 'p5js-wrapper';
import * as Tonal from 'tonal'
import * as Tone from 'tone'
import { PolySynth } from 'tone';

// export let generativeModes = new p5( p => {
//   let masterVolume = -9; 
//   let ready = false;
//   let wave;
//   let synth;
//   let loop;
//   let scale;
//   let prevNote;
//   let chords = []
//   let chordSynth
//   let chordLoop
//   let currentChord = 0;
//   let nextChord = 0;
//   let poly;
//   let FFT; 
//   let harmony
//   let bass
//   let note

  
//   //------------------------------------------------------------
//   // Create a new canvas to match the browser size
//   p.setup = () => {
//     p.createCanvas(p.windowWidth, p.windowHeight);
    
//     // Look at Tonal.ScaleType.names() for a full list of 
//     // supported scales
//     scale = Tonal.Scale.get("E4 phrygian").notes;  
//     // scale = Tonal.Scale.get("C4 minor pentatonic").notes;  
//   }
  
//   //------------------------------------------------------------
//   function initalizeAudio() {
//     buildChords()
 
//     poly = new Tone.PolySynth(Tone.AMSynth, {
//       // type: "sine",
//       volume: -5.1,

//       modulation: {
//         type: "triangle"
//       },
//       oscillator: {
//         type: "sine1"
//       },
//       // frequency: syparams.frequency,
//       harmonicity: .5,
//       detune: .5,
//       envelope: {
//         attack: .5,
//         decay: 1,
//         sustain: 1,
//         release: .5
//       }
//       // type: "sawtooth",
      
//     });
//     poly.toDestination();

//     synth = new Tone.Synth({
//       // type: "sine",
//       // volume: -7.1,
//       oscillator: {
//         type: "square5"
//       },
//       // frequency: syparams.frequency,
//       detune: .5,
//       envelope: {
//         attack: .5,
//         decay: 1,
//         sustain: 1,
//         release: .5
//       }
//     });
//     synth.toDestination(); // synth.connect(Tone.Master);

//     // @ts-ignore
//     harmony = new PolySynth(Tone.DuoSynth,{
//       // type: "sine",
//       volume: -14.1,
//       oscillator: {
//         type: "sine29"
//       },
//       // frequency: syparams.frequency,
//       detune: .5,
//       envelope: {
//         attack: .5,
//         decay: 1,
//         sustain: 1,
//         release: .5
//       }
//     });

//     // @ts-ignore
//     bass = new PolySynth(Tone.MembraneSynth,{
//       // type: "sine",
//       volume: -14.1,
//       oscillator: {
//         type: "square"
//       },
//       // frequency: syparams.frequency,
//       detune: .5,
//       envelope: {
//         attack: 0,
//         decay: 1,
//         sustain: 0,
//         release: 0
//       }
//     });
//     bass.toDestination();
//     poly.volume.value = -5.1
//     synth.volume.value = -8.1
//     harmony.volume.value = -14.1
     
//     loop = new Tone.Loop( (time) => {  
//       let n = p.noise(p.frameCount * .01);
//       let i = p.floor(p.map(n, 0, 1, 0, scale.length)); 
//       note = scale[i];
//       if (prevNote != note) {
//         // (freq, noteDuration, time)
//         synth.triggerAttackRelease(note, "8n", time);
//         harmony.triggerAttackRelease(note, "8n", time);
//         bass.triggerAttackRelease(scale[0], "4n", "+4n");
//       }
//       prevNote = note;
//     }, "16n");  // '16n' here sets the speed of our loop -- every 16th note
//     // Start the loop
//     loop.start();
  
//     wave = new Tone.Waveform();
//     Tone.Master.connect(wave);
  
//     Tone.Master.volume.value = masterVolume;
//     Tone.Transport.schedule(changeChord, "1");
//     Tone.Transport.start();
//   }

//   function changeChord(time) {
//     currentChord = nextChord;
//     let duration = p.floor(p.random(1, 4)) + "m";
//     poly.triggerAttackRelease(chords[currentChord], duration, time);
//      // get 1 , 2nd chord
//     nextChord = p.floor(p.random(chords.length));
    
//     Tone.Transport.schedule(changeChord, "+" + duration);
//   }

//   function buildChords() {
//     for (let i = 0; i < scale.length; i++) {
//       let chord = [];

//       chord[0] = getMidiNote(i, scale);
//       chord[1] = getMidiNote(i + 2, scale);
//       chord[2] = getMidiNote(i + 4, scale);
//       chord[3] = getMidiNote(i + 6, scale);

//       console.log(chord);
//       chords.push(chord);
//     }
//   }

//   function getMidiNote(noteNumber, notes) {
//     let numNotes = notes.length;
//     let i = modulo(noteNumber, numNotes);
//     let note = notes[i];
//     let octaveTranspose = p.floor(noteNumber / numNotes);
//     let interval = Tonal.Interval.fromSemitones(octaveTranspose * 12);
//     return Tonal.Note.transpose(note, interval);
//   }

//   function modulo(n, m) {
//     return ((n % m) + m) % m;
//   }
  
//   //------------------------------------------------------------
//   p.windowResized = () => {
//     p.resizeCanvas(p.windowWidth, p.windowHeight);
//   }
//   let count = 0
//   //------------------------------------------------------------
//   // Main render loop
//   p.draw = () => {
//     // draw chords and scale of mode as each one plays
//     // goal is to hear the sounds of each mode, so simply seeing the above works

//     p.background(0);
  
//     if (ready) {
//       count++
//       drawModes()
//       drawSequencer()
//       drawWaveform(wave);
//     } else {
//       p.fill(255);
//       p.noStroke();
//       p.textAlign(p.CENTER, p.CENTER);
//       p.text("CLICK TO START", p.width / 2, p.height / 2);
//     }
//   }
  
//   //------------------------------------------------------------
//   function drawModes() {
//     // text notes
//     // text chords
//     p.text(note, 100 + count, 100)
//   }

//   function drawSequencer() {
//     // row each scale note
//     // column = choose number of measures 
//     // for(let i = 0; i < scale.length; i++) {
//     //   console.log('scale note', i, scale[i])
//     //   // p.rect(10,10,10,10)
//     // }

//     // for(let i = 0; i <= 16; i += 50) {

//     // }
//   }
  
//   //------------------------------------------------------------
//   function drawWaveform(wave, w = p.width, h = p.height) {
//     p.stroke(255);
//     let buffer = wave.getValue(0);


//     // p.text(note, 100, 100)
//     /**
//      * Sequencer
//      * note fills cell is on transport note's beat
//      * 
//      */
  
//     // look a trigger point where the samples are going from
//     // negative to positive
//     let start = 0;
//     for (let i = 1; i < buffer.length; i++) {
//       if (buffer[i - 1] < 0 && buffer[i] >= 0) {
//         start = i;
//         break;
//       }
//     }
  
//     // calculate a new end point such that we always
//     // draw the same number of samples in each frame
//     let end = start + buffer.length / 2;
  
//     // drawing the waveform
//     for (let i = start; i < end; i++) {
//       let x1 = p.map(i - 1, start, end, 0, w);
//       let y1 = p.map(buffer[i - 1], -1, 1, 0, h);
//       let x2 = p.map(i, start, end, 0, w);
//       let y2 = p.map(buffer[i], -1, 1, 0, h);
//       p.line(x1, y1, x2, y2);
//     }
//   }
  
//   //------------------------------------------------------------
//   p.mousePressed = () => {
//     if (!ready) {
//       ready = true;  
//       initalizeAudio();
//     }
//     else {
//       ready = false;
//       Tone.Transport.stop();
//     }
//   }
  
// }, 'one');
  
  
// export default generativeModes

