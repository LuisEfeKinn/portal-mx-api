import { Transform } from 'class-transformer'

export function ToBoolean() {
  return Transform(({ obj, key }) => {
    const value = obj[key]
    if (value === 'true' || value === true) return true
    if (value === 'false' || value === false) return false
    return value
  })
}
