// const connection = require('../configs/database');
const { getPool, fetchWithPagination } = require('../helpers/database');
const { logger } = require('../helpers/logger');

const moduleLogger = logger.child({ module: 'userModel' });



const onProvinces = async row => {
    // return new Promise((resolve, reject)=>{

    //     getPool.query('SELECT * FROM provinces', (error, result) => {
    //         if (error) reject(error);
    //         resolve(result);

    //     })
    // });
    let result = false;
    try {
        result = await (await getPool()).query(
            `
                SELECT * FROM provinces
                `,
        )
    } catch (e) {
        //moduleLogger.error(e);
        throw e;
    }
    // //moduleLogger.debug({ result }, 'Inserted user result');
    // c÷onsole.log(result);

    return {
        result: true,
        data: result
    };
};

const onDistricts = async (districts) => {
    console.log(districts);

    let result = false;
    try {
        result = await (await getPool()).query(
            `
                SELECT * FROM districts where province_id = 
                `+ districts
        )
    } catch (e) {
        throw e;
    }

    return {
        result: true,
        data: result
    };
};

const onSubdistricts = async (subdistricts) => {
    console.log(subdistricts);

    let result = false;
    try {
        result = await (await getPool()).query(
            `
            SELECT * FROM subdistricts where district_id =
                `+ subdistricts
        )
    } catch (e) {
        throw e;
    }

    return {
        result: true,
        data: result
    };
};

module.exports = { onProvinces, onDistricts,onSubdistricts };