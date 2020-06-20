const router = require('express').Router();
const { check } = require('express-validator');
const { forestAccessModel } = require('../models/forestAccessModel');
const { forestDetailModel } = require('../models/forestDetailModel');
const { userModel } = require('../models/newUserModel');
const { provincesModel } = require('../models/provincesModel');
const { districtsModel } = require('../models/districtsModel');
const { subdistrictsModel } = require('../models/subdistrictsModel');
const { validateRequest, handleCustomValidationError, handleNotFound, handleSuccess } = require('../helpers/response');

const model = new forestAccessModel();
const userModelQuery = new userModel();
const forestDetailModelQuery = new forestDetailModel();
const provinceModelQuery = new provincesModel();
const subdistrictsModelQuery = new subdistrictsModel();
const districtsModelQuery = new districtsModel();

const getAll = async (req, res) => {
  try {
    return handleSuccess(res, '', await model.getAll());
  } catch (ex) {
    return handleNotFound(res, ex);
  }
};

const getById = async (req, res) => {
  try {
    return handleSuccess(res, '', await model.getById(req.params.id));
  } catch (ex) {
    return handleNotFound(res, ex);
  }
};

const insert = async (req, res) => {
  try {
    return handleSuccess(res, '', await model.getById(req.params));
  } catch (ex) {
    return handleNotFound(res, ex);
  }
};

const deleteById = async (req, res) => {
  try {
    return handleSuccess(res, '', await model.delete(req.params.id));
  } catch (ex) {
    return handleNotFound(res, ex);
  }
};

const getDataPaginate = async (req, res) => {
  try {
    const returnData = await getPaginateData(req);
    let paginateData = {
      limit: req.body.limit,
      data: returnData
    };

    return handleSuccess(res, '', paginateData);
  } catch (ex) {
    return handleNotFound(res, ex);
  }
};

async function getPaginateData(req) {
  const filter = req.body;
  let condition = `
    LEFT JOIN user ON user.id = forest_access.user_id
 LEFT JOIN provinces ON provinces.id = user.province
 LEFT JOIN districts ON districts.id = user.districts
 LEFT JOIN subdistricts ON subdistricts.id = user.subdistricts
 LEFT JOIN forest_detail ON forest_detail.id = forest_access.forest_detail_id
 where 1
    `;
  if (filter.filter && filter.filter.date_from) {
    condition += ` and time >= '${filter.filter.date_from}'`;
    delete filter.filter.date_from;
  }
  if (filter.filter && filter.filter.date_too) {
    condition += ` and time <= '${filter.filter.date_too}'`;
    delete filter.filter.date_too;
  }
  if (filter.search) {
    let work = [
      model,
      userModelQuery,
      forestDetailModelQuery,
      provinceModelQuery,
      subdistrictsModelQuery,
      districtsModelQuery
    ];

    let s = '0 ';

    work.forEach(element => {
      element.table_col.forEach(col => {
        s += ` or ${element.table_name}.${col} like '%${filter.search}%'`;
      });
    });

    condition = `${condition} AND (${s}) `;
  }

  condition = condition.replace(/\n/g, '');
  condition += `order by time desc`;

  if (filter.limit) {
    condition += ` limit ${filter.limit}`;
  }
  condition = condition.replace(`\n`, '');
  var data = await model.customQuery([model.table_name + '.*'], condition);
  // add relation data
  for (const key in data) {
    if (data[key].user_id) {
      let userId = await userModelQuery.getById(data[key].user_id);
      data[key].user = userId[0] ? userId[0] : null;
      if (data[key].user) {
        if (data[key].user.province) {
          let pro = await provinceModelQuery.getById(data[key].user.province);
          data[key].user.province_data = pro[0] ? pro[0] : null;
        }
        if (data[key].user.districts) {
          let dis = await districtsModelQuery.getById(data[key].user.districts);
          data[key].user.district_data = dis[0] ? dis[0] : null;
        }
        if (data[key].user.subdistricts) {
          let subdis = await subdistrictsModelQuery.getById(data[key].user.subdistricts);
          data[key].user.subdistrict_data = subdis[0] ? subdis[0] : null;
        }
      }
    }
    if (data[key].forest_detail_id) {
      let fDetail = await forestDetailModelQuery.getById(data[key].forest_detail_id);
      data[key].forest_detail = fDetail[0] ? fDetail[0] : null;
    }
  }
  if (filter.filter) {
    let returnData = [];
    for (const iterator of data) {
      let isFilter = true;
      for (const [key, value] of Object.entries(filter.filter)) {
        if (parseInt(iterator[key]) != parseInt(value)) {
          isFilter = false;
          break;
        }
      }
      if (isFilter) {
        returnData.push(iterator);
      }
    }
    return returnData;
  }
  return data;
}

const updateById = async (req, res) => {
  try {
    return handleSuccess(res, 'success', await model.update(req.params.id, req.body));
  } catch (ex) {
    return handleNotFound(res, ex);
  }
};

module.exports = {
  getAll,
  getById,
  insert,
  getDataPaginate,
  getPaginateData,
  deleteById,
  updateById
};
