const router = require('express').Router();
const { check } = require('express-validator');
const { forestDetailModel } = require('../models/forestDetailModel');
const { forestAccessModel } = require('../models/forestAccessModel');
const { validateRequest, handleCustomValidationError, handleNotFound, handleSuccess } = require('../helpers/response');
const xl = require('excel4node');
const { getPaginateData } = require('../controllers/forestAccessController');

const fDetailModel = new forestDetailModel();
const fAacessModel = new forestAccessModel();

const getDashboard = async (req, res) => {
  try {
    $report1 = await fDetailModel.customQuery(['COUNT(id) as forest_count'], '');
    $report2 = await fAacessModel.customQuery(['*'], 'GROUP BY user_id');
    $report2 = $report2.length;

    $data = {
      dashboard_forest_care: $report1[0].forest_count,
      dashboard_access_per_day: $report2
    };
    return handleSuccess(res, '', $data);
  } catch (ex) {
    return handleNotFound(res, ex);
  }
};

const createExcel = async (req, res) => {
  try {
    let filter = JSON.parse(req.query.param);
    const returnData = await getPaginateData({ body: filter });

    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('รายงาน');
    const head = [
      'ชื่อ-นามสกุล',
      'เลขประจำตัวประชาชน',
      'ที่อยู่	',
      'วัตถุประสงค์ในการเข้าไปในพื้นที่ป่า	',
      'วันที่เข้าป่า'
    ];
    const data = [];
    // prepare data
    returnData.forEach(element => {
      let array = [
        `${element.user[0].first_name} ${element.user[0].last_name}`,
        `${element.user[0].numreg}`,
        '',
        `${element.objective}`,
        `${element.time}`
      ];

      data.push(array);
    });

    // add head
    for (const col in head) {
      ws.cell(1, parseInt(col) + 1).string(head[col]);
    }
    // add body
    for (const row in data) {
      for (const col in data[row]) {
        ws.cell(parseInt(row) + 2, parseInt(col) + 1).string(data[row][col]);
      }
    }

    wb.write('report.xlsx', res);
  } catch (ex) {
    return handleNotFound(res, ex);
  }
};

const getGraph = async (req, res) => {
  try {
    const filter = req.body;
    condition = 'where 1 ';
    if (filter.filter && filter.filter.date_from) {
      condition += ` and time >= '${filter.filter.date_from}' `;
      delete filter.filter.date_from;
    }
    if (filter.filter && filter.filter.date_too) {
      condition += ` and time <= '${filter.filter.date_too}' `;
      delete filter.filter.date_too;
    }
    if (filter.filter) {
      for (const [key, value] of Object.entries(filter.filter)) {
        condition += ` and ${key} = '${value}' `;
      }
    }
    condition +=
      'GROUP BY YEAR(forest_access.time) , MONTH(forest_access.time) , DAY(forest_access.time) ORDER BY `time`';

    $report2 = await fAacessModel.customQuery(
      ["DATE_FORMAT(forest_access.time ,'%d-%m-%Y') AS `time`", 'COUNT(forest_access.user_id) AS `count` '],
      condition
    );

    return handleSuccess(res, '', $report2);
  } catch (ex) {
    return handleNotFound(res, ex);
  }
};

const getMapDetail = async (req, res) => {
  try {
    const filter = req.body;
    condition = '';

    if (filter.filter && filter.filter.user_id) {
      condition = `WHERE user_id ='${filter.filter.user_id}'`;
    }
    condition = `left JOIN (SELECT * FROM forest_access ${condition}) AS forest_access ON forest_access.forest_detail_id = forest_detail.id where 1 `;
    if (filter.filter && filter.filter.date_from) {
      condition += ` and time >= '${filter.filter.date_from}' `;
      delete filter.filter.date_from;
    }
    if (filter.filter && filter.filter.date_too) {
      condition += ` and time <= '${filter.filter.date_too}' `;
      delete filter.filter.date_too;
    }
    // if (filter.filter) {
    //     for (const [key, value] of Object.entries(filter.filter)) {
    //         condition += ` and ${key} = '${value}' `;
    //     }
    // }
    condition += 'GROUP BY forest_detail.id';
    $report2 = await fDetailModel.customQuery(
      ['COUNT(forest_access.user_id) as `count`', 'forest_detail.*'],
      condition
    );

    return handleSuccess(res, '', $report2);
  } catch (ex) {
    return handleNotFound(res, ex);
  }
};

module.exports = {
  getDashboard,
  createExcel,
  getGraph,
  getMapDetail
};
