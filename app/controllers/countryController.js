const router = require('express').Router();
const { check } = require('express-validator');
const { onProvinces, onDistricts, onSubdistricts } = require('../models/countryModel');
const { validateRequest, handleCustomValidationError, handleNotFound, handleSuccess } = require('../helpers/response');


//หน้าลงทะเบียน
// router.get('/provinces',
const provinces =
    async (req, res) => {
        try {
            // req.validate();
            // const created = await onProvinces();
            // res.json(created);
            return handleSuccess(res, '', (await onProvinces()).data);
        } catch (ex) {
            // res.error(ex);
            return handleNotFound(res, 'provinces does not exist in our database.');

        }


    };
// router.get('/districts/:id',
const districts =
    async (req, res) => {
        try {
            // req.validate();
            // const created = await onProvinces();
            // res.json(created);
            return handleSuccess(res, '', (await onDistricts(req.params.id)).data);
        } catch (ex) {
            // res.error(ex);
            console.log(ex);
            return handleNotFound(res, 'districts does not exist in our database.');
            
            
        }

    };
const subdistricts =
    // router.get('/subdistricts/:id',
    async (req, res) => {
        try {
            
            return handleSuccess(res, '', (await onSubdistricts(req.params.id)).data);
        } catch (ex) {
   
            console.log(ex);
            return handleNotFound(res, 'subdistricts does not exist in our database.');
            
            
        }

    };

module.exports = {
    provinces,
    districts,
    subdistricts
};