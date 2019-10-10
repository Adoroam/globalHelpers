// array of arrays with first array containing object keys (google sheets) => array of objects
const crushV3 = ([keys, ...rows]) =>
  rows.map(row => keys.reduce((ac, key, i) => ({ ...ac, [key]: row[i] }), {}))

// array of objects => array of arrays where first array contains object keys (inverse of crushV3)
const uncrush = arr =>
  arr.reduce((ac, obj) => [...ac, Object.values(obj)], [Object.keys(arr[0])])

// array => array of unique entries (reducer function)
const unique = (ac, cu) => (ac.includes(cu) ? ac : [...ac, cu])

// object with nested properties and period-separated string of properties => value
const readNested = (obj, str) =>
  str.includes('.')
    ? str.split('.').reduce((acc, key) => acc[key], obj)
    : obj[str]
// object with nested properties, period-separated string, and value => new object with value at string index
const writeNested = (obj, str, val) => {
  if (!str.includes('.')) return { ...obj, [str]: val }
  const keys = str.split('.')
  const output = [...keys].reverse().reduce((acc, key, i) => {
    const next = keys.filter((k, f) => f + 1 < keys.length - i).join('.')
    return { ...readNested(obj, next), [key]: acc }
  }, val)
  return { ...obj, ...output }
}

module.exports = {
  crushV3,
  uncrush,
  unique,
  readNested,
  writeNested,
}