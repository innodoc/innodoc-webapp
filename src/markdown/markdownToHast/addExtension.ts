function addExtension<T>(data: Record<string, unknown>, field: string, extension: T) {
  let list: T[]
  if (Array.isArray(data[field])) {
    list = data[field] as T[]
  } else {
    data[field] = list = []
  }
  list.push(extension)
}

export default addExtension
