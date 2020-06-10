const { getPool, fetchWithPagination } = require('../helpers/database');

class baseModel {
  // table

  constructor(table_name, table_col) {
    this.table_name = table_name;
    this.table_col = table_col;
  }

  // query

  async getById(id) {
    let result;
    let query = `SELECT * FROM ${this.table_name} WHERE id = ${id}`;
    try {
      result = await (await getPool()).query(query);
    } catch (e) {
      throw e;
    }

    return result;
  }

  async getAll() {
    let result;
    let query = `SELECT * FROM ${this.table_name}`;
    try {
      result = await (await getPool()).query(query);
    } catch (e) {
      throw e;
    }

    return result;
  }

  async insert(param) {
    let result;
    let value = [];
    this.table_col.forEach(element => {
      param[element] ? value.push(param[element]) : value.push('');
    });
    let query = `INSERT INTO ${this.table_name}
      (${this.table_col.join()})
      VALUES (${value.join()})`;
    try {
      result = await (await getPool()).query(query);
    } catch (e) {
      throw e;
    }

    return result;
  }

  // async update(id) {

  // }

  // async delete(id) {

  // }
  async customQuery(select, condition) {
    let result;
    let query = `SELECT ${select.join()} FROM ${this.table_name} ${condition}`;
    console.log(query);

    try {
      result = await (await getPool()).query(query);
    } catch (e) {
      throw e;
    }

    return result;
  }
}

module.exports = { baseModel };
