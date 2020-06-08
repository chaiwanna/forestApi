const router = require('express').Router();
const { check } = require('express-validator');
const { forestDetailModel } = require('../models/forestDetailModel');
const { forestAccessModel } = require('../models/forestAccessModel');
const { validateRequest, handleCustomValidationError, handleNotFound, handleSuccess } = require('../helpers/response');
const xl = require('excel4node');

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
    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('รายงาน');
    const head = ['h1', 'h2'];
    const data = [
      ['a', 'b'],
      ['c', 'd']
    ];
    for (const col in head) {
      ws.cell(1, parseInt(col) + 1).string(data[col]);
    }
    for (const row in data) {
      for (const col in data[row]) {
        ws.cell(parseInt(row) + 2, parseInt(col) + 1).string(data[row][col]);
      }
    }

    wb.write('report.xlsx', res);
    // return handleSuccess(res, '', $data);
  } catch (ex) {
    return handleNotFound(res, ex);
  }
};

// function addRows(ws, data) {
//     console.log(ws);

//     for (const row in data) {
//         for (const col in data[row]) {
//             ws.cell(row, col).string(data[row][col]);
//         }
//     }
// }

module.exports = {
  getDashboard,
  createExcel
};
