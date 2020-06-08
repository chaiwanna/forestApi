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

const getDataPaginate = async (req, res) => {
  try {
    var data = await model.getAll();
    // add relation data
    for (const key in data) {
      let userId = await userModelQuery.getById(data[key].user_id);
      data[key].user = userId ? userId : null;

      let fDetail = await forestDetailModelQuery.getById(data[key].forest_detail_id);
      data[key].forest_detail = fDetail ? fDetail : null;
    }

    let paginateData = {
      page: 1,
      per_page: 10,
      total: data.length,
      total_pages: 1,
      data: data
    };

    return handleSuccess(res, '', paginateData);
  } catch (ex) {
    return handleNotFound(res, ex);
  }
};

module.exports = {
  getAll,
  getById,
  insert,
  getDataPaginate
};
