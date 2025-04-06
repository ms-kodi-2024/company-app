const Employee = require('../models/employee.model');

exports.getAll = async (req, res) => {
  try {
    const employees = await Employee.find().populate('department');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const employee = await Employee.findOne().populate('department').skip(rand);
    if (!employee) res.status(404).json({ message: 'Not found' });
    else res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('department');
    if (!employee) res.status(404).json({ message: 'Not found' });
    else res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.create = async (req, res) => {
  try {
    const { firstName, lastName, department } = req.body;
    const newEmployee = new Employee({ firstName, lastName, department });
    await newEmployee.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.update = async (req, res) => {
  try {
    const { firstName, lastName, department } = req.body;
    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { firstName, lastName, department } },
      { new: true }
    );
    if (!updatedEmployee) res.status(404).json({ message: 'Not found' });
    else res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.remove = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findOneAndDelete({ _id: req.params.id });
    if (!deletedEmployee) res.status(404).json({ message: 'Not found' });
    else res.json(deletedEmployee);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
