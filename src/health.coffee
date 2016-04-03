STARTING_BAR_WIDTH = 50
STARTING_health = 100
currentHealth = STARTING_health
healthBar = null

create = (game) ->
  # health bar
  healthBar = game.add.graphics 50, 50
  updateBar 1

updateBar = (proportion) ->
  healthBar.clear()
  healthBar.lineStyle 10, 0xff0000, 1
  healthBar.moveTo 0, 0
  healthBar.lineTo STARTING_BAR_WIDTH * proportion, 0

spend = (amount) ->
  currentHealth -= amount
  currenthealth = 0 if currentHealth < 0
  proportion = currentHealth / STARTING_HEALTH
  updateBar proportion

module.exports =
  create: create
  current: -> currentHealth
  spend: spend
