import Header from './content/Header'
import UnknownType from './content/UnknownType'

const contentTypeComponentMap = {
  'Header': Header
}

const mapContentTypeToComponent = (name) => {
  const Component = contentTypeComponentMap[name]
  if (!Component)
    return UnknownType
  return Component
}

export default mapContentTypeToComponent
