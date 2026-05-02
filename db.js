const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456', 
    database: 'skin365_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Lỗi kết nối database: ', err.message);
    } else {
        console.log('Kết nối Database Skin365 thành công! Đang đợi lệnh...');
        connection.release();
    }
});

module.exports = pool.promise(); 