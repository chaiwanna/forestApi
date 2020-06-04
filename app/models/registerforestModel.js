// const connection = require('../configs/database');
const { getPool, fetchWithPagination } = require('../helpers/database');
const { logger } = require('../helpers/logger');

const moduleLogger = logger.child({ module: 'userModel' });

const onRegisterforest = async row => {
  let result = false;
  try {
    result = await (await getPool()).query(
      `
            SELECT * FROM FOREST_DETAIL
                `
    );
  } catch (e) {
    throw e;
  }

  return {
    result: true,
    data: result
  };
};

const postRegisterforest = async row => {
  let result = false;
  try {
    result = await (await getPool()).query(
      `
          INSERT INTO FOREST_ACCESS (
            USER_IDUSER,
            OBJECTIVE,
            OTHER,
            FOREST_DETAIL_ID
          ) VALUES (
            ?,
            ?,
            ?,
            ?
          );
        `,
      [row.USER_IDUSER, row.OBJECTIVE, row.OTHER, row.FOREST_DETAIL_ID]
    );
  } catch (e) {
    throw e;
  }

  return {
    result: true,
    id: result.insertId
  };
};

module.exports = { onRegisterforest, postRegisterforest };
