const mongoose = require('mongoose');
const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;

describe('Employee', () => {

  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    } catch (err) {
      console.error(err);
    }
  });

  describe('Reading data', () => {

    before(async () => {
      await Department.deleteMany();
      await Employee.deleteMany();
      const dep = await new Department({ name: 'Human Resources' }).save();
      await new Employee({ firstName: 'John', lastName: 'Doe', department: dep._id }).save();
      await new Employee({ firstName: 'Jane', lastName: 'Smith', department: dep._id }).save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(2);
    });

    it('should return proper document by various params with "findOne" method', async () => {
      const employee = await Employee.findOne({ firstName: 'John', lastName: 'Doe' });
      expect(employee).to.not.be.null;
      expect(employee.firstName).to.be.equal('John');
    });

    after(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });
  });

  describe('Creating data', () => {

    before(async () => {
      await Department.deleteMany();
      await Employee.deleteMany();
    });

    it('should insert new document with "insertOne" method', async () => {
      const dep = await new Department({ name: 'Finance' }).save();
      const emp = new Employee({ firstName: 'Anna', lastName: 'Kowalska', department: dep._id });
      await emp.save();
      expect(emp.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });
  });

  describe('Updating data', () => {

    let dep;

    beforeEach(async () => {
      await Department.deleteMany();
      await Employee.deleteMany();
      dep = await new Department({ name: 'Tech Team' }).save();
      await new Employee({ firstName: 'Alice', lastName: 'Cooper', department: dep._id }).save();
      await new Employee({ firstName: 'Bob', lastName: 'Marley', department: dep._id }).save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'Alice' }, { $set: { lastName: 'Updated' } });
      const updated = await Employee.findOne({ lastName: 'Updated' });
      expect(updated).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const emp = await Employee.findOne({ firstName: 'Alice' });
      emp.lastName = 'Changed';
      await emp.save();
      const updated = await Employee.findOne({ lastName: 'Changed' });
      expect(updated).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { lastName: 'UpdatedAll' } });
      const updated = await Employee.find({ lastName: 'UpdatedAll' });
      expect(updated.length).to.be.equal(2);
    });
  });

  describe('Removing data', () => {

    beforeEach(async () => {
      await Department.deleteMany();
      await Employee.deleteMany();
      const dep = await new Department({ name: 'Testing Dep' }).save();
      await new Employee({ firstName: 'A', lastName: 'B', department: dep._id }).save();
      await new Employee({ firstName: 'C', lastName: 'D', department: dep._id }).save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'A' });
      const removed = await Employee.findOne({ firstName: 'A' });
      expect(removed).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const all = await Employee.find();
      expect(all.length).to.be.equal(0);
    });
  });

  describe('Populating data', () => {

    before(async () => {
      await Department.deleteMany();
      await Employee.deleteMany();
      const dep = await new Department({ name: 'PopulatedDept' }).save();
      await new Employee({ firstName: 'Paul', lastName: 'Walker', department: dep._id }).save();
    });

    it('should populate the department field', async () => {
      const emp = await Employee.findOne({ firstName: 'Paul' }).populate('department');
      expect(emp.department.name).to.equal('PopulatedDept');
    });

    after(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });
  });
});
