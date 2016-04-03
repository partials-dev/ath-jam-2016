# `var i`
log = console.log.bind(console)
keyData = document.getElementById('key_data')
deviceInfoInputs = document.getElementById('inputs')
deviceInfoOutputs = document.getElementById('outputs')
midi = undefined
AudioContext = AudioContext or webkitAudioContext

# for ios/safari
context = new AudioContext
activeNotes = []
btnBox = document.getElementById('content')
btn = document.getElementsByClassName('button')
data = undefined
cmd = undefined
channel = undefined
type = undefined
note = undefined
velocity = undefined


# midi functions
onMIDISuccess = (midiAccess) ->
  midi = midiAccess
  inputs = midi.inputs.values()
  # loop through all inputs
  input = inputs.next()
  while input and !input.done
    # listen for midi messages
    input.value.onmidimessage = onMIDIMessage
    listInputs input
    input = inputs.next()
  # listen for connect/disconnect message
  midi.onstatechange = onStateChange
  #showMIDIPorts midi
  return


signal = new Phaser.Signal()

midiMovementState =
  up:
    isDown: false
  down:
    isDown: false
  left:
    isDown: false
  right:
    isDown: false

onMIDIMessage = (event) ->
  data = event.data
  cmd = data[0] >> 4
  channel = data[0] & 0xf
  type = data[0] & 0xf0
  note = data[1]
  velocity = data[2]
  # with pressure and tilt off
  # note off: 128, cmd: 8
  # note on: 144, cmd: 9
  # pressure / tilt on
  # pressure: 176, cmd 11:
  # bend: 224, cmd: 14
  #log note
  #log 'data', data, 'cmd', cmd, 'channel', channel
  #logger keyData, 'key data', data

  noteToDirection =
    49: 'up'
    45: 'down'
    44: 'left'
    46: 'right'

  hasKey = (obj, key) ->
    Object.keys(obj).indexOf(key) isnt -1
    
  switch type
    when 144 # Note On
      signal.dispatch note
      if hasKey(noteToDirection, JSON.stringify note)
        direction = noteToDirection[note]
        midiMovementState[direction].isDown = true


    when 128 # Note Off
      if hasKey(noteToDirection, JSON.stringify note)
        direction = noteToDirection[note]
        midiMovementState[direction].isDown = false

onStateChange = (event) ->
  `var type`
  #showMIDIPorts midi
  port = event.port
  state = port.state
  name = port.name
  type = port.type
  #if type == 'input'
    #log 'name', name, 'port', port, 'state', state
  return

listInputs = (inputs) ->
  input = inputs.value
  #log 'Input port : [ type:\'' + input.type + '\' id: \'' + input.id + '\' manufacturer: \'' + input.manufacturer + '\' name: \'' + input.name + '\' version: \'' + input.version + '\']'
  return

noteOn = (midiNote, velocity) ->
  #player midiNote, velocity

noteOff = (midiNote, velocity) ->
  #player midiNote, velocity

onMIDIFailure = (e) ->
  log 'No access to MIDI devices or your browser doesn\'t support WebMIDI API. Please use WebMIDIAPIShim ' + e
  return

### MIDI utility functions
showMIDIPorts = (midiAccess) ->
  inputs = midiAccess.inputs
  outputs = midiAccess.outputs
  html = undefined
  html = '<h4>MIDI Inputs:</h4><div class="info">'
  inputs.forEach (port) ->
    html += '<p>' + port.name + '<p>'
    html += '<p class="small">connection: ' + port.connection + '</p>'
    html += '<p class="small">state: ' + port.state + '</p>'
    html += '<p class="small">manufacturer: ' + port.manufacturer + '</p>'
    if port.version
      html += '<p class="small">version: ' + port.version + '</p>'
    return
  deviceInfoInputs.innerHTML = html + '</div>'
  html = '<h4>MIDI Outputs:</h4><div class="info">'
  outputs.forEach (port) ->
    html += '<p>' + port.name + '<br>'
    html += '<p class="small">manufacturer: ' + port.manufacturer + '</p>'
    if port.version
      html += '<p class="small">version: ' + port.version + '</p>'
    return
  deviceInfoOutputs.innerHTML = html + '</div>'
  return
###

# utility functions
randomRange = (min, max) ->
  Math.random() * (max + min) + min

rangeMap = (x, a1, a2, b1, b2) ->
  (x - a1) / (a2 - a1) * (b2 - b1) + b1

frequencyFromNoteNumber = (note) ->
  440 * 2 ** ((note - 69) / 12)

logger = (container, label, data) ->
  messages = label + ' [channel: ' + (data[0] & 0xf) + ', cmd: ' + (data[0] >> 4) + ', type: ' + (data[0] & 0xf0) + ' , note: ' + data[1] + ' , velocity: ' + data[2] + ']'
  #container.textContent = messages
  return


# check for midi support
if navigator.requestMIDIAccess
  navigator.requestMIDIAccess(sysex: false).then onMIDISuccess, onMIDIFailure
else
  alert 'No MIDI support in your browser.'

# add event listeners
#document.addEventListener 'keydown', keyController
#document.addEventListener 'keyup', keyController

module.exports =
  signal: signal
  movementState: midiMovementState
