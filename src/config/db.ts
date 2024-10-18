const mongoose = require("mongoose");

const connetDataBase = async (): Promise<any> => {
  console.log('MangoDB connecting....');
  try {
    const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true },  family: 4,};
    await mongoose.connect(`${process.env.MONGO_URL}${process.env.DATABASE}`, clientOptions);
    console.log('MangoDB connected successfully.');
  } catch (err) {
    console.log("Error in DataBase Connection :", err);
    throw Error('MangoDB Connection issue')
    
  }
};

module.exports = connetDataBase;