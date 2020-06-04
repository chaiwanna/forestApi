const { getPool, fetchWithPagination } = require('../helpers/database');

class baseModel {
  // table

  constructor(table_name, table_col) {
    this.table_name = table_name;
    this.table_col = table_col;
  }

  // // query

  getById = async id => {
    let result = false;
    query = `SELECT * FROM ${this.table_name} WHERE id = ${id}`;
    try {
      result = await (await getPool()).query(query);
    } catch (e) {
      throw e;
    }

    return {
      result: true,
      data: result
    };
  };

  getAll = async row => {
    let result = false;
    query = `SELECT * FROM ${this.table_name}`;
    try {
      result = await (await getPool()).query(query);
    } catch (e) {
      throw e;
    }

    return {
      result: true,
      data: result
    };
  };

  // insert() {

  // }

  // update() {

  // }

  // delete() {

  // }
}

module.exports = { baseModel };
