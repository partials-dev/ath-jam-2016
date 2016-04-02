STARTING_BAR_WIDTH = 50
STARTING_MANA = 100
currentMana = STARTING_MANA
manaBar = null

create = (game) ->
  # mana bar
  manaBar = game.add.graphics 50, 50
  updateBar 1

updateBar = (proportion) ->
  manaBar.clear()
  manaBar.lineStyle 10, 0x0000ff, 1
  manaBar.moveTo 0, 0
  manaBar.lineTo STARTING_BAR_WIDTH * proportion, 0

spend = (amount) ->
  currentMana -= amount
  currentMana = 0 if currentMana < 0
  proportion = currentMana / STARTING_MANA
  updateBar proportion

module.exports =
  create: create
  current: -> currentMana
  spend: spend
