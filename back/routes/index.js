var express = require('express');
var router = express.Router();
var cors = require("cors");
const mysql = require('mysql');
var http = require('http');

let bin_code;
let device_temp;
let device_weight=0;
let device_time;
let user_temp; 
let user_weight;
let user_time;
let temp_check=0;
let weight_check=0;
let check=0;

// 장치 센서(온도, 무게)의 실시간 정보들을 가져오는 함수
let mobius_interact=()=>{ 
  const mobiusdb=mysql.createConnection({ // DB 연결
    host:'localhost',
    user:'root',
    password:'4862',
    database:'mobiusdb'
  });

  mobiusdb.connect((err)=>{ // 연결 시 에러 체크
    if(err) throw error;
  });

  mobiusdb.query(`select con from cin where cr="${bin_code}/tempData" order by ri desc limit 1`,(err,rows,fields)=>{
    if(err) throw error;
    device_temp=rows[0].con;
    console.log('[+] Device temp : ',device_temp); // 현재 온도 값 가져와서 console에 출력
    console.log('[+] process ing...');
  });
  
  mobiusdb.query(`select con from cin where cr="${bin_code}/weightData" order by ri desc limit 1`,(err,rows,fields)=>{
      if (err) throw error;
      device_weight = rows[0].con;
      console.log('[+] Device weight : ', device_weight); // 현재 무게 값 가져와서 console에 출력
      console.log('[+] process ing...');
  });
  mobiusdb.end();
}

// 프로그램 시작

// 음식물 쓰레기 통의 장치코드 인증
router.get('/bin_code',(req,res)=>{
  bin_code=req.body.bin_code;

  const mobiusdb = mysql.createConnection({ // DB 연결
      host: 'localhost',
      user: 'root',
      password: '4862',
      database: 'mobiusdb'
  });

  mobiusdb.connect((err) => { // 연결 시 에러 체크
    if (err) throw error;
  });

  // 사용자가 입력한 binCode에 해당하는 binCode가 있는지 DB를 통해 탐색
  mobiusdb.query(`select * from cnt where ri="/Mobius/test/${db.escape(bin_code)}"`, (err, rows, fields) => {
    if (err){
      bincode='';
      res.send({
        'errorCode':'1' // 에러 발생
      });
    }
  });
  res.send({
    'errorCode':'0' // 에러 미발생
  });
  mobiusdb.end();
})

// 사용자 설정 값 가져오는 코드
const mobiusdb = mysql.createConnection({ // DB 연결
    host: 'localhost',
    user: 'root',
    password: '4862',
    database: 'mobiusdb'
});

mobiusdb.connect((err) => { // 연결 시 에러 체크
    if (err) throw error;
});

mobiusdb.query(`select con from cin where cr="${bin_code}/tempUser" order by ri desc limit 1`, (err, rows, fields) => {
    if (err) throw error;
    user_temp = rows[0].con;
    console.log('[+] User temp : ', user_temp); // 현재 온도 값 가져와서 console에 출력
});

mobiusdb.query(`select con from cin where cr="${bin_code}/weightUser" order by ri desc limit 1`, (err, rows, fields) => {
    if (err) throw error;
    user_weight = rows[0].con;
    console.log('[+] User weight : ', user_weight); // 현재 무게 값 가져와서 console에 출력
});

mobiusdb.query(`select con from cin where cr="${bin_code}/termUser" order by ri desc limit 1`, (err, rows, fields) => {
    if (err) throw error;
    user_time = rows[0].con;
    console.log('[+] User weight : ', user_time); // 현재 무게 값 가져와서 console에 출력
    console.log('[+] process ing...');
});

mobiusdb.end();

// 음식물쓰레기통에서 실시간으로 5초마다 데이터를 가져오는 함수
setInterval(mobius_interact,5000); 

router.use(cors());
router.use(express.json());
router.use(express.urlencoded({extended : false}));

// 사용자 요청에 따라 새로운 설정 값 mobius DB에 저장
router.post('/save',(req,res)=>{ 
  user_temp=req.body.temp;
  user_weight=req.body.weight;
  user_time=req.body.time;
  // temp 값 저장
  var opts = {
      hostname: '192.168.35.2',
      port: 7579,
      method: 'POST',
      path: `/Mobius/test/${bin_code}/tempUser`,
      headers: {
          'Accept':'application/json',
          'Content-Type': 'application/vnd.onem2m-res+json;ty=4',
          'X-M2M-RI': '1234',
          'X-M2M-Origin': 'tempUser'
      }
  }
  var req = http.request(opts, (res) => {
      console.log(res.statusCode);
      console.log(JSON.stringify(res.headers));
  })
  req.write(`{ "m2m:cin": { "con": "${user_temp}" } }`);
  req.end();

  // weight 값 저장
  var opts = {
      hostname: '192.168.35.2',
      port: 7579,
      method: 'POST',
      path: `/Mobius/test/${bin_code}/weightUser`,
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/vnd.onem2m-res+json;ty=4',
          'X-M2M-RI': '1234',
          'X-M2M-Origin': 'weightUser'
      }
  }
  var req = http.request(opts, (res) => {
      console.log(res.statusCode);
      console.log(JSON.stringify(res.headers));
  })
  req.write(`{ "m2m:cin": { "con": "${user_weight}" } }`);
  req.end();

  // term 값 저장
  var opts = {
      hostname: '192.168.35.2',
      port: 7579,
      method: 'POST',
      path: `/Mobius/test/${bin_code}/termUser`,
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/vnd.onem2m-res+json;ty=4',
          'X-M2M-RI': '1234',
          'X-M2M-Origin': 'termUser'
      }
  }
  var req = http.request(opts, (res) => {
      console.log(res.statusCode);
      console.log(JSON.stringify(res.headers));
  })
  req.write(`{ "m2m:cin": { "con": "${user_time}" } }`);
  req.end();

  // 체크비트들 모두 초기화
  temp_check=0;
  weight_check=0;
  check=0;
})

// bin 페이지에 출력 될 현재 장치 센서 값들의 정보를 load
router.get('/bin_load',(req,res)=>{
  // 값의 변화에 따른 체크비트 값 설정
  if(device_temp>user_temp && temp_check==0){
    check=1;
  }
  else if(device_temp<=user_temp && temp_check==1){
    check=1;
  }
  if(device_weight>user_weight && weight_check==0){
    check=1;
  }
  else if(device_weight<=user_weight && weight_check==1){
    check=1;
  }
  // bin page에 값 전송
  res.send({
    'Temp':device_temp,
    'Amount':device_weight,
    'Term':device_time,
    'Check':check
  });
  console.log('[+] bin_load req success');
})

// setting 페이지에 사용자가 설정했던 설정 값들 load
router.get('/set_load',(req,res)=>{
  res.send({
    'Temp':user_temp,
    'Amount':user_weight,
    'Term':user_time
  });
  console.log('[+] set_load req success');
})

router.post('/change_term',(req,res)=>{ // 사용자한테 받은 새로운 term 값 갱신
  user_time=req.body.time;
  if(device_temp > user_temp){
    temp_check=1;
    check=0;
  }
  else{
    temp_check=0;
    check=0;
  }
  if(device_weight > user_weight){
    weight_check=1;
    check=0;
  }
  else{
    weight_check=0;
    check=0;
  }

  // 사용자가 재설정한 term 값을 mobius DB에 저장
  var opts = {
      hostname: '192.168.35.2',
      port: 7579,
      method: 'POST',
      path: `/Mobius/test/${bin_code}/termUser`,
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/vnd.onem2m-res+json;ty=4',
          'X-M2M-RI': '1234',
          'X-M2M-Origin': 'termUser'
      }
  }
  var req = http.request(opts, (res) => {
      console.log(res.statusCode);
      console.log(JSON.stringify(res.headers));
  })
  req.write(`{ "m2m:cin": { "con": "${user_time}" } }`);
  req.end();
})

module.exports = router;