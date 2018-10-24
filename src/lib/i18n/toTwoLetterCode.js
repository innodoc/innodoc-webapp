// Normalize language code to 2 letters (e.g. 'en-US' -> 'en').
const toTwoLetterCode = lang => (lang.length > 2 ? lang.substring(0, 2) : lang)

export default toTwoLetterCode
