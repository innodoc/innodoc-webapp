class ExtractionError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'ExtractionError'
  }
}

export { ExtractionError }
