const getAmountsOut = (amountsIn, path, instance) =>
  instance.methods.getAmountsOut(amountsIn, path).call()

module.exports = { getAmountsOut }
