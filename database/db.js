const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'db.json');

async function readData() {
  const content = await fs.promises.readFile(filePath, 'utf-8');


  return JSON.parse(content);
}

async function writeData(data) {

  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function delayReadFile() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return await readData();


}

module.exports = {
  readData,
  writeData,
  delayReadFile,
};
