const router = require('express').Router();
const { check } = require('express-validator');
const { forestDetailModel } = require('../models/forestDetailModel');
const { forestAccessModel } = require('../models/forestAccessModel');
const { validateRequest, handleCustomValidationError, handleNotFound, handleSuccess } = require('../helpers/response');
const xl = require('excel4node');
const { getPaginateData } = require('../controllers/forestAccessController');
const moment = require('moment');

const fDetailModel = new forestDetailModel();
const fAacessModel = new forestAccessModel();

const getDashboard = async (req, res) => {
  try {
    const d = new Date();
    $report1 = await fDetailModel.customQuery(['COUNT(id) as forest_count'], '');
    $report2 = await fAacessModel.customQuery(
      ['*'],
      `WHERE YEAR(forest_access.time) = '${d.getFullYear()}' AND MONTH(forest_access.time) = '${
        d.getMonth() + 1
      }' AND  DAY(forest_access.time) = '${d.getDate()}' GROUP BY user_id`
    );
    $report2 = $report2.length;

    let filter = {};
    if (req.query && req.query.param) {
      filter = JSON.parse(req.query.param);
    }
    filter = { body: filter };
    filter = filter.body;
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
    condition += 'order by count desc';
    $report3 = await fDetailModel.customQuery(
      ['IFNULL(a.count,0) as count', 'forest_detail.name', 'forest_detail.id'],
      `LEFT JOIN (SELECT COUNT(DISTINCT(forest_access.user_id)) AS  'count', forest_detail.name , forest_detail.id FROM forest_detail
            left JOIN forest_access ON forest_detail.id = forest_access.forest_detail_id
            WHERE YEAR(forest_access.time) = '${d.getFullYear()}' AND MONTH(forest_access.time) = '${
        d.getMonth() + 1
      }' AND  DAY(forest_access.time) = '${d.getDate()}'
            GROUP BY forest_detail.id) AS a ON a.id = forest_detail.id ${condition}`
    );

    $data = {
      dashboard_forest_care: $report1[0].forest_count,
      dashboard_access_per_day: $report2,
      dashboard_access_forest_detail: $report3
    };
    return handleSuccess(res, '', $data);
  } catch (ex) {
    return handleNotFound(res, ex);
  }
};

const createExcel = async (req, res) => {
  try {
    let filter = {};
    if (req.query && req.query.param) {
      filter = JSON.parse(req.query.param);
    }
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
      let address = 'ไม่มีข้อมูล';
      if (element.user.province_data && element.user.district_data && element.user.subdistrict_data) {
        address = `เลขที่ ${element.user.numhome} หมู่ ${element.user.nummoo} ${element.user.province_data.name_in_thai} ${element.user.district_data.name_in_thai} ${element.user.subdistrict_data.name_in_thai} ${element.user.subdistrict_data.zip_code}`;
      }
      let time = moment(String(element.time)).format('DD/MM/YYYY HH:mm');

      let array = [
        `${element.user.first_name} ${element.user.last_name}`,
        `${element.user.numreg}`,
        address,
        `${element.objective} ${element.other ? element.other : ''}`,
        `${time}`
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
    $report2 = await getForestAccessModelData(req);
    return handleSuccess(res, '', $report2);
  } catch (ex) {
    return handleNotFound(res, ex);
  }
};
const getGraphDownloadExcel = async (req, res) => {
  try {
    let filter = {};
    if (req.query && req.query.param) {
      filter = JSON.parse(req.query.param);
    }
    $report2 = await getForestAccessModelData({ body: filter });
    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('รายงาน');
    const head = ['วันที่', 'จำนวนคนเข้าใช้งาน'];
    const data = [];
    // prepare data
    $report2.forEach(element => {
      let array = [`${element.time}`, `${element.count}`];

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
const getReportObj = async (req, res) => {
  try {
    $report2 = await getObjModelData(req);

    if (!$report2) {
      return handleSuccess(res, '', $report2);
    }
    data = [];
    $report2.forEach(element => {
      let obj = element.objective;
      obj = obj.split(',');
      obj.forEach(ele => {
        if (data.findIndex(x => x.name == ele) < 0) {
          data.push({ name: ele, count: 0 });
        }
        data[data.findIndex(x => x.name == ele)].count += 1;
      });
    });

    function compare(a, b) {
      if (a.count > b.count) {
        return -1;
      }
      if (a.count < b.count) {
        return 1;
      }
      return 0;
    }
    data.sort(compare);
    return handleSuccess(res, '', data);
  } catch (ex) {
    return handleNotFound(res, ex);
  }
};
const getReportObjDownloadExcel = async (req, res) => {
  try {
    let filter = {};
    if (req.query && req.query.param) {
      filter = JSON.parse(req.query.param);
    }
    $report2 = await getObjModelData({ body: filter });

    if (!$report2) {
      return handleSuccess(res, '', $report2);
    }
    data = [];
    $report2.forEach(element => {
      let obj = element.objective;
      obj = obj.split(',');
      obj.forEach(ele => {
        if (data.findIndex(x => x.name == ele) < 0) {
          data.push({ name: ele, count: 0 });
        }
        data[data.findIndex(x => x.name == ele)].count += 1;
      });
    });

    function compare(a, b) {
      if (a.count > b.count) {
        return -1;
      }
      if (a.count < b.count) {
        return 1;
      }
      return 0;
    }
    data.sort(compare);

    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('รายงาน');
    const head = ['วัตถุประสงค์', 'จำนวนคนเข้าใช้งาน'];
    const excelData = [];
    // prepare data
    data.forEach(element => {
      let array = [`${element.name == '' || null ? 'ไม่พบข้อมูล' : element.name}`, `${element.count}`];

      excelData.push(array);
    });

    // add head
    for (const col in head) {
      ws.cell(1, parseInt(col) + 1).string(head[col]);
    }
    // add body
    for (const row in excelData) {
      for (const col in excelData[row]) {
        ws.cell(parseInt(row) + 2, parseInt(col) + 1).string(excelData[row][col]);
      }
    }

    wb.write('report.xlsx', res);
  } catch (ex) {
    console.log(ex);

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
    if (filter.filter && filter.filter.id) {
      condition += ` and forest_detail.id ='${filter.filter.id}'`;
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

async function getForestAccessModelData(req) {
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
    'GROUP BY  YEAR(forest_access.time) , MONTH(forest_access.time) , DAY(forest_access.time) ORDER BY `time` desc';

  $report2 = await fAacessModel.customQuery(
    ["DATE_FORMAT(forest_access.time ,'%d-%m-%Y') AS `time`", 'COUNT(forest_access.user_id) AS `count` '],
    condition
  );
  return $report2;
}

async function getObjModelData(req) {
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

  $report2 = await fAacessModel.customQuery(['*'], condition);
  return $report2;
}

module.exports = {
  getDashboard,
  createExcel,
  getGraph,
  getMapDetail,
  getReportObj,
  getGraphDownloadExcel,
  getReportObjDownloadExcel
};
