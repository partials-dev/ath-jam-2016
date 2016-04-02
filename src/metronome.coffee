tempo = 120 # bpm
tempoMilliseconds = 60000 / tempo

metronome = (game) ->
  beat = 0
  met = new Phaser.Signal()

  updateBeat = () ->
    met.dispatch(beat)
    if beat is 3
      beat = 0
    else
      beat++

  game.time.events.loop tempoMilliseconds, updateBeat
  met

shoutBeat = (beat) ->
  console.log beat + 1

module.exports =
  metronome: metronome
  shoutBeat: shoutBeat
