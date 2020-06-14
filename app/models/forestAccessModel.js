const baseModel = require('./baseModel');

class forestAccessModel extends baseModel.baseModel {
  constructor() {
    const table_name = 'forest_access';
    const table_col = ['user_id', 'time', 'objective', 'forest_detail_id', 'other', 'status_id'];
    super(table_name, table_col);
  }
}

module.exports = { forestAccessModel };
