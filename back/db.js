const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'ausehzmfla12!!',
    port:3306,
    database:'node_db',
    
});

connection.connect(function (err){
    if (err){
        consonle.error('mysql connection error');
        consonle.error(err);
        throw err;

    }
});



function getAllMemos(callback){
    connection.query('SELECT * FROM MEMOS ORDER BY ID DESC', (err, rows, fields) => {
        if(err) throw err;
        callback(rows);
    });
}

// 외부에서 require를 통해 추가한 스크립트의 함수를 참조할 때 선언해주어야 해당 함수를 참조할 수 있다.
module.exports = {
    getAllMemos
}

// 여기서 db 관련 코드는 callback 형태로 구현해 주어야 db를 조회한 후에 온전히 view로 데이터를 전달해 줄 수 있습니다. 


