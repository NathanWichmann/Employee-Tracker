const inquirer = require("inquirer");
const mysql = require("mysql");
const fs = require("fs");
const path = require("path");
const util = require("util");
const cTable = require("console.table");
const RawList = require("prompt-rawlist");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employeedb",
});
connection.connect((err) => {
  if (err) throw err;
  runSearch();
});

const runSearch = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Find Employee by Department",
        "Find Employee by Role",
        "Find all Employees",
        "Find Employee by Manager",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update Employee Role",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "Find Employee by Department":
          departmentSearch();
          break;

        case "Find Employee by Role":
          roleSearch();
          break;

        case "Find all Employees":
          employeeSearch();
          break;

        case "Find Employee by Manager":
          managerSearch();
          break;

        case "Add a Department":
          addDepartmentSearch();
          break;

        case "Add a Role":
          addRole();
          break;

        case "Add an Employee":
          addEmployeeSearch();
          break;

        case "Update Employee Role":
          updateRoleSearch();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

// join depaartment to employee
const departmentSearch = () => {
  const query = "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department from employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
};

const roleSearch = () => {
  const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title from employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
};
// find
const employeeSearch = () => {
  const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary from employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
};

const managerSearch = () => {
  const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager from employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
};

const addDepartmentSearch = () => {
  inquirer
    .prompt({
      name: "newDepartment",
      type: "input",
      message: "Please select a new Department.",
    })
    .then((answer) => {
      connection.query("INSERT INTO department (department.name) VALUES (?)", answer.newDepartment, (err, res) => {
        if (err) throw err; {
          console.log("Department change has been added.. good show");

          runSearch();
        }
      
    });
});
};



// steps
// 1. user needs to input string of new role ---> totally new values
// 2. user needs to input salary ---> ditto
// 3. user needs to select department ---> they need to select from the departments table

const addRole = () => {
  const query = "SELECT * FROM department;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    let NewDepartment = [];
    res.map((results) => {
      NewDepartment.push({
        name: results.name, 
        value: results.id
      });
    })
    // NewDepartment.push("new department");
    inquirer
      .prompt([
        {
          name: "name",
          type: "input",
          message: "What is the name of the role you'd like to add?",
        },
        {
          name: "salary",
          type: "input",
          message: "money.?", // salary question
        },
        {
          name: "department",
          type: "list",
          message: "Please select a new Department.?",
          choices: NewDepartment,
        },
      ])
      .then((res) => {
        //INSERT INTO employeedb.role ( title, salary, department_id)
        //values ("TestTitle", "60000000", 3);

        connection.query(
          `INSERT INTO employeedb.role ( title, salary, department_id) values ("${res.name}", "${res.salary}", ${res.department})`
          , (err, res) => {
            if (err) { 
              console.log(err)
            } else {
              runSearch();
            }
        });

        // let depart = res.NewDepartment
        // console.log(res)
      });
  });
};

const addEmployeeSearch = () => {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the Employees First Name?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the Employees Last Name?",
      },
    ])
    .then((res) => {
      console.log(res);
      let first = res.first_name;
      let last = res.last_name;

      const query = 'SELECT id, title, department_id FROM role';
      connection.query(query, (req, res) => {
        let role_choice = res.map((role) => ({
          name: role.title,
          value: role.id,
        }));

        inquirer
          .prompt({
            type: "list",
            name: "role",
            message: "What is the role assigned for employee?",
            choices: role_choice,
          })
          .then((res) => {
            console.log(res)
            // let role = res.role;

            if (err) throw err;
            console.table(res);
          });

      });
      // runSearch();

    });
};
