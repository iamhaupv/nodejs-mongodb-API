const mongoose = require("mongoose");

mongoose.set("strictQuery", true); // có thể giảm thiểu các lỗi truy vấn không mong muốn bằng cách đảm bảo rằng các truy vấn được thực hiện tuân theo các quy tắc mà bạn đã định nghĩa trong mô hình schema của mình.

const connect = async () => {
  try {
    let connection = await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect successfully!");
    return connection
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

module.exports = connect