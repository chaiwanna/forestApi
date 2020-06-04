const router = require('express').Router();
const { check } = require('express-validator');
const { onProvinces, onDistricts, onSubdistricts } = require('../models/countryModel');
const { validateRequest, handleCustomValidationError, handleNotFound, handleSuccess } = require('../helpers/response');

//หน้าลงทะเบียน
// router.get('/provinces',
const provinces = async (req, res) => {
  try {
    return handleSuccess(res, '', (await onProvinces()).data);
  } catch (ex) {
    return handleNotFound(res, `provinces does not exist in our database. ${ex}`);
  }
};
// router.get('/districts/:id',
const districts = async (req, res) => {
  try {
    return handleSuccess(res, '', (await onDistricts(req.params.id)).data);
  } catch (ex) {
    return handleNotFound(res, `districts does not exist in our database. ${ex}`);
  }
};
const subdistricts = async (req, res) => {
  try {
    return handleSuccess(res, '', (await onSubdistricts(req.params.id)).data);
  } catch (ex) {
    return handleNotFound(res, `subdistricts does not exist in our database. ${ex}`);
  }
};

module.exports = {
  provinces,
  districts,
  subdistricts
};
