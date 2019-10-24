const fedHolidayList = require('@18f/us-federal-holidays')

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

// argument is number of weeks before today, defaults to last week (1)
const getPrevWeek = (w = 1) => {
  const today = new Date(new Date().setHours(12))
  const dow = today.getDay()
  const daysToWeekStart = !dow ? w * -7 : w * (-6 - dow)
  const weekStart = addDays(today, daysToWeekStart).toISOString()
  const weekEnd = addDays(today, daysToWeekStart + 6).toISOString()
  return { weekStart, weekEnd }
}

const zeroPad = num => (num.toString().length < 2 ? `0${num}` : num)

const fedHolidays = year => {
  const options = { shiftSaturdayHolidays: true, shiftSundayHolidays: true }
  const holidays = fedHolidayList.allForYear(year, options)
  const blacklist = [
    'Birthday of Martin Luther King, Jr.',
    "Washington's Birthday",
    'Columbus Day',
    'Veterans Day'
  ]
  const filtered = holidays.filter(({ name }) => !blacklist.includes(name))
  const thanksgiving = filtered.find(({ name }) =>
    name.includes('Thanksgiving')
  )
  const blackFriday = {
    name: 'Black Friday',
    date: addDays(thanksgiving.date, 1)
  }
  return [...filtered, blackFriday].map(({ name, date }) => ({ name, date }))
}

module.exports = {
  addDays,
  addMonths,
  getPrevWeek,
  zeroPad,
  fedHolidays
}
