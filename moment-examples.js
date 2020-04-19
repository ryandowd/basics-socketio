const moment = require('moment');
const now = moment(); // Get current moment

console.log(now.format()); // Output current time
console.log(now.format('X')); // Output unix time as string
console.log(now.format('x')); // Output unix time in js unix format as string (i.e. with milliseconds)
console.log(now.valueOf()); // Output unix time as number

const timestamp = 1587131867149;
const timestampMoment = moment.utc(timestamp); // Pass moment.utc() a unix timestamp to turn a unix time into a moment obj

console.log(timestampMoment.format('h:mm a')); // Format as generic moment string
console.log(timestampMoment.local().format('h:mm a')); // Calculates the time using local computer time, then formats as generic moment string

// now.subtract(1, 'year'); // Subtract a year from the now obj

// console.log(now.format('h:mma')); // 6:45pm
// console.log(now.format('MMM Do YYYY, h:mma')); // // April 17th 2020, 2:12 pm
