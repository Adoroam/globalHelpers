const fedHolidayList = require('@18f/us-federal-holidays')
// const pdfFiller = require('pdffiller')

const addDays = (dateStr, d) => {
  const date = new Date(dateStr)
  date.setDate(date.getDate() + d)
  return date
}

const addMonths = (dateStr, m) => {
  const date = new Date(dateStr)
  date.setMonth(date.getMonth() + m)
  if (new Date(dateStr).getDate() !== date.getDate()) date.setDate(0)
  return date
}

const zeroHour = dateStr => {
  const date = new Date(dateStr)
  const hours = [0, 0, 0, 0]
  date.setHours(...hours)
  return date.toISOString()
}

// argument is number of weeks before today, defaults to last week (1)
const getPrevWeek = (w = 1) => {
  // zero out today
  const today = new Date(zeroHour(new Date()))
  // get the current day of the week
  const dow = today.getDay()
  // find out how many days away today is from monday
  const diff = dow - 1
  // set the start to this monday
  const startDay = addDays(today, !dow ? -6 : -diff)
  // set the end to next monday
  const endDay = addDays(startDay, 7)
  // make sure those days are zeroed out, then add negative w weeks worth of days
  const [start, end] = [startDay, endDay]
    .map(zeroHour)
    .map(day => addDays(day, w * -7))
    .map(day => day.toISOString().replace(/T(.+)Z/i, 'T00:00:00.000Z'))

  return {
    start,
    end,
    query: {
      $and: [{ date: { $gte: start } }, { date: { $lte: end } }]
    }
  }
}

const zeroPad = num => (num.toString().length < 2 ? `0${num}` : num)

const fedHolidays = (...rangeStr) => {
  const range = rangeStr.map(x => new Date(x))
  const options = { shiftSaturdayHolidays: true, shiftSundayHolidays: true }
  const holidays = fedHolidayList.inRange(...range, options)
  const blacklist = [
    'Birthday of Martin Luther King, Jr.',
    "Washington's Birthday",
    'Columbus Day',
    'Veterans Day'
  ]
  const filtered = holidays
    .filter(({ name }) => !blacklist.includes(name))
    .map(({ name, date }) => ({ name, date }))
  const thanksgiving = filtered.find(({ name }) =>
    name.includes('Thanksgiving')
  )
  if (!!thanksgiving) {
    const blackFriday = {
      name: 'Black Friday',
      date: addDays(thanksgiving.date, 1)
    }
    return [...filtered, blackFriday].map(({ date }) => date)
  }
  return filtered.map(({ date }) => date)
}

// PDF Filler

// // bool handling
// const isBool = v => typeof v === 'boolean'
// const checkbox = v => (v ? 'Yes' : false)
// const handleVal = v => (isBool(v) ? checkbox(v) : v)

// // create formatter
// const keyReducer = (ac, [k, v]) => ({ ...ac, [k]: handleVal(v) })
// const formatPdfKeys = data => Object.entries(data).reduce(keyReducer, {})

// // append method
// pdfFiller.fill = (src, out, data, callback) =>
//   pdfFiller.fillForm(src, out, formatPdfKeys(data), callback)

module.exports = {
  addDays,
  addMonths,
  getPrevWeek,
  zeroPad,
  zeroHour,
  fedHolidays
  // pdfFiller
}

// console.log(getPrevWeek().start, getPrevWeek().end)
// console.log(getPrevWeek(2).start, getPrevWeek(2).end)
// console.log(getPrevWeek(3).start, getPrevWeek(3).end)
// console.log(getPrevWeek(4).start, getPrevWeek(4).end)
// console.log(getPrevWeek(5).start, getPrevWeek(5).end)
// console.log(getPrevWeek(6).start, getPrevWeek(6).end)
