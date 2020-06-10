const { checkSchema } = require('express-validator');
const packageJson = require('../../package.json');
const authController = require('../controllers/authController');
const auth = require('./validations/auth');
const { isAuthenticated } = require('../helpers/authentication');

const meController = require('../controllers/meController');
const permissionController = require('../controllers/permissionController');
const settingController = require('../controllers/settingController');
const todoController = require('../controllers/todoController');
const userController = require('../controllers/userController');
const newUserController = require('../controllers/newUserController');
const forestDetailController = require('../controllers/forestDetailController');
const forestAccessController = require('../controllers/forestAccessController');
const countryController = require('../controllers/countryController');
const registerforestController = require('../controllers/registerforestController');
const reportController = require('../controllers/reportController');

const me = require('./validations/me');
const permission = require('./validations/permission');
const setting = require('./validations/setting');
const todo = require('./validations/todo');
const user = require('./validations/user');
const { getPool, fetchWithPagination } = require('../helpers/database');

module.exports = app => {
  app.route('/').get((_req, res) => {
    // return( await getPool());
    return res.send({
      success: true,
      status: 200,
      message: 'OK',
      data: {
        serverStatus: 'online',
        version: packageJson.version
      }
    });
  });

  app
    .route('/me')
    .get([isAuthenticated, checkSchema(me.meGet)], meController.getMe)
    .post([isAuthenticated, checkSchema(me.mePatch)], meController.patchMe);

  app
    .route('/permission')
    .get([isAuthenticated, checkSchema(permission.permissionListGet)], permissionController.listPermissions);

  app.route('/:roleType(user|staff)/login').post([checkSchema(auth.authLoginPost)], authController.login);
  app.route('/:roleType(user)/register').post([checkSchema(auth.authRegisterPost)], authController.register);
  app
    .route('/:roleType(user)/register-confirm')
    .get([checkSchema(auth.authRegisterConfirmGet)], authController.registerConfirm);
  app
    .route('/:roleType(user)/password-reset-request')
    .post([checkSchema(auth.authPasswordResetRequestPost)], authController.passwordResetRequest);
  app
    .route('/:roleType(user)/password-reset-verify')
    .get([checkSchema(auth.authPasswordResetVerifyGet)], authController.passwordResetVerify);
  app
    .route('/:roleType(user)/password-reset')
    .post([checkSchema(auth.authPasswordResetPost)], authController.passwordReset);

  app
    .route('/setting')
    .get([isAuthenticated, checkSchema(setting.settingListGet)], settingController.listSettings)
    .post([isAuthenticated, checkSchema(setting.settingPost)], settingController.postSetting);

  app
    .route('/setting/:id')
    .get([isAuthenticated, checkSchema(setting.settingGet)], settingController.getSetting)
    .patch([isAuthenticated, checkSchema(setting.settingPatch)], settingController.patchSetting)
    .delete([isAuthenticated, checkSchema(setting.settingDelete)], settingController.deleteSetting);

  app
    .route('/todo')
    .get([isAuthenticated, checkSchema(todo.todoListGet)], todoController.listTodos)
    .post([isAuthenticated, checkSchema(todo.todoPost)], todoController.postTodo);

  app
    .route('/todo/:state(pending|ongoing|completed|archived)')
    .get([[isAuthenticated, checkSchema(todo.todoListGet)], todoController.listTodos])
    .post([[isAuthenticated, checkSchema(todo.todoListPost)], todoController.postTodos]);

  app
    .route('/todo/:todoId')
    .get([isAuthenticated, checkSchema(todo.todoGet)], todoController.getTodo)
    .patch([isAuthenticated, checkSchema(todo.todoPatch)], todoController.patchTodo)
    .delete([isAuthenticated, checkSchema(todo.todoDelete)], todoController.deleteTodo);

  app
    .route('/:roleType(user|staff)')
    .get([checkSchema(user.userListGet)], userController.listUsers)
    .post([], userController.postUser);

  app
    .route('/:roleType(user|staff)/:id')
    .get([isAuthenticated, checkSchema(user.userGet)], userController.getUser)
    .patch([isAuthenticated, checkSchema(user.userPatch)], userController.patchUser)
    .delete([isAuthenticated, checkSchema(user.userDelete)], userController.deleteUser);

  // custom api

  app.route('/forest_detail').get([], forestDetailController.getAll);

  app.route('/forest_detail/:id').get([], forestDetailController.getById);

  app.route('/forest_access').get([], forestAccessController.getAll).post([], forestAccessController.getDataPaginate);

  app.route('/user_new').get([], newUserController.getAll);

  app.route('/report/dash_board').get([], reportController.getDashboard);
  app.route('/report/get_graph').post([], reportController.getGraph);
  app.route('/report/create_excel').get([], reportController.createExcel);
  app.route('/report/get_map_detail').post([], reportController.getMapDetail);
  //register
  app
    .route('/getregisterforest')
    .get([], registerforestController.getregisterforest)
    .post([], registerforestController.insertRegisterforest);

  // address
  app.route('/country/provinces').get([], countryController.provinces);
  app.route('/country/districts/:id').get([], countryController.districts);
  app.route('/country/subdistricts/:id').get([], countryController.subdistricts);
};
