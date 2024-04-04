const { EventEmitter } = require("node:events");
const { userRepository } = require("../repositories/index");
const { validationResult } = require("express-validator");
const { User } = require("../models/index");
const bcrypt = require("bcrypt");
const mailer = require("../utils/mailer");
//
const myEvent = new EventEmitter();
myEvent.on("event.register.user", (params) => {
  console.log(`${JSON.stringify(params)}`);
});
//
const login = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(500).json({
      error: error.array,
    });
  }
  const { phoneNumber, password } = req.body;
  try {
    let existUser = await userRepository.login({
      phoneNumber,
      password,
    });
    res.status(200).json({
      message: "Login successfully!",
      data: existUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Wrong username or password",
    });
  }
};

//
const register = async (req, res) => {
  const { name, email, password, phoneNumber, address } = req.body;
  myEvent.emit("event.register.user", {
    name,
    email,
    password,
    phoneNumber,
    address,
  });
  try {
    const user = await userRepository.register({
      name,
      email,
      password,
      phoneNumber,
      address,
    });
    res.status(200).json({
      message: "Register Successfully!",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Cannot Register",
    });
  }
};
//
const verify = (req, res) => {
  bcrypt.compare(req.query.email, req.query.token, (err, result) => {
    if (result == true) {
      User.verify(req.query.email, (err, result) => {
        if (!err) {
          res.redirect("/login");
        } else {
          res.redirect("/500");
        }
      });
    } else {
      res.redirect("/404");
    }
  });
};
const sendResetLinkEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.redirect("/password/reset");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect("/password/reset");
    }

    const hashedEmail = await bcrypt.hash(
      user.email,
      parseInt(process.env.SALT_ROUNDS)
    );
    await mailer.sendMail(
      user.email,
      "Reset password",
      `<a href="${process.env.APP_URL}?token=${hashedEmail}"> Reset Password </a>`
    );
    // console.log(`${process.env.APP_URL}/users/reset/?token=${hashedEmail}`);
    return res.send("Send Email Successfully!");
  } catch (error) {
    console.error("Error sending reset link email:", error);
    return res.redirect("Error!");
  }
};
const reset = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = req.query.token;
    console.log(email, token, password);
    if (!email || !token || !password) {
      return res.send("Error!");
    }
    // Kiểm tra xem email và token có khớp hay không
    const user = await User.findOne({ email, resetToken: token });
    if (!user) {
      return res.send("Error!");
    }
    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUND)
    );
    // Cập nhật mật khẩu mới vào cơ sở dữ liệu
    await User.updateOne({ email }, { password: hashedPassword });
    return res.send("Succesfully");
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.send("Error!");
  }
};
const getInfor = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await userRepository.getInfor(phoneNumber);
    res.status(200).json({
      message: "Successfully!",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "User not exist!",
    });
  }
};
const updateUserInfo = async (req, res) => {
  try {
    // Lấy dữ liệu từ yêu cầu
    const { phoneNumber, email, name, address } = req.body;
    // Gọi hàm update để cập nhật thông tin người dùng
    const updatedUser = await userRepository.update({ phoneNumber, email, name, address });
    // Trả về phản hồi thành công
    res.status(200).json({
      success: true,
      message: "User information updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error updating user information:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user information",
      error: error.message,
    });
  }
};
module.exports = {
  updateUserInfo,
  getInfor,
  verify,
  sendResetLinkEmail,
  reset,
  login,
  register,
};
