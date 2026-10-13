// ================================
// Meeting Cost Meter
// ================================


// Store employees
let employees = [];


// Meeting variables
let meetingRunning = false;

let startTime = null;

let timer = null;

let elapsedSeconds = 0;


// Get HTML elements
const employeeName = document.getElementById("employeeName");

const employeeSalary = document.getElementById("employeeSalary");

const addEmployeeBtn = document.getElementById("addEmployeeBtn");

const employeeList = document.getElementById("employeeList");

const meetingDuration = document.getElementById("meetingDuration");

const startBtn = document.getElementById("startBtn");

const stopBtn = document.getElementById("stopBtn");

const resetBtn = document.getElementById("resetBtn");

const liveCost = document.getElementById("liveCost");

const meetingStatus = document.getElementById("meetingStatus");

const totalEmployees = document.getElementById("totalEmployees");

const costPerMinute = document.getElementById("costPerMinute");

const elapsedTime = document.getElementById("elapsedTime");

const totalCost = document.getElementById("totalCost");

const summary = document.getElementById("summary");

const chart = document.getElementById("chart");

const themeBtn = document.getElementById("themeBtn");

const exportBtn = document.getElementById("exportBtn");


// ======================================
// Add Employee
// ======================================

addEmployeeBtn.addEventListener("click", function () {

    let name = employeeName.value.trim();

    let salary = Number(employeeSalary.value);


    if (name === "" || salary <= 0) {

        alert("Please enter a valid employee name and salary.");

        return;
    }


    let employee = {

        id: Date.now(),

        name: name,

        salary: salary

    };


    employees.push(employee);


    employeeName.value = "";

    employeeSalary.value = "";


    displayEmployees();

    updateDashboard();

});


// ======================================
// Display Employees
// ======================================

function displayEmployees() {

    employeeList.innerHTML = "";


    employees.forEach(function (employee) {

        let div = document.createElement("div");

        div.className = "employee";


        div.innerHTML = `

            <div class="employee-info">

                <strong>${employee.name}</strong>

                <span>
                    Salary: ₹${employee.salary.toLocaleString("en-IN")} / month
                </span>

            </div>

            <button
                class="delete-btn"
                onclick="deleteEmployee(${employee.id})"
            >
                Delete
            </button>

        `;


        employeeList.appendChild(div);

    });


    if (employees.length === 0) {

        employeeList.innerHTML =
            "<p>No employees added yet.</p>";

    }
}


// ======================================
// Delete Employee
// ======================================

function deleteEmployee(id) {

    employees = employees.filter(function (employee) {

        return employee.id !== id;

    });


    displayEmployees();

    updateDashboard();

}


// ======================================
// Calculate Total Cost Per Minute
// ======================================

function calculateTotalCostPerMinute() {

    let total = 0;


    employees.forEach(function (employee) {

        // 22 working days × 8 hours × 60 minutes
        let workingMinutes = 22 * 8 * 60;


        let employeeCostPerMinute =
            employee.salary / workingMinutes;


        total += employeeCostPerMinute;

    });


    return total;

}


// ======================================
// Update Dashboard
// ======================================

function updateDashboard() {

    let costMinute = calculateTotalCostPerMinute();


    totalEmployees.innerText = employees.length;


    costPerMinute.innerText =
        "₹" + costMinute.toFixed(2);


    updateChart();

    updateSummary();

}


// ======================================
// Start Meeting
// ======================================

startBtn.addEventListener("click", function () {

    if (employees.length === 0) {

        alert("Please add at least one employee.");

        return;
    }


    if (meetingRunning) {

        return;

    }


    meetingRunning = true;

    startTime = Date.now();

    elapsedSeconds = 0;


    meetingStatus.innerText =
        "🟢 Meeting is running";


    startBtn.disabled = true;


    timer = setInterval(updateLiveMeeting, 1000);

});


// ======================================
// Live Meeting Counter
// ======================================

function updateLiveMeeting() {

    elapsedSeconds++;


    let minutes =
        Math.floor(elapsedSeconds / 60);

    let seconds =
        elapsedSeconds % 60;


    elapsedTime.innerText =
        minutes + ":" +
        String(seconds).padStart(2, "0");


    let costMinute =
        calculateTotalCostPerMinute();


    let currentCost =
        (elapsedSeconds / 60) * costMinute;


    liveCost.innerText =
        "₹" + currentCost.toFixed(2);


    totalCost.innerText =
        "₹" + currentCost.toFixed(2);


    updateSummary();

}


// ======================================
// Stop Meeting
// ======================================

stopBtn.addEventListener("click", function () {

    if (!meetingRunning) {

        return;

    }


    clearInterval(timer);


    meetingRunning = false;


    meetingStatus.innerText =
        "🔴 Meeting stopped";


    startBtn.disabled = false;


    updateSummary();

});


// ======================================
// Reset
// ======================================

resetBtn.addEventListener("click", function () {

    clearInterval(timer);


    meetingRunning = false;

    startTime = null;

    elapsedSeconds = 0;


    liveCost.innerText = "₹0.00";

    totalCost.innerText = "₹0.00";

    elapsedTime.innerText = "0:00";

    meetingStatus.innerText =
        "Meeting not started";


    startBtn.disabled = false;


    employees = [];


    employeeName.value = "";

    employeeSalary.value = "";

    meetingDuration.value = "";


    displayEmployees();

    updateDashboard();

});


// ======================================
// Meeting Summary
// ======================================

function updateSummary() {

    if (employees.length === 0) {

        summary.innerHTML =
            "<p>Add employees to create a meeting summary.</p>";

        return;

    }


    let costMinute =
        calculateTotalCostPerMinute();


    let currentCost =
        (elapsedSeconds / 60) * costMinute;


    let minutes =
        Math.floor(elapsedSeconds / 60);


    let seconds =
        elapsedSeconds % 60;


    summary.innerHTML = `

        <p>
            👥 <strong>Participants:</strong>
            ${employees.length}
        </p>

        <p>
            ⏱️ <strong>Meeting Time:</strong>
            ${minutes} minutes ${seconds} seconds
        </p>

        <p>
            💰 <strong>Cost Per Minute:</strong>
            ₹${costMinute.toFixed(2)}
        </p>

        <p>
            💵 <strong>Current Meeting Cost:</strong>
            ₹${currentCost.toFixed(2)}
        </p>

    `;

}


// ======================================
// Cost Chart
// ======================================

function updateChart() {

    chart.innerHTML = "";


    if (employees.length === 0) {

        chart.innerHTML =
            "<p>Add employees to see the cost distribution.</p>";

        return;

    }


    let maxCost = 0;


    employees.forEach(function (employee) {

        let cost =
            employee.salary / (22 * 8 * 60);


        if (cost > maxCost) {

            maxCost = cost;

        }

    });


    employees.forEach(function (employee) {

        let employeeCost =
            employee.salary / (22 * 8 * 60);


        let percentage =
            (employeeCost / maxCost) * 100;


        let row = document.createElement("div");

        row.className = "chart-row";


        row.innerHTML = `

            <div class="chart-info">

                <span>${employee.name}</span>

                <span>
                    ₹${employeeCost.toFixed(2)} / min
                </span>

            </div>


            <div class="chart-bar">

                <div
                    class="chart-fill"
                    style="
                        width: ${percentage}%;
                        background: #2563eb;
                    "
                ></div>

            </div>

        `;


        chart.appendChild(row);

    });

}


// ======================================
// Dark Mode
// ======================================

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark");


    if (document.body.classList.contains("dark")) {

        themeBtn.innerText = "☀️ Light Mode";

    } else {

        themeBtn.innerText = "🌙 Dark Mode";

    }

});


// ======================================
// Export Meeting Report
// ======================================

exportBtn.addEventListener("click", function () {

    if (employees.length === 0) {

        alert("Please add employees before exporting.");

        return;

    }


    let costMinute =
        calculateTotalCostPerMinute();


    let currentCost =
        (elapsedSeconds / 60) * costMinute;


    let minutes =
        Math.floor(elapsedSeconds / 60);


    let seconds =
        elapsedSeconds % 60;


    let report = `

MEETING COST METER
==============================

Meeting Report

Number of Employees:
${employees.length}

Meeting Duration:
${minutes} minutes ${seconds} seconds

Cost Per Minute:
₹${costMinute.toFixed(2)}

Total Meeting Cost:
₹${currentCost.toFixed(2)}


EMPLOYEE DETAILS
==============================

`;


    employees.forEach(function (employee, index) {

        let employeeCost =
            employee.salary / (22 * 8 * 60);


        report += `

${index + 1}. ${employee.name}

Monthly Salary:
₹${employee.salary.toLocaleString("en-IN")}

Cost Per Minute:
₹${employeeCost.toFixed(2)}

`;

    });


    report += `

==============================

Generated by Meeting Cost Meter

`;


    let blob =
        new Blob([report], {
            type: "text/plain"
        });


    let url =
        URL.createObjectURL(blob);


    let link =
        document.createElement("a");


    link.href = url;

    link.download = "meeting-report.txt";


    link.click();


    URL.revokeObjectURL(url);

});


// ======================================
// Initial Display
// ======================================

displayEmployees();

updateDashboard();