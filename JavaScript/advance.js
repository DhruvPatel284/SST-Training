//---- functions ----
// --- this KEYWORD ---

let userProfile = {
  name: "Dhruv",
  city: "Ahmedabad",
  getDetails: function () {
    console.log(this.name + " lives in " + this.city);
  }
};

userProfile.getDetails();


// --- IIFE (Immediately Invoked Function Expression) ---
(function () {
  let appName = "College Portal";
  console.log(appName + " started");
})();


// --- CALL ---

function showInfo(state, country) {
  console.log(this.name + " from " + state + ", " + country);
}

let student1 = {
  name: "Amit"
};

showInfo.call(student1, "Gujarat", "India");


// --- BIND ---

let student2 = {
  name: "Rahul"
};

let boundFunction = showInfo.bind(student2, "Maharashtra", "India");

boundFunction();


// --- CLOSURES ---

function feeCalculator() {
  let baseFee = 5000;

  function addGST() {
    baseFee = baseFee + 100;
    return baseFee;
  }

  return addGST;
}

let finalFee = feeCalculator();
console.log(finalFee());
console.log(finalFee())

// --- CLASSES ---


// --- INHERITANCE ---


class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    console.log("Hello, my name is " + this.name);
  }
}

class Student extends Person {
  constructor(name, course) {
    super(name); 
    this.course = course;
  }

  getCourse() {
    console.log(this.name + " studies " + this.course);
  }
}

let studentA = new Student("Amit", "IT");
studentA.greet();
studentA.getCourse();


// --- STATIC ---

class College {
  static getCollegeName() {
    console.log("Government Engineering College");
  }
}

College.getCollegeName();


// --- ASYNCHRONOUS JAVASCRIPT ---


// --- CALLBACKS ---

function fetchData(callback) {
  setTimeout(function () {
    callback("Data received from server");
  }, 1000);
}

fetchData(function (message) {
  console.log(message);
});


// --- PROMISES ---

function fetchUserData() {
  return new Promise(function (resolve, reject) {
    let success = true;

    setTimeout(function () {
      if (success) {
        resolve("User data loaded");
      } else {
        reject("Error loading data");
      }
    }, 1000);
  });
}

fetchUserData()
  .then(function (result) {
    console.log(result);
  })
  .catch(function (error) {
    console.log(error);
  });


// --- ASYNC / AWAIT ---

async function loadData() {
  try {
    let response = await fetchUserData();
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

loadData();

