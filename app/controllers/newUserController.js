const router = require('express').Router();
const { check } = require('express-validator');
const { userModel } = require('../models/newUserModel');
const { validateRequest, handleCustomValidationError, handleNotFound, handleSuccess } = require('../helpers/response');

const model = new userModel();

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

module.exports = {
  getAll,
  getById,
  insert
};
