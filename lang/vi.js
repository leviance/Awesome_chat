export const transValidator = {
  email_incorrect : "email phai co dang duongdung12a8@gmail.com",
  gender_incorrect : "ua tai sao gioi tinh lai sai ??",
  password_incorrect : "mat khau phai chua it nhat 8 ky tu bao gom chua hoa chu thuong va chu so",
  password_confirmation_incorrect : "nhap lai mat khau chua chinh xac",
  update_username : "Username giới hạn trong khoảng 3 - 17 ký tự và không được chứa ký tự đặc biệt.",
  update_gender : "Oops! dữ liệu giới tính có vấn đề ?? đừng đùa với njja rùa :D",
  update_address : "Địa chỉ giới hạn trong khoảng 3-30 ký tự.",
  update_phone : "Số điện thoại phải bắt đầu từ số 0 và có 10 ký tự",
  keyword_find_user : "Tên người dùng không được chứa ký tự đặc biệt, tối đa 17 ký tự",
  message_text_emoij_incorrect : "Tin nhắn không hợp lệ !",
  add_new_group_users_incorrect : "Bạn cần chọn tối thiểu 2 người để tạo một nhóm trò truyện!",
  add_new_group_name_incorrect : "Tên nhóm phải lớn hơn 5 và nhỏ hơn 30 ký tự !",
};

export const transError = {
  account_in_use : "email này đã được sử  dụng",
  account_removed : "tài khoản này đã bị gỡ khỏi hệ thống nếu tin rằng điều này là hiểu nhầm vui lòng liên hệ lại với bộ phận kỹ thuật của chúng tôi !",
  account_not_active : "email đã được tạo nhưng chưa được acctive vui lòng kiểm tra email để  acctive tài khoản hoặc liên hệ với kỹ thuật viên của chúng tôi !",
  loginFalse: "sai tài khoản hoặc mật khẩu",
  server_error: "Có lỗi ở phía server, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi để báo cáo lỗi này xin cảm ơn",
  avatar_type : "kiểu file không hợp lệ",
  avatar_size : "file quá lớn để upload tối đa là 10MB",
  user_undefined : "Tài khoản không tồn tại",
  user_curent_password_failed : "Mật khẩu hiện tại không chính xác",
  conversation_not_found : "Cuộc trò truyện không tồn tại",
  image_message_type : "kiểu file không hợp lệ",
  image_message_size : "file quá lớn để upload tối đa là 10MB",
  attachment_message_size : "file quá lớn để upload tối đa là 2G",
};

export const transSuccess = {
  userCreated : (userEmail) =>{
    return 'tài khoản ' + userEmail + ' đã được tạo, vui lòng kiểm tra lại email của bạn để acctive tài khoản trước khi đăng nhập !, xin cảm ơn .'
  },
  account_actived : "kích hoạt tài khoản thành công",
  loginSuccess : (username) =>{
    return 'Xin chào ' + username + ' chúc bạn một ngày tốt lành'
  },
  logout_success: "Đăng xuất tài khoản thành công",
  avatar_updated : "Cập nhật ảnh đại diện thành công.",
  user_info_updated : "Cập nhật thông tin thành công.",
  user_password : "Cập nhật mật khẩu thành công."
}

export const transmail = {
  subject: 'Real Live chat xác thực kích hoạt tài khoản',
  template : (linkVeryfy) =>{
    return '<h2>Bạn nhận được mail này vĩ đã đăng ký tài khoản trên Real Live Chat </h2> <h3>Vui lòng kích vào liên kết bên dưới để kích hoạt tài khoản</h3> </h3><a href="'+ linkVeryfy +'" target="blank">'+linkVeryfy+'</a></h3> <h4>Nếu email này là nhầm lẫn hãy bỏ qua nó</h4>'
  },
  send_fail: 'có lỗi trong quá trình gửi mail vui lòng liên hệ bộ phận hỗ trợ của chúng tôi'
}