const baseModel = require('./baseModel');

class forestDetailModel extends baseModel.baseModel {
  constructor() {
    const table_name = 'forest_detail';
    const table_col = ['name', 'area', 'latitude', 'longitude'];
    super(table_name, table_col);
  }
}

module.exports = { forestDetailModel };
