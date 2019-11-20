const fedHolidayList = require('@18f/us-federal-holidays')
const pdfFiller = require('pdffiller')

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

const hourPad = (dateStr, high=false) => {
  const date = new Date(dateStr)
  const hourVals = high ? [23, 59, 59, 999] : [0, 0, 0, 0]
  date.setUTCHours(...hourVals)
  return date.toISOString()
}

// argument is number of weeks before today, defaults to last week (1)
const getPrevWeek = (w = 1) => {
  const today = new Date(new Date().setUTCHours(0,0,0))
  const dow = today.getDay()
  const offsetDate = addDays(today, (w - 1) * -7)
  const daysToStart = !dow ? -8 : (-7 - dow)
  const startDay = addDays(offsetDate, daysToStart)
  const endDay = addDays(offsetDate, daysToStart + 6)
  return { 
    weekStart: hourPad(startDay), 
    weekEnd: hourPad(endDay, true)
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

// bool handling
const isBool = v => typeof v === 'boolean'
const checkbox = v => (v ? 'Yes' : false)
const handleVal = v => isBool(v) ? checkbox(v) : v

// create formatter
const keyReducer = (ac, [k, v]) => ({ ...ac, [k]: handleVal(v) })
const formatPdfKeys = data => Object.entries(data).reduce(keyReducer, {})

// append method
pdfFiller.fill = (src, out, data, callback) =>
  pdfFiller.fillForm(src, out, formatPdfKeys(data), callback)

module.exports = {
  addDays,
  addMonths,
  getPrevWeek,
  zeroPad,
  fedHolidays,
  pdfFiller
}