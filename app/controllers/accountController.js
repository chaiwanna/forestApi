const router = require('express').Router();
const { check } = require('express-validator');
const { onRegister, onLogin, onUser } = require('../');

//หน้าลงทะเบียน
// router.post('/register', [
//     check('TEL').not().isEmpty(),
//     check('FIRSTNAME').not().isEmpty(),
//     check('LASTNAME').not().isEmpty(),
//     check('NICKNAME').not().isEmpty(),
//     check('BLOOD').not().isEmpty(),
//     check('NUMREG').not().isEmpty(),
//     check('ADDRESS').not().isEmpty(),
//     check('PASSWORD').not().isEmpty(),
// ], 
const register =
    async (req, res) => {
        try {
            req.validate();
            const created = await onRegister(req.body);
            res.json(created);
        } catch (ex) {
            res.error(ex);

        }
    };
//เข้าสู่ระบบ
// router.post('/login', [
//     check('TEL').not().isEmpty(),
//     check('PASSWORD').not().isEmpty()
// ], 
const login =
    async (req, res) => {
        try {
            req.validate();
            const userLogin = await onLogin(req.body);
            req.session.userLogin = userLogin;
            res.json(userLogin);

        } catch (ex) {
            res.error(ex);
        }

    };

//ตรวจสอบ user login
// router.post('/getUserLogin', 
const getUserLogin =
    (req, res) => {
        try {
            if (req.session.userLogin) {
                return res.json(req.session.userLogin);
            }
            throw new Error('Unauthorize.');
        } catch (ex) {
            res.error(ex, 401);
        }

    };

//ดึงUser มาแสดง
// router.get('/user/:id', 
const user =
    async (req, res) => {
        var id = req.params.id;
        try {
            const created = await onUser(id);
            return res.json(created);


        } catch (ex) {
            res.error(ex);

        }
    };

//ออกจากระบบ
// router.post('/logout', 
const logout =
    (req, res) => {
        try {
            delete req.session.userLogin;
            res.json({ message: 'Logout' })
        } catch (ex) {
            res.error(ex);
        }
    }

module.exports = router;