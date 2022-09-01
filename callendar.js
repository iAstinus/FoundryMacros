// Let`s get current date
let currentDateObj = SimpleCalendar.api.timestampToDate(SimpleCalendar.api.timestamp());
let monthsObj = SimpleCalendar.api.getAllMonths();
let weeksObj = SimpleCalendar.api.getAllWeekdays();
let currentDate = `${currentDateObj.year} TA, ${monthsObj[currentDateObj.month].name} ${currentDateObj.day + 1}, ${weeksObj[currentDateObj.dayOfTheWeek].name}`

console.log(currentDate);

// Lets modify text object
let calendarDrawning = Tagger.getByTag('calendar')[0];
calendarDrawning._object.data.text = currentDate;
calendarDrawning.data.text = currentDate;
calendarDrawning._object.control();
calendarDrawning._object.refresh();
calendarDrawning._object.release();
// await calendarDrawning._object.draw;

console.log('current text: ' + calendarDrawning._object.data.text );