const router = require('express').Router();
const { check } = require('express-validator');
const { forestDetailModel } = require('../models/forestDetailModel');
const { validateRequest, handleCustomValidationError, handleNotFound, handleSuccess } = require('../helpers/response');

const model = new forestDetailModel();

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
    let data = await model.getAll();
    console.log(data);
    // return handleSuccess(res, '', (await model.getAll()));
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
