const Department = require('../models/department.model');

exports.getAll = async (req, res) => {
  try {
    const departments = await Department.find({});
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Department.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const department = await Department.findOne().skip(rand);
    if (!department) res.status(404).json({ message: 'Not found' });
    else res.json(department);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) res.status(404).json({ message: 'Not found' });
    else res.json(department);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const newDepartment = new Department({ name });
    await newDepartment.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.update = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedDepartment = await Department.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { name } },
      { new: true }
    );
    if (!updatedDepartment) res.status(404).json({ message: 'Not found' });
    else res.json(updatedDepartment);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.remove = async (req, res) => {
  try {
    const deletedDepartment = await Department.findOneAndDelete({ _id: req.params.id });
    if (!deletedDepartment) res.status(404).json({ message: 'Not found' });
    else res.json(deletedDepartment);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
