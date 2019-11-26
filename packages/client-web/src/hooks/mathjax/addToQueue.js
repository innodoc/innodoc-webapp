// MathJax promise chain
let currentPromise

const addToQueue = (getPromise) => {
  console.log('addToQueue')
  if (currentPromise) {
    console.log('addToQueue: promise present -> chaining')
    currentPromise.finally(() => {
      currentPromise = getPromise()
    })
  } else {
    console.log('addToQueue: NO promise present')
    currentPromise = getPromise()
  }
}

export default addToQueue
