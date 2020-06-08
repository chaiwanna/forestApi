const baseModel = require('./baseModel');

class userModel extends baseModel.baseModel {
  constructor() {
    const table_name = 'user';
    const table_col = [
      'id',
      'username',
      'first_name',
      'last_name',
      'auth_key',
      'auth_key_expired_at',
      'password_hash',
      'password_reset_token',
      'email',
      'confirmed_at',
      'registration_ip',
      'last_login_at',
      'last_login_ip',
      'blocked_at',
      'role',
      'enabled',
      'status',
      'created_at',
      'updated_at',
      'nick_name',
      'blood',
      'disease',
      'numhome',
      'nummoo',
      'province',
      'districts',
      'subdistricts',
      'postman',
      'tel',
      'numreg'
    ];
    super(table_name, table_col);
  }
}

module.exports = { userModel };
