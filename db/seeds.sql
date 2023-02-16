INSERT INTO department (name)
VALUES ("Intern"),
       ("Assets protection"),
       ("Project Management"),
       ("Human Resources"),
       ("Marketing");

-- list of role tites, salaries, and department id's added to role table
INSERT INTO role (title, salary, department_id)
VALUES ("Team Lead", 80000, 3),
       ("Human Resources Expert", 70000, 4),
       ("Sales Person", 60000, 5),
       ("Security", 50000, 2),
       ("Intern", 20000, 1);

-- list of employee names, role id's and managers added to employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Phil", "Collins", 5, null),
       ("Keith", "Cozart", 4, null),
       ("Noah", "Smith", 3, null),
       ("Jordan", "Carter", 1, 1),
       ("Bobby", "Sandimanie", 2, null);