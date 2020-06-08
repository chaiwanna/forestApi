const baseModel = require('./baseModel');

class forestAccessModel extends baseModel.baseModel {
  constructor() {
    const table_name = 'forest_access';
    const table_col = ['user_id', 'time', 'objective', 'forest_detail_id', 'other'];
    super(table_name, table_col);
  }
}

module.exports = { forestAccessModel };
