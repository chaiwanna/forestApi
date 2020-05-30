const connection = require('../configs/database');
const { password_hash, password_verify } = require('../configs/security');

module.exports = {
    onRegister(value) {
        return new Promise((resolve, reject) => {
            value.PASSWORD = password_hash(value.PASSWORD);
            connection.query('SELECT NAME,COUNT FROM NUMREG where `NAME` = "U"', function(error, results, fields) {
                if (error) throw error;
                // console.log(`The solution is: ${results[0].NAME}-${results[0].COUNT>10?"0"+results[0].COUNT:"00"+results[0].COUNT}`);
                const IDUSER = `${results[0].NAME}-${results[0].COUNT > 10 ? "0" + results[0].COUNT : "00" + results[0].COUNT}`;
                // console.log(IDUSER);
                // console.log(typeof IDUSER);
                value.IDUSER = IDUSER;
                // console.log(value);
                // console.log(typeof value);
                let sql = 'INSERT INTO USER(IDUSER,TEL,FIRSTNAME,LASTNAME,NICKNAME,BLOOD,NUMREG,ADDRESS,PASSWORD)  VALUE';
                let formatA = '';
                console.log('DATABASE', value);

                formatA += "'" + value.IDUSER + "'" + ",";
                formatA += "'" + value.TEL + "'" + ",";
                formatA += "'" + value.FIRSTNAME + "'" + ",";
                formatA += "'" + value.LASTNAME + "'" + ",";
                formatA += "'" + value.NICKNAME + "'" + ",";
                formatA += "'" + value.BLOOD + "'" + ",";
                formatA += "'" + value.NUMREG + "'" + ",";
                formatA += "'" + value.ADDRESS + "'" + ",";
                formatA += "'" + value.PASSWORD + "'" + ",";

                console.log(formatA)
                formatA = formatA.substr(0, formatA.length - 1);
                formatA = "(" + formatA + ")"
                sql += formatA;
                console.log(sql);

                connection.query(sql, (error, result) => {
                    if (error) console.log(error);

                    connection.query('UPDATE NUMREG SET COUNT=? where `NAME` = "U"', results[0].COUNT + 1, (error, result) => {
                        if (error) return reject(error);
                        // console.log('I am here')
                        resolve(result);
                    })

                })
            });


        });
    },
    onLogin(value) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM USER WHERE TEL=?', [value.TEL], (error, result) => {
                if (error) return reject(error);
                if (result.length > 0) {
                    const userLogin = result[0];
                    if (password_verify(value.PASSWORD, userLogin.PASSWORD)) {

                        return resolve(userLogin);
                    }
                    reject(new Error('Invalid Username ro password'));



                }

            })
        });


    },
    onUser(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM USER where IDUSER = ?', id, (error, result) => {
                error ? reject(error) : null;
                resolve(result)
            })
        })
    }
};