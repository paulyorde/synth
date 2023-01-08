<script>
  import {p5} from 'p5js-wrapper';
  import * as Tonal from 'tonal'
  import * as Tone from 'tone'
  import { PolySynth } from 'tone';

  let globalNoteRandom
  $: {
      // console.log('note', globalNoteRandom)
  }

  new p5( p => {
    let masterVolume = -9; 
    let ready = false;
    let wave;
    let synth;
    let loop;
    let scale;
    let prevNote;
    let chords = []
    let chordSynth
    let chordLoop
    let currentChord = 0;
    let nextChord = 0;
    let poly;
    let FFT; 
    let harmony
    let bass
    let note
    let divid = 0
    let cell = []
    let selectedNote = ''
    let selectedNotesArray = []
    scale = Tonal.Scale.get("E4 phrygian").notes; 
    let rows = []

    synth = new Tone.Synth({
        // type: "sine",
        // volume: -7.1,
        oscillator: {
          type: "square5"
        },
        // frequency: syparams.frequency,
        detune: .5,
        envelope: {
          attack: .5,
          decay: 1,
          sustain: 1,
          release: .5
        }
      });
      synth.toDestination()
  
    //------------------------------------------------------------
    p.setup = () => {
      // Create a new canvas to match the browser size
      // p.createCanvas(p.windowWidth, p.windowHeight);
      p.createCanvas(650, 300);

      let row = []
      // Should create n number of columns
      for (let x = 0; x < 16; x++) {
        // Should create n number of rows
        for (let y = 0; y < 7; y++){
          // Assign an index to each row
          row[y] = y
          // Assing an index to each column
          divid = x % 16
        
          /**
           * create a div for each cell
           * ** assign col and row id to each cell
           * ** move position coordinates for draw function
           * ** style the cell-div
           * ** add cell-div to array of rows
           */
          const div = p.createDiv()
          div.id(`col_${divid}_row-${y}`)
          div.position(x*40, y*40)
          div.elt.style.background = "black"
          div.elt.style.height = "40px"
          div.elt.style.width = "40px"
          div.elt.style.border = "1px solid gray"

          // TODO: WHAT IS THIS DOING
          // NOTHIGN CURRENTLY 
          rows.push(div)

          /**
           * set note to selected cell
           * each row has a note
           * each col decides the beat the note is played
           * 
          */

          /** 
           * Assign note from the current scale
           * ** each row should have unique note
           * ** each cell should have note corresponding to its row
           */
          for(let x = 0; x < scale.length; x++) {
            let rowNote = scale[x]
            if(row[x] === x) {
              cell[x] = rowNote
            }
          }
          
          /**
           * Cell of grid should interact with mouse
           * ** get noted of selected cell
           * ** assign note to array of selected notes
           * ** assign class to cell on selection
           * ** de-assign class from cell on deselection
           * ** style cell on selection/deselection
           * ** play note
           */
          div.mousePressed((e) => {
            getSelectedNote(div)
            selectedNotesArray.push(selectedNote)
            toggleStyle(div)
            playNote(div)
          })

        }
      }
       
    }

    function getSelectedNote(div) {
      // parse row from divid
      let rowid = div.id()
      let parsedRow = rowid.split('-')[1]
      // selected note
      selectedNote = cell[parsedRow]
    }

    function toggleStyle(div) {
      div.toggleClass('cell-selected')

      if(div.class() === 'cell-selected') {
        div.elt.style.background = 'blue'
      } else {
        div.elt.style.background = 'black'
      }
    }

    let newtime2
    function repeat(time) {
      newtime2 = time
      let y = 0
        rows.forEach((row, index) => {
          // console.log('each row', row.class(), index)
          if(row.class() === 'cell-selected') {
            // selectedNotesArray = 
            console.log('notes array', selectedNotesArray[y])
            synth.triggerAttackRelease(selectedNotesArray[y], "8n", time)
            y++

          }
        })
    }
    //------------------------------------------------------------
    function initalizeAudio() {
      buildChords()
  
      poly = new Tone.PolySynth(Tone.AMSynth, {
        // type: "sine",
        volume: -5.1,

        modulation: {
          type: "triangle"
        },
        oscillator: {
          type: "sine1"
        },
        // frequency: syparams.frequency,
        harmonicity: .5,
        detune: .5,
        envelope: {
          attack: .5,
          decay: 1,
          sustain: 1,
          release: .5
        }
        // type: "sawtooth",
        
      });
      poly.toDestination();

      synth = new Tone.Synth({
        // type: "sine",
        // volume: -7.1,
        oscillator: {
          type: "square5"
        },
        // frequency: syparams.frequency,
        detune: .5,
        envelope: {
          attack: .5,
          decay: 1,
          sustain: 1,
          release: .5
        }
      });
      synth.toDestination(); // synth.connect(Tone.Master);

      // @ts-ignore
      harmony = new PolySynth(Tone.DuoSynth,{
        // type: "sine",
        volume: -14.1,
        oscillator: {
          type: "sine29"
        },
        // frequency: syparams.frequency,
        detune: .5,
        envelope: {
          attack: .5,
          decay: 1,
          sustain: 1,
          release: .5
        }
      });

      // @ts-ignore
      bass = new PolySynth(Tone.MembraneSynth,{
        // type: "sine",
        volume: -14.1,
        oscillator: {
          type: "square"
        },
        // frequency: syparams.frequency,
        detune: .5,
        envelope: {
          attack: 0,
          decay: 1,
          sustain: 0,
          release: 0
        }
      });
      bass.toDestination();
      poly.volume.value = -5.1
      synth.volume.value = -8.1
      harmony.volume.value = -14.1

      // Tone.Transport.scheduleRepeat(repeat, "1n", newtime2, "24m")
      

      // console.log('rows[]',rows)

      loop = new Tone.Loop( (time) => {  
        let n = p.noise(p.frameCount * .01);
        let i = p.floor(p.map(n, 0, 1, 0, scale.length)); 
        note = scale[i];
        globalNoteRandom = note
        /**
         * cell-slected = [] of selected notes
         * use with sequence 
         * if cell-selected 
         * triggerAttack
        */

        /** Generative parts */
        if (prevNote != note) {
          // (freq, noteDuration, time)
          // synth.triggerAttackRelease(note, "8n", time);
          // harmony.triggerAttackRelease(note, "8n", time);
          // bass.triggerAttackRelease(scale[0], "4n", "+4n");
        }
        prevNote = note;
      }, "16n");  // '16n' here sets the speed of our loop -- every 16th note
      // Start the loop
      loop.start();
    
      wave = new Tone.Waveform();
      Tone.Master.connect(wave);
    
      Tone.Master.volume.value = masterVolume;
      Tone.Transport.schedule(changeChord, "1");
      Tone.Transport.start();
    }

    function changeChord(time) {
      currentChord = nextChord;
      let duration = p.floor(p.random(1, 4)) + "m";
      poly.triggerAttackRelease(chords[currentChord], duration, time);
      // get 1 , 2nd chord
      nextChord = p.floor(p.random(chords.length));
      
      Tone.Transport.schedule(changeChord, "+" + duration);
    }

    function buildChords() {
      for (let i = 0; i < scale.length; i++) {
        let chord = [];

        chord[0] = getMidiNote(i, scale);
        chord[1] = getMidiNote(i + 2, scale);
        chord[2] = getMidiNote(i + 4, scale);
        chord[3] = getMidiNote(i + 6, scale);

        // console.log(chord);
        chords.push(chord);
      }
    }

    function getMidiNote(noteNumber, notes) {
      let numNotes = notes.length;
      let i = modulo(noteNumber, numNotes);
      let note = notes[i];
      let octaveTranspose = p.floor(noteNumber / numNotes);
      let interval = Tonal.Interval.fromSemitones(octaveTranspose * 12);
      return Tonal.Note.transpose(note, interval);
    }

    function modulo(n, m) {
      return ((n % m) + m) % m;
    }
    
    //------------------------------------------------------------
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
    let count = 0
    
    //------------------------------------------------------------
    // Main render loop
    p.draw = () => {
      // p.clear();
      // p.background(220);

      

      // draw chords and scale of mode as each one plays
      // goal is to hear the sounds of each mode, so simply seeing the above works

      // p.background(0);
      // p.stroke(100)
      
    
      if (ready) {
      
      
        count++
        // drawModes()
        // drawSequencer()
        // drawWaveform(wave);
      } 
      // else {
      //   p.fill(255);
      //   p.noStroke();
      //   p.textAlign(p.CENTER, p.CENTER);
      //   p.text("CLICK TO START", p.width / 2, p.height / 2);
      // }
    }
    
    //------------------------------------------------------------
    function drawModes() {
      // text notes
      // text chords
      p.text(note, 100 + count, 100)
    }

    function drawSequencer() {
      // row each scale note
      // column = choose number of measures 
      // for(let i = 0; i < scale.length; i++) {
      //   console.log('scale note', i, scale[i])
      //   // p.rect(10,10,10,10)
      // }

      // for(let i = 0; i <= 16; i += 50) {

      // }
    }
    
    //------------------------------------------------------------
    function drawWaveform(wave, w = p.width, h = p.height) {
      p.stroke(255);
      let buffer = wave.getValue(0);


      // p.text(note, 100, 100)
      /**
       * Sequencer
       * note fills cell is on transport note's beat
       * 
       */
    
      // look a trigger point where the samples are going from
      // negative to positive
      let start = 0;
      for (let i = 1; i < buffer.length; i++) {
        if (buffer[i - 1] < 0 && buffer[i] >= 0) {
          start = i;
          break;
        }
      }
    
      // calculate a new end point such that we always
      // draw the same number of samples in each frame
      let end = start + buffer.length / 2;
    
      // drawing the waveform
      for (let i = start; i < end; i++) {
        let x1 = p.map(i - 1, start, end, 0, w);
        let y1 = p.map(buffer[i - 1], -1, 1, 0, h);
        let x2 = p.map(i, start, end, 0, w);
        let y2 = p.map(buffer[i], -1, 1, 0, h);
        p.line(x1, y1, x2, y2);
      }
    }
    
    let newtime
    function playNote(div) {
      // Tone.start()
      // Tone.Transport.start()
      console.log('div class', div.class())
      
      Tone.Transport.schedule((time) => {
        newtime = time

        synth.triggerAttackRelease(selectedNote, "8n", time)
      }, Tone.now())
    }
    //------------------------------------------------------------
    p.mousePressed = () => {
      if (!ready) {
        ready = true;  
        initalizeAudio();
        // if mouseX range 0-40 and mouseY 0-40 
        if(p.mouseX >= 0 && p.mouseX <= 40) {
          console.log('mouse', p.mouseX, p.mouseY)
          // create var to assign note to 
          // fill 
          p.stroke(100)
          p.fill(100, 0,1)
          // playNote()
        }
      }
      else {
        // ready = false;
        // Tone.Transport.stop();
      }
    }
    
  }, 'one');

</script>

<div id="one"></div>
<!-- 
    draw grid
    access from .js
 -->

<style>
  
</style>