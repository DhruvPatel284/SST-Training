// --- VARIABLES ---

var city = "Delhi";

let age = 21;

const country = "India";


// --- OPERATORS ---

let ele1 = 10;
let ele2 = 3;

// Addition
let sum = ele1 + ele2;

// Multiplication
let product = ele1 * ele2;

// Division
let division = ele1 / ele2;


// --- STRINGS ---

// String values
let firstName = "Dhruv";
let lastName = "Patel";

// String concatenation
let fullName = firstName + " " + lastName;


// --- NUMBERS ---

let price = 500;
let gst = 50;

// Total amount
let totalAmount = price + gst;


// --- IF CONDITION ---

let marks = 45;

if (marks >= 40) {
  console.log("Pass");
} else {
  console.log("Fail");
}


// --- LOOPS ---

// for loop
for (let i = 1; i <= 3; i++) {
  console.log("Count:", i);
}


// --- FUNCTIONS ---

// Function to greet
function greetUser(name) {
  console.log("Hello " + name);
}

greetUser("Amit");


// --- OBJECTS ---

let student = {
  name: "Rahul",
  age: 20,
  course: "IT"
};

console.log(student.name);


// --- ARRAYS ---

// Array of fruits
let fruits = ["Apple", "Banana", "Mango",["",""]];
console.log(fruits[0][0]);


// --- DATES ---

// Current date
let today = new Date();
let independenceDay = new Date("2025-08-15");

console.log(today);
console.log(independenceDay);

// --- SETS ---

let rollNumbers = new Set();

rollNumbers.add(101);
rollNumbers.add(102);
rollNumbers.add(101); 

console.log(rollNumbers);


// --- MAPS ---
let studentMarks = new Map();

studentMarks.set("Rahul", 85);
studentMarks.set("Amit", 90);

console.log(studentMarks.get("Rahul"));


// --- FOR...IN LOOP ---

let student2 = {
  name: "Dhruv",
  age: 21,
  course: "IT"
};

for (let key in student) {
  console.log(key + ":", student[key]);
}


// --- FOR...OF LOOP ---

for (let fruit of fruits) {
  console.log(fruit);
}


// --- ITERABLES ---

let numbers = [10, 20, 30];

for (let num of numbers) {
  console.log(num);
}

// --- GENERATORS ---

// Generator function
function* ticketNumber() {
  yield 1;
  yield 2;
  yield 3;
}

let generator = ticketNumber();

console.log(generator.next());
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());

// --- MATH ---

// Math object (built-in)

// Round a number
let price1 = 99.6;
let roundedPrice = Math.round(price1);

// Find maximum value
let maxMarks = Math.max(78, 85, 90);

// Square root
let result = Math.sqrt(16);

console.log(roundedPrice);
console.log(maxMarks);
console.log(result);


// --- REGULAR EXPRESSIONS (RegExp) ---

let mobilePattern = /^[6-9]\d{9}$/;

let mobile1 = "9876543210";
let mobile2 = "1234567890";

console.log(mobilePattern.test(mobile1)); // true
console.log(mobilePattern.test(mobile2)); // false

let text = "I live in India";
let pattern = /India/;

console.log(pattern.test(text));


// --- ERROR TYPES ---

// 1. ReferenceError
try {
  console.log(myValue); 
} catch (error) {
  console.log("ReferenceError occurred");
}


// 2. TypeError
try {
  let num = 10;
  num(); 
} catch (error) {
  console.log("TypeError occurred");
}


// 3. SyntaxError 
// let a = ;   // invalid syntax


// 4. RangeError
try {
  let arr = new Array(-5); // invalid array length
} catch (error) {
  console.log("RangeError occurred");
}


// 5. Custom Error
try {
  let age = 15;

  if (age < 18) {
    throw new Error("Not eligible to vote");
  }
} catch (error) {
  console.log(error.message);
}


// --- MAP ---

let pricesList = [100, 200, 300];

let pricesWithGST = pricesList.map(function (p) {
  return p + (p * 18) / 100;
});

console.log(pricesWithGST);


// --- FILTER ---

let marksList = [35, 42, 55, 28, 60];

let passedStudents = marksList.filter(function (m) {
  return m >= 40;
});

console.log(passedStudents);


// --- REDUCE ---

let expenses = [150, 300, 200];

let totalExpense = expenses.reduce(function (total, value) {
  return total + value;
}, 0);

console.log(totalExpense);

