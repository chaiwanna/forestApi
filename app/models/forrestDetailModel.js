const baseModel = require('./baseModel');

class forestDetailModel extends baseModel.baseModel {
  constructor() {
    const table_name = 'forest_detail';
    const table_col = ['name', 'area'];
    super(table_name, table_col);
  }
}
// const table_name = 'forest_detail'
// const table_col = ['name', 'area']

// let model = new baseModel.baseModel(table_name, table_col);
// console.log(model);

let model = new forestDetailModel();

model.getAll().then(res => {
  console.log(res.result);
});

module.exports = {};
