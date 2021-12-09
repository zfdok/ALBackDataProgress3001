/************************数据库操作相关************************
 * 数据库操作相关 DDL
 *************************************************************/
//(1) 创建数据库
const CREATE_DB = (dbName) => `CREATE DATABASE IF NOT EXISTS ${dbName};`;
//(2) 查询所有数据库
const SHOW_ALL_DB = `SHOW DATABASES`;
//(3) 删除数据库
const DELETE_DB = (dbName) => `DROP DATABASE IF EXISTS ${dbName};`;
//(4) 查询正在使用的数据库
const SELECT_DATABASE = `SELECT DATABASE()`;
//(5) 使用数据库
const USE_DB = (dbName) => `USE ${dbName};`;

/************************数据表操作相关************************
 * 数据表操作相关 DDL
 *************************************************************/
//(1) 查询所有数据表
const SHOW_ALL_TABLE = `SHOW TABLES`;
//(2) 添加数据表
const CREATE_TABLE = (tableName) =>
  `CREATE TABLE IF NOT EXISTS ${tableName} (id int NOT NULL primary key AUTO_INCREMENT comment 'primary key',created_time TIMESTAMP COMMENT 'created time',updated_time TIMESTAMP COMMENT 'updated time')`;
//(3) 删除表
const DROP_TABLE = (tableName) => `DROP TABLE IF EXISTS ${tableName};`;
//(4) 添加字段
var ADD_COLUM = (tableName, column_name, column_type) =>
  `ALTER TABLE ${tableName} ADD ${column_name} ${column_type};`;
//(5) 删除字段
var DROP_COLUM = (tableName, column_name) =>
  `ALTER TABLE ${tableName} DROP ${column_name};`;
/************************数据操作相关************************
 * 数据操作相关 DML
 *************************************************************/
//(2) 插入数据(全部列)
var INSERT_DATAS = (tableName, values) =>
`INSERT INTO ${tableName} VALUES (${values});`;
//(3) 插入数据(部分列)
var INSERT_DATA = (tableName, colums, values) =>
`INSERT INTO ${tableName}(${colums}) VALUES (${values});`;
//(4) 删除数据(根据id)
var DELETE_DATA_BY_ID = (tableName, id) =>
`DELETE FROM ${tableName} WHERE (id = ${id});`;
//(5) 删除所有数据
var DELETE_DATAS = (tableName) => `DELETE FROM ${tableName};`;
//(6) 更新数据条目
var UPDATE_DATA = (tableName, colum, value, where, keyword) =>
`UPDATE ${tableName} SET ${colum} = ${value} WHERE ${where} = ${keyword};`;
//(7) 没有有就插入,有就更新
var INSERT_OR_UPDATA_DATAS = (tableName, colums, values) =>
`REPLACE INTO ${tableName}(${colums}) VALUES (${values}) ;`;
//(8) 更新多个条目数据
var UPDATE_DATAS = (tableName, colum_value, where, keyword) =>
`UPDATE ${tableName} SET ${colum_value} WHERE ${where} = ${keyword};`;

/************************查询操作相关************************
 * 数据查询相关 DQL
 *************************************************************/
//(1) 查询表中所有数据
var QUERY_DATAS = (tableName) => `SELECT * FROM ${tableName}`;
var QUERY_A_DATA = (tableName,selectword) => `SELECT ${selectword} FROM ${tableName}`;
//(1) 通过where查询
var QUERY_DATAS_BY_WHERE = (tableName, where, keyword) => `SELECT * FROM ${tableName} WHERE ${where} = '${keyword}';`;
//(2) 通过where查询
var QUERY_A_DATA_BY_WHERE = (tableName, where, keyword, selectword) => `SELECT ${selectword} FROM ${tableName} WHERE ${where} = '${keyword}';`;
var QUERY_A_DATA_BY_WHERES = (tableName, where_keywords, selectword) => `SELECT ${selectword} FROM ${tableName} WHERE ${where_keywords};`;
var QUERY_DATAS_BY_WHERE_ORDER_BY_WHAT_DESC = (tableName, where, keyword,order_keyword,asc_or_desc) => `SELECT * FROM ${tableName} WHERE ${where} = '${keyword}' ORDER BY ${order_keyword} ${asc_or_desc} LIMIT 1;`;
/************************约束/外键/字符集相关************************
 * 约束/外键/字符集相关
 *************************************************************/
//(1)
/************************视图/索引相关************************
 *  视图/索引相关
 *************************************************************/
//(1)
/************************事务相关************************
 *  事务相关
 *************************************************************/
//(1)

module.exports = {
  //数据库操作相关 DDL
  CREATE_DB,
  SHOW_ALL_DB,
  DELETE_DB,
  SELECT_DATABASE,
  USE_DB,
  //数据表操作相关 DDL
  SHOW_ALL_TABLE,
  CREATE_TABLE,
  DROP_TABLE,
  ADD_COLUM,
  DROP_COLUM,
  //数据操作相关 DML
  INSERT_DATAS,
  INSERT_DATA,
  DELETE_DATA_BY_ID,
  DELETE_DATAS,
  UPDATE_DATA,
  UPDATE_DATAS,
  INSERT_OR_UPDATA_DATAS,
  //数据查询相关 DQL
  QUERY_DATAS,
  QUERY_A_DATA,
  QUERY_DATAS_BY_WHERE,
  QUERY_A_DATA_BY_WHERE,
  QUERY_A_DATA_BY_WHERES,
  QUERY_DATAS_BY_WHERE_ORDER_BY_WHAT_DESC,
};