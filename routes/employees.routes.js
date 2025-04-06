const express = require('express');
const router = express.Router();
const Employe = require('../models/employe.model');

router.get('/employees', async (req, res) => {
  try {
    const employees = await Employe.find();
    res.json(employees);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/employees/random', async (req, res) => {
  try {
    const count = await Employe.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const employee = await Employe.findOne().skip(rand);
    if(!employee) res.status(404).json({ message: 'Not found' });
    else res.json(employee);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/employees/:id', async (req, res) => {
  try {
    const employee = await Employe.findById(req.params.id);
    if(!employee) res.status(404).json({ message: 'Not found' });
    else res.json(employee);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.post('/employees', async (req, res) => {
  try {
    const { firstName, lastName, department } = req.body;
    const newEmployee = new Employe({ firstName, lastName, department });
    await newEmployee.save();
    res.json({ message: 'OK' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.put('/employees/:id', async (req, res) => {
  try {
    const { firstName, lastName, department } = req.body;
    await Employe.updateOne({ _id: req.params.id }, { $set: { firstName, lastName, department }});
    res.json({ message: 'OK' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/employees/:id', async (req, res) => {
  try {
    const employee = await Employe.findById(req.params.id);
    if(employee) {
      await Employe.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
