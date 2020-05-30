const router = require('express').Router();
const { check } = require('express-validator');
const { onRegisterforest,postRegisterforest } = require('../models/registerforestModel');
const { validateRequest, handleCustomValidationError, handleNotFound, handleSuccess } = require('../helpers/response');


//หน้าลงทะเบียน
// router.get('/provinces',
const getregisterforest =
    async (req, res) => {
        try {
            // req.validate();
            // const created = await onProvinces();
            // res.json(created);
            return handleSuccess(res, '', (await onRegisterforest()).data);
        } catch (ex) {
            // res.error(ex);
            return handleNotFound(res, 'getregisterforest does not exist in our database.');

        }
    };
const insertRegisterforest =
    async (req, res) => {
        let params = req.body
        try {
            // req.validate();
            // const created = await onProvinces();
            // res.json(created);
            console.log(params);
            
            return handleSuccess(res, '', (await postRegisterforest(params)));
        } catch (ex) {
            // res.error(ex);
            return handleNotFound(res, ex);

        }
    };
    // const insertRegisterforest = async (req, res) => {
   
    //     let params = req.body
    //     try {
    //       return handleSuccess(res, '', result);
    //     } catch (e) {
    //       //moduleLogger.error({ e }, 'Creating user failed');
    //       return handleCustomValidationError(res, [
    //         {
    //           value: '',
    //           msg: e.message,
    //           param: 'general',
    //           location: 'body'
    //         }
    //       ]);
    //     }
    //   };

module.exports = {
    getregisterforest,insertRegisterforest
};