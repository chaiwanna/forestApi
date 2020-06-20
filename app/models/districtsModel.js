const baseModel = require('./baseModel');

class districtsModel extends baseModel.baseModel {
  constructor() {
    const table_name = 'districts';
    const table_col = ['id', `code`, `name_in_thai`, `name_in_english`, `province_id`];
    super(table_name, table_col);
  }
}

module.exports = { districtsModel };
