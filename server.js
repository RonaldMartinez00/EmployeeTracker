const inquirer = require('inquirer');
const mysql = require('mysql');
const db = mysql.createConnection({
    user: 'root',
    password: 'rootroot16',
    database: 'business_db'
});

const menu= [
    {
        type: 'list',
        name: 'Menu',
        message: "What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Exit",
        ]
    },
];
const addDepartment = [
    {
        type: 'input',
        name: 'newDepartment',
        message: "Enter the name of the department.",
    },
]

function start() {     
    inquirer.prompt(menu).then((response) => {
        if (response.Menu === "View all departments") {
            allDepts();
        } else if (response.Menu === "View all roles") {
            allRoles();
        } else if (response.Menu === "View all employees") {
            allEmps();
        } else if (response.Menu === "Add a department") {
            addDept();
        } else if (response.Menu === "Add a role") {
            addNewRoles();
        } else if (response.Menu === "Add an employee") {
            addEmp();
        } else if (response.Menu === "Update an employee role") {
            updateRole();
        } else {
            db.end();
            console.log('Thank you.');
        }
    });
};

// Display all content in the department table, then call the start function again for more options
allDepts = () => {     
    db.query(`SELECT * FROM department;`, (err, result) => {
    if (err) throw err;
    console.table(result);
    start();
});};


allRoles = () => {
    db.query(`SELECT role.title, role.id, department.name, department.id, role.salary FROM role JOIN department ON role.department_id = department.id;`, (err, result) => {
        if (err) throw err;
        console.table(result);
        start();
    });
};


allEmps = () => { 
    db.query(`SELECT a.id, a.first_name, a.last_name, role.title, role.id, department.name, department.id, role.salary, CONCAT(b.first_name, ' ', b.last_name) manager FROM employee a JOIN employee b ON a.manager_id = b.id JOIN role ON a.role_id = role.id JOIN department ON role.department_id = department.id;`, (err, result) => {
        if (err) throw err;
        console.table(result);
        start();
    });
};


addDept = () => {
    inquirer.prompt(addDepartment).then((response) => {
        console.log(response.newDepartment);
        db.query(`INSERT INTO department SET ?`, { name: response.newDepartment, }, (err, result) => {
            if (err) throw err;
            console.log(`${response.newDepartment} added successfully.`);
            start();
        })
    });
};


addNewRoles = () => { 
    db.query(`SELECT * FROM department;`, (err, result) => {
    if (err) throw err;
    // variable used to display all departments; used in prompt question below
    let departmentList = result.map(department => ({ name: department.name, value: department.id }));
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: "Enter the name of the role.",
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: "Enter the salary of the role.",
        },
        {
            type: 'list',
            name: 'roleDepartment',
            message: "Select the department that the role belongs to.",
            choices: departmentList,
        },
        ]).then((response) => {
            db.query(`INSERT INTO role SET ?`, { title: response.roleName, salary: response.roleSalary, department_id: response.roleDepartment, }, (err, result) => {
                if (err) throw err;
                console.log(`Role added successfully.`);
                start();
            })
        });
    })
};


addEmp = () => {
    db.query(`SELECT * FROM role;`, (err, result) => {
        if (err) throw err;
        let roleList = result.map(role => ({ name: role.title, value: role.id }));
        db.query(`SELECT * FROM employee;`, (err, result) => {
            if (err) throw err;
            let employeeList = result.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }));
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'employeeFirstName',
                    message: "Enter the first name of the employee.",
                },
                {
                    type: 'input',
                    name: 'employeeLastName',
                    message: "Enter the last name of the employee.",
                },
                {
                    type: 'list',
                    name: 'employeeRole',
                    message: "Select the role of the employee.",
                    choices: roleList,
                },
                {
                    type: 'list',
                    name: 'employeeManager',
                    message: "Select the employee's manager.",
                    choices: employeeList
                },
            ]).then((response) => {
                db.query(`INSERT INTO employee SET ?`, { first_name: response.employeeFirstName, last_name: response.employeeLastName, role_id: response.employeeRole, manager_id: response.employeeManager, }, (err, result) => {
                    if (err) throw err;
                    console.log(`Employee added successfully.`);
                    start();
                })
            });
        })
    })
};

updateRole = () => {
    db.query(`SELECT * FROM role;`, (err, result) => {
        if (err) throw err;
        let roleList = result.map(role => ({ name: role.title, value: role.id }));
        db.query(`SELECT * FROM employee;`, (err, result) => {
            if (err) throw err;
            let employeeList = result.map(employee => ({ name: employee.first_name + ' ' + employee.last_name, value: employee.id }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectEmployee',
                    message: "Select the employee whose role you would like to update.",
                    choices: employeeList,
                },
                {
                    type: 'list',
                    name: 'selectRole',
                    message: "Select an new role for the employee.",
                    choices: roleList,
                },
            ]).then((response) => {
                db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: response.selectRole,}, {id: response.selectEmployee,},], (err, result) => {
                    console.log
                    if (err) throw err;
                    console.log(`Employee updated successfully.`);
                    start();
                })
            });
        })
    })
};


start();