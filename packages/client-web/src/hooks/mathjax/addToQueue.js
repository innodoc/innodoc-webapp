// MathJax promise chain
let currentPromise

const addToQueue = (getPromise) => {
  if (currentPromise) {
    currentPromise.finally(() => {
      currentPromise = getPromise()
    })
  } else {
    currentPromise = getPromise()
  }
}

export default addToQueue
