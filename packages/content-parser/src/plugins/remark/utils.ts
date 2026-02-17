function addExtension(data: Record<string, unknown>, field: string, extension: unknown) {
  let list: unknown[]

  if (Array.isArray(data[field])) {
    list = data[field] as unknown[]
  } else {
    list = []
    data[field] = list
  }

  list.push(extension)
}

export { addExtension }
