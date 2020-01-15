const { parseString } = require("xml2js");
const { writeFile, readFile } = require("fs");
const { resolve } = require("path");
module.exports = {
  getUserDataAsync(req) {
    return new Promise((resolve, reject) => {
      let xmlData = "";
      req
        .on("data", data => {
          //   console.log(data);
          //将buffer转换为字符串
          xmlData += data.toString();
        })
        .on("end", () => {
          resolve(xmlData);
        });
    });
  },
  parseXmlAsync(xmlData) {
    return new Promise((resolve, reject) => {
      parseString(xmlData, { trim: true }, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject("parseXmlAsync has an error:" + err);
        }
      });
    });
  },
  formatJsDate(jsData) {
    const message = [];
    jsData = jsData.xml;
    if (typeof jsData === "object") {
      for (let key in jsData) {
        let value = jsData[key];
        if (Array.isArray(value) && value.length > 0) {
          message[key] = value[0];
        }
      }
    }
    return message;
  },
  writeFileAsync(data, filename) {
    const filePath = resolve(__dirname, filename);
    console.log(data);
    data = JSON.stringify(data);
    return new Promise((resolve, reject) => {
      writeFile(filePath, data, err => {
        if (!err) {
          console.log(`save ${filename} successfully!`);
          resolve();
        } else {
          reject(`save ${filename} has an error` + err);
        }
      });
    });
  },
  readFileAsync(filename) {
    const filePath = resolve(__dirname, filename);

    return new Promise((resolve, reject) => {
      readFile(filePath, (err, data) => {
        if (!err) {
          console.log(`read ${filename} successfully!`);
          data = JSON.parse(data);
          resolve(data);
        } else {
          reject(`read ${filename} has an error` + err);
        }
      });
    });
  },
  compareByProperty(property) {
    return function(a, b) {
      return b[property] - a[property];
    };
  }
};
