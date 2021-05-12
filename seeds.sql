USE employeedb;

INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Human Resources"), ("Legal"), ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES  ("Salesperson", "55,000", "1"), ("Software Developer", "65,000", "2"), 
("Lawyer", "95,000", "4"), ("Secretary", "35,000", "3"), ("Accountant", "75,000", "5"), ("Senior developer", "140,000", "2"), ('Payroll', '50,000', '5');

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Willy", "Loman", "1", "1"), ("Blake", "Ross", "2", "2"), 
("Bill", "Clinton", "4", "3"), ("Erin", "Brockovich", "3", "3"), ("Steven", "Buschemi", "3", "3"), ("Rob", "Lowe", "2", "2"), ('Debra', 'Jackson', '3', '2');