const baseModel = require('./baseModel');

class subdistrictsModel extends baseModel.baseModel {
  constructor() {
    const table_name = 'subdistricts';
    const table_col = [
      `id`,
      `code`,
      `name_in_thai`,
      `name_in_english`,
      `latitude`,
      `longitude`,
      `district_id`,
      `zip_code`
    ];
    super(table_name, table_col);
  }
}

module.exports = { subdistrictsModel };
