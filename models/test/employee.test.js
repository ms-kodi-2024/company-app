const mongoose = require('mongoose');
const Employee = require('../employee.model');
const expect = require('chai').expect;

describe('Employee', () => {

  it('should throw an error if no required fields', () => {
    const emp = new Employee({});
    emp.validateSync(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if "firstName" or "lastName" is not a string', () => {
    const cases = [{ firstName: {}, lastName: 'Nowak', department: 'IT' },
                   { firstName: 'Anna', lastName: [], department: 'HR' }];
    for (let data of cases) {
      const emp = new Employee(data);
      emp.validateSync(err => {
        if (typeof data.firstName !== 'string') {
          expect(err.errors.firstName).to.exist;
        }
        if (typeof data.lastName !== 'string') {
          expect(err.errors.lastName).to.exist;
        }
      });
    }
  });

  it('should not throw an error if all fields are valid', () => {
    const emp = new Employee({ firstName: 'Anna', lastName: 'Nowak', department: 'HR' });
    emp.validateSync(err => {
      expect(err).to.not.exist;
    });
  });

  after(() => {
    mongoose.models = {};
  });

});
