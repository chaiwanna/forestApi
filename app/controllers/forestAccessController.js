const router = require('express').Router();
const { check } = require('express-validator');
const { forestAccessModel } = require('../models/forestAccessModel');
const { forestDetailModel } = require('../models/forestDetailModel');
const { userModel } = require('../models/newUserModel');
const { validateRequest, handleCustomValidationError, handleNotFound, handleSuccess } = require('../helpers/response');

const model = new forestAccessModel();
const userModelQuery = new userModel();
const forestDetailModelQuery = new forestDetailModel();

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
      page: 1,
      per_page: 10,
      total: returnData.length,
      total_pages: 1,
      data: returnData
    };

    return handleSuccess(res, '', paginateData);
  } catch (ex) {
    return handleNotFound(res, ex);
  }
};

async function getPaginateData(req) {
  const filter = req.body;
  let condition = 'where 1';
  if (filter.filter && filter.filter.date_from) {
    condition += ` and time >= '${filter.filter.date_from}'`;
    delete filter.filter.date_from;
  }
  if (filter.filter && filter.filter.date_too) {
    condition += ` and time <= '${filter.filter.date_too}'`;
    delete filter.filter.date_too;
  }
  condition += ` order by time desc`;
  var data = await model.customQuery(['*'], condition);
  // add relation data
  for (const key in data) {
    let userId = await userModelQuery.getById(data[key].user_id);
    data[key].user = userId ? userId : null;

    let fDetail = await forestDetailModelQuery.getById(data[key].forest_detail_id);
    data[key].forest_detail = fDetail ? fDetail : null;
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

module.exports = {
  getAll,
  getById,
  insert,
  getDataPaginate,
  getPaginateData,
  deleteById
};
