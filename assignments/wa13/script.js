

console.log("JavaScript Assignment - Employee Data");
console.log("------------------------------------");

// Problem 1: Create JSON for each employee
console.log("// Problem 1: Create JSON for employees");

let employees = [
    {
        firstName: "Sam",
        department: "Tech",
        designation: "Manager",
        salary: 40000,
        raiseEligible: true
    },
    {
        firstName: "Mary",
        department: "Finance",
        designation: "Trainee",
        salary: 18500,
        raiseEligible: true
    },
    {
        firstName: "Bill",
        department: "HR",
        designation: "Executive",
        salary: 21200,
        raiseEligible: false
    }
];

console.log(employees);

// Problem 2: Create JSON for the company
console.log("\n// Problem 2: Create JSON for the company");

let company = {
    companyName: "Tech Stars",
    website: "www.techstars.site",
    employees: employees
};

console.log(company);

// Problem 3: Add a new employee
console.log("\n// Problem 3: Add a new employee");

// Create new employee
let newEmployee = {
    firstName: "Anna",
    department: "Tech",
    designation: "Executive",
    salary: 25600,
    raiseEligible: false
};

employees.push(newEmployee);


console.log(company);

// Problem 4: Calculate total salary
console.log("\n// Problem 4: Calculate total salary");

function calculateTotalSalary(company) {
    let totalSalary = 0;
    
    for (let i = 0; i < company.employees.length; i++) {
        totalSalary += company.employees[i].salary;
    }
    
    return totalSalary;
}

let totalSalary = calculateTotalSalary(company);
console.log("Total Salary: $" + totalSalary);

// Problem 5: Process raises for eligible employees
console.log("\n// Problem 5: Process raises for eligible employees");

function processRaises(company) {
    
    let initialTotal = calculateTotalSalary(company);
    
    for (let i = 0; i < company.employees.length; i++) {
        if (company.employees[i].raiseEligible) {
            // Increase salary by 10%
            company.employees[i].salary *= 1.1;
           
            company.employees[i].salary = Math.round(company.employees[i].salary * 100) / 100;
            
            company.employees[i].raiseEligible = false;
        }
    }
    
    // Calculate total
    let newTotal = calculateTotalSalary(company);
    console.log("Company after raises:", company);
    console.log("Salary before raises: $" + initialTotal);
    console.log("Salary after raises: $" + newTotal);
}

processRaises(company);

// Problem 6: Update work from home status
console.log("\n// Problem 6: Update work from home status");

function updateWorkFromHomeStatus(company, workFromHomeEmployees) {
    
    for (let i = 0; i < company.employees.length; i++) {
        company.employees[i].wfh = false;
    }
    
   
    for (let i = 0; i < company.employees.length; i++) {
        if (workFromHomeEmployees.includes(company.employees[i].firstName)) {
            company.employees[i].wfh = true;
        }
    }
}

let workFromHomeEmployees = ["Anna", "Sam"];
updateWorkFromHomeStatus(company, workFromHomeEmployees);

console.log("Company with WFH status:", company);