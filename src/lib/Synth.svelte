<script>
  import {p5} from 'p5js-wrapper';
  import * as Tonal from 'tonal'
  import * as Tone from 'tone'
  import { PolySynth } from 'tone';

  // let beginSelectingNoteDuration
  // let endSelectingNoteDuration

  $: {
      // console.log('note', globalNoteRandom)
  }

  new p5( p => {
    let masterVolume = -9; 
    let ready = false;
    let wave;
    let synth;
    let loop;
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
    let scale = Tonal.Scale.get("E4 phrygian").notes; 
    let rows = []
    let sequenceButton
    let newtime = 0
    let beginSelectingNoteDuration
    let endSelectingNoteDuration
    let noteDuration
    let sequenceStarted = false
    let notes

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
      drawSequencer()

      // playSequence()
      sequenceButton = p.createButton('play sequence')
      sequenceButton.position(300, 300);
      sequenceButton.mousePressed((e) => {

        console.log('start seq')
        // startSequencer()
        // repeat()
        // playit()
        createSequence()
      })



    }

    //------------------------------------------------------------
    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
    
    //------------------------------------------------------------
    p.draw = () => {
      // p.background(220);
      // p.background(0);
    
      if (ready) {
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
    p.mousePressed = (e) => {
      // console.log('p::', e.clientX)
      beginSelectingNoteDuration = e.clientX
      if (!ready) {

        console.log('tone started')
        ready = true;  
        initalizeAudio();

        /**
         * if in div 
            
         * 
        */
        // Tone.start()
        // Tone.Transport.start();
      }
      // else {
      //   ready = false;
      //   Tone.Transport.stop();
      // }
    }

    p.mouseReleased = (e) => {
      endSelectingNoteDuration = e.clientX
      setNoteDuration()

    }

     /**
     * 
     * math forumula to get cordinates of div in order to differentiate 
     * when div chagnes
     */
     p.mouseDragged =(e) => {
      
    }

    function setSelectedNote(div) {
      rows.forEach((note) => {
        // assign note to cell column based on row
        // col 1 row 1 = E
        // col 1 row 2 = F

      })
      
      for(let x = 0; x < rows.length; x++) {
        let rowNote = scale[x]
        
        div.attribute('data-note', rowNote)


        
      }
      // let rowid = div.id()
      // let parsedRow = rowid.split('-')[1]
      // selectedNote = cell[parsedRow]
      selectedNote = div.attribute()
      // console.log('attr note set selected', selectedNote)
      return selectedNote
    }

    function toggleStyle(div) {
      div.toggleClass('cell-selected')

      if(div.class() === 'cell-selected') {
        div.elt.style.background = 'blue'
      } else {
        div.elt.style.background = 'black'
      }
    }

    let measures = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    function createSequence() {
      sequenceStarted = true
      Tone.start()
      Tone.Transport.start();
      Tone.Transport.bpm.value = 140
          
      let i = 0
      var loop1 = new Tone.Sequence(
            function (time, col) {
              /**
               * set duration when drag
               * if class = duration -> get data-duration: value
               * replace here "16n" w/ duration
              */
              if(rows[i].class() === 'cell-selected') {
                let note = rows[i].attribute('data-note')
                let duration = rows[i].attribute('data-duration')
                  console.log('note duration', duration)
                  /**
                   * set data-duration onMouseRelease -> setNoteDuration
                  */
                  synth.triggerAttackRelease(note, duration, time)
              }
              i++
              // if(i === 111) {
              //   i = 0
              // }
              i = i % 111
              // console.log('k', rows[i], i)


              // console.log('sequence time', time, 'col', col, i)
              // make this variable to accomodate measures 
              // 8 for 1, 16 for 2 etc. 
              // draw crid accordingly 
            // }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "64n").start(.02);
            }, measures, "64n").start(.02);
    }

    /**
     * play selected note from user selection in time corresponding to grid
     * curretn row?    -> note
     * current column? -> timing
     * current cell??  -> selected note
     * 
     * move thru each row 
     * while in a column -> 
     * 
     * check each column for each row
     * ex
     * column 1 -> row 1,2,3,4,5,6,7
     * column 2 -> row ... 
     * if note play
     * 
     */


    // const startSequencer = () => {
      let i = 0
      const repeat = () => {
        new Tone.Loop((time) => {
          console.log('repeat', time, rows[i])

          if(rows[i].class() === 'cell-selected') {
            console.log('row')
            synth.triggerAttackRelease(note, "16n", time)
          }
          i++
          // rows.forEach((row, index) => {
          //   console.log('cell', row.id(), row.class())
          //   if(row.class() === 'cell-selected') {
          //     let note = row.attribute('data-note')
          //     console.log('rowid', row.id(), 'note', note, ":", time, ":", index)
          //     synth.triggerAttackRelease(note, "16n", time)
          //   }
          // })
        //@ts-ignore
        }, "16n").start(.02)
        let i = 0





        // for (let x = 0; x < 16; x++) {
        //   console.log('note', rows[x], "::", time)

        // Should create n number of rows
        //   for (let y = 0; y < 7; y++){
        //     if(rows[i].class() === 'cell-selected') {
        //       let note = rows[i].attribute('data-note')
        //         console.log('rows', rows, 'note', note)
        //         synth.triggerAttackRelease(note, "8n", newtime)
        //     }
        //     i++
        //   }
        // }
        // Tone.start()
        // Tone.Transport.start()
        // Tone.Transport.scheduleRepeat(repeat, "2m", time, "8n");
        Tone.start()
        Tone.Transport.start();
      }
    // }

    function playit(time) {
        Tone.Transport.schedule(repeat, "8n");
    }

    /** 
     * create button to start sequencer
     * ** in setup 
     */
    function playSequence() {
      // startSequencer()
      // sequenceButton = p.createButton('100','play sequence')
      sequenceButton.mousePressed((e) => {
        // startSequencer()
      // repeat()
      // new Tone.Loop((time) => {
      // Tone.Transport.scheduleRepeat((time) => {
      //   // console.log('time', time)
      //     rows.forEach((row, index) => {
      //       // console.log('each row', row.class(), index)
      //       // grab the row index of the cell
      //       // let i = index % 7
      //       // console.log('col', row, 'index', index)
      //       // console.log('row', row)
      //       if(row.class() === 'cell-selected') {
      //         let note = row.attribute('data-note')

      //         // selectedNotesArray = 
      //         // let parsedRow = row.split('-')[1]
      //         // selectedNote = cell[parsedRow]
      //         // console.log('selected note', selectedNote)
      //         // let note = setSelectedNote(row)
      //         console.log('play sequence', 'note', row.attribute('data-note'))
      //         // if notes had a duration 
      //         // console.log('notes array', note)
      //         synth.triggerAttackRelease(note, "8n", time)
      //       }
      //     })
      // }, "2m")

        
      // }, "2m").start(0)
      // Tone.Transport.schedule((time) => {
      //   rows.forEach((row, index) => {
      //     // console.log('each row', row.class(), index)
      //     // grab the row index of the cell
      //     // let i = index % 7
      //     // console.log('col', row, 'index', index)
          
      //     if(row.class() === 'cell-selected') {
      //       // selectedNotesArray = 
      //       // let parsedRow = row.split('-')[1]
      //       // selectedNote = cell[parsedRow]
      //       // console.log('selected note', selectedNote)
      //       let note = setSelectedNote(row)
      //       console.log('col', row.id(), 'note', note)
      //       // if notes had a duration 
      //       // console.log('notes array', note)
      //       synth.triggerAttackRelease(note, "8n", time)
      //     }
      //   })
      // }, "8n")

        console.log('play sequence')
      })
    }

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

      loop = new Tone.Loop( (time) => {  
        let n = p.noise(p.frameCount * .01);
        let i = p.floor(p.map(n, 0, 1, 0, scale.length)); 
        note = scale[i];
        // globalNoteRandom = note
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
      // Tone.Transport.schedule(changeChord, "1");
      // Tone.Transport.start();
    }

    function changeChord(time) {
      currentChord = nextChord;
      let duration = p.floor(p.random(1, 4)) + "m";
      // poly.triggerAttackRelease(chords[currentChord], duration, time);
      // get 1 , 2nd chord
      nextChord = p.floor(p.random(chords.length));
      
      // Tone.Transport.schedule(changeChord, "+" + duration);
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

    function drawSequencer() {
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
           * 
           * drag mouse to select/set duration of note
           */
          const div = p.createDiv()
          div.id(`col_${divid}_row-${y}`)
          div.position(x*40, y*40)
          
          // console.log('div position', div.position())

          div.elt.style.background = "black"
          div.elt.style.height = "40px"
          div.elt.style.width = "40px"
          div.elt.style.border = "1px solid gray"
          let thenote = div.attribute('data-note', scale[y])
          // let thenote = setSelectedNote(div)
          // console.log('the note', div.attribute('data-note'))
        
          // let noteAttr = div.attribute('data-note')
          // console.log('note attr', noteAttr)

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
          // for(let x = 0; x < scale.length; x++) {
          //   let rowNote = scale[x]
          //   if(row[x] === x) {
          //     cell[x] = rowNote
          //     div.attribute('data-note', rowNote)
          //     // console.log('cell', cell[x])
          //   }
          // }
          
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
            // setSelectedNote(div)
            selectedNotesArray.push(selectedNote)
            toggleStyle(div)
            playNoteOnSelection(div)
            // console.log('cell', div, 'init coor', div.x)
            // beginSelectingNoteDuration = div.x
          })

          div.mouseReleased((e) => {
            // console.log('init coord',beginSelectingNoteDuration)

            // console.log('released', div)
            // endSelectingNoteDuration = div.x

          })

        }
      }
    }
    
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

    function setNoteDuration(div) {
      console.log('begin duration', beginSelectingNoteDuration)
       notes = []
      

      console.log('end duration', endSelectingNoteDuration)
      switch(true) {
      /**
       * init = clientX onMousedPressed 
       *    ex# 50
       * final = clientX onMouseReleased 
       *    ex# 120
       * results = 120 - 50 = 70 
       * 
       * follow the mouse as it moves
       *  if it clicks and releases between any range of 0 and 40
       *  then 16th note
       * 
       * click and releases range of 0 and 80
       * 8th note 
       * 
       * 0 and 160 
       * 1/4 note
       * 
       * 0 and 320
       * 1/2 note
       * 
       * 0 and 640 
       * 1 note
       */ 

       case ((endSelectingNoteDuration - beginSelectingNoteDuration) > 80) && ((endSelectingNoteDuration - beginSelectingNoteDuration) <= 120):
        console.log('4n')
        noteDuration = '4n'
        break
      case ((endSelectingNoteDuration - beginSelectingNoteDuration) >= 40) && ((endSelectingNoteDuration - beginSelectingNoteDuration) <= 80):
        console.log('8n')
        noteDuration = '8n'
        break
      case (beginSelectingNoteDuration - endSelectingNoteDuration < 40):
        console.log('16n')
        noteDuration = '16n'
        break
      
      
      // case (e.clientX > 80) && (e.clientX <= 280):
      //   console.log('1/2 note')
      //   break
 
    }


    /**
     * when mouse release ( of cell -> div.mouseReleased )
     * use x coord from drag mouse in duraiont math 
    */
      rows.forEach((cell, i) => {
        if(cell.class() === 'cell-selected' && !sequenceStarted) {
          // if cell has a duration of 4n then each next cell should be not have a duration
          // but should have a note of null (non-playable cell) 
                 let note = cell.attribute('data-duration', noteDuration)
                 notes.push(cell.attribute('data-duration'))
                  console.log(notes)
        }
      })
    }
    
    function playNoteOnSelection(div) {

      // Tone.start()
      // Tone.Transport.start()
      let note = div.attribute('data-note')
      
      /**
       * 
       * set duration when drag
       * replace "8n" with duration 
      */
      synth.triggerAttackRelease(note, "8n")
      
      // Tone.Transport.schedule((time) => {
      //   newtime = time

      //   synth.triggerAttackRelease(selectedNote, "8n", time)
      // }, Tone.now())
    }

    
    
    
  }, 'one');



    
</script>

<div id="one">
 
</div>

<style>
  
</style>