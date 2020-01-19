export const transValidator = {
  email_incorrect : "email phai co dang duongdung12a8@gmail.com",
  gender_incorrect : "ua tai sao gioi tinh lai sai ??",
  password_incorrect : "mat khau phai chua it nhat 8 ky tu bao gom chua hoa chu thuong va chu so",
  password_confirmation_incorrect : "nhap lai mat khau chua chinh xac",
};

export const transError = {
  account_in_use : "email này đã được sử  dụng",
  account_removed : "tài khoản này đã bị gỡ khỏi hệ thống nếu tin rằng điều này là hiểu nhầm vui lòng liên hệ lại với bộ phận kỹ thuật của chúng tôi !",
  account_not_active : "email đã được tạo nhưng chưa được acctive vui lòng kiểm tra email để  acctive tài khoản hoặc liên hệ với kỹ thuật viên của chúng tôi !",
};

export const transSuccess = {
  userCreated : (userEmail) =>{
    return 'tài khoản <strong>' + userEmail + '</strong> đã được tạo, vui lòng kiểm tra lại email của bạn để acctive tài khoản trước khi đăng nhập !, xin cảm ơn .'
  }
}