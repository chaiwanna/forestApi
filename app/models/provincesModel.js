const baseModel = require('./baseModel');

class provincesModel extends baseModel.baseModel {
  constructor() {
    const table_name = 'provinces';
    const table_col = ['id', `code`, `name_in_thai`, `name_in_english`];
    super(table_name, table_col);
  }
}

module.exports = { provincesModel };
