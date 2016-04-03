attacks = null
enemyModule = require './enemy'

load = (game) ->
  game.load.atlasJSONArray 'attack.earth', 'img/particles/earth-shot.png', 'img/particles/earth-shot.json'
  game.load.spritesheet 'attack.fire', 'img/particles/fire-shot.png', 1, 1
  game.load.spritesheet 'attack.water', 'img/particles/water-shot.png', 1, 1
  game.load.spritesheet 'attack.wind', 'img/particles/wind-shot.png', 1, 1

game = null
create = (g) ->
  game = g
  attacks = game.add.physicsGroup Phaser.Physics.ARCADE

nextFire =
  fire: 1500
  water: 500
  wind: 500
  earth: 1000

attack = (attacker, enemy, element) ->
  return unless game.time.time > attacker.nextFire

  sprite = attacks.create attacker.body.center.x, attacker.body.center.y, "attack.#{element}"
  sprite.element = element
  attacker.nextFire = game.time.time + nextFire[element]

  # fire bullet
  unless element is 'earth'
    sprite.scale.set 10, 10
    game.physics.arcade.moveToObject sprite, enemy, 100
  else # spawn force wave
    sprite.animations.add 'shake', [0, 1, 2, 0, 1, 2, 0, 1, 2], 10, false
    sprite.animations.play 'shake'
    earthAttack attacker.attackRange
    sprite.events.onAnimationComplete.add ->
      sprite.destroy()

earthAttack = (range) ->
  overlapHandler = (enemy, range) ->
    enemy.hitBy 'earth'
  enemyModule.enemies().forEach (enemy) ->
    game.physics.arcade.overlap enemy, range, overlapHandler

update = ->
  overlapHandler = (enemy, attack) ->
    enemy.hitBy attack.element
    attack.kill()
  enemyModule.enemies().forEach (nme) ->
    attacks.forEach (atk) ->
      game.physics.arcade.overlap nme, atk, overlapHandler

module.exports =
  load: load
  create: create
  update: update
  attack: attack
