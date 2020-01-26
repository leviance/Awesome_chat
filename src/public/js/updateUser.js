let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfor = {};

function updateUerInfo() {
  $('#input-change-avatar').bind('change', function() {
    let fileData = $(this).prop("files")[0];
    let math = ["image/png","image/jpg","image/jpeg"];
    let limit = 1048576 * 10;

    if($.inArray(fileData.type, math) === -1){
      alertify.notify("kiểu file không hợp lệ","error", 7);
      $(this).val(null);
      return false;
    }
    if(fileData.size > limit){
      alertify.notify('Ảnh quá lớn để upload, tối đa 10MB',"error", 7);
      $(this).val(null);
      return false;
    }
    if(typeof (FileReader) != "undefined"){
      let imagePreview = $("#image-edit-profile");
      imagePreview.empty();

      fileReader = new FileReader();
      fileReader.onload = function(element) {
        $("<img>",{
          "src": element.target.result,
          "class": "avatar img-circle",
          "id": "user-model-avatar",
          "alt": "avatar"
        }).appendTo(imagePreview);
      }
      imagePreview.show();
      fileReader.readAsDataURL(fileData);

      let formData = new FormData();
      formData.append("avatar",fileData);
      userAvatar = formData;
    }
    else{
      alertify.notify('Trình duyệt của bạn không hỗ trợ fileReader',"error", 7);
    }

  });

  $("#input-change-username").bind("change",function(){
    let username = $(this).val();
    let regexUserName = new RegExp("^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$");
    
    if(!regexUserName.test(username) || username.length < 3 || username.length > 17){
      alertify.notify("Username giới hạn trong khoảng 3 - 17 ký tự và không được chứa ký tự đặc biệt.", 7);
      $(this).val(originUserInfor.username);
      delete userInfo.username;
      return false;
    }
    userInfo.username = username;
  });
  $("#input-change-gender-male").bind("click",function(){
    let gender = $(this).val();

    if(gender !== "male"){
      alertify.notify("Oops! dữ liệu giới tính có vấn đề ?? đừng đùa với njja rùa :D", 7);
      $(this).val(originUserInfor.gender);
      delete userInfo.username;
      return false;
    }

    userInfo.gender = gender;
  });
  $("#input-change-gender-female").bind("click",function(){
    let gender = $(this).val();

    if(gender !== "female"){
      alertify.notify("Oops! dữ liệu giới tính có vấn đề ?? đừng đùa với njja rùa :D", 7);
      $(this).val(originUserInfor.gender);
      delete userInfo.username;
      return false;
    }

    userInfo.gender = gender;
  });
  $("#input-change-address").bind("change",function(){
    let address = $(this).val();

    if(address.length<3 || address.length >30){
      alertify.notify("Địa chỉ giới hạn trong khoảng 3-30 ký tự.", 7);
      $(this).val(originUserInfor.address);
      delete userInfo.address;
      return false;
    }

    userInfo.address = address;
  });
  $("#input-change-phone").bind("change",function(){
    let phone = $(this).val();
    let regexPhone = new RegExp("^(0)[0-9]{9,10}$");

    if(!regexPhone.test(phone)){
      alertify.notify("Số điện thoại phải bắt đầu từ số 0 và có 10 ký tự", 7);
      $(this).val(originUserInfor.phone);
      delete userInfo.phone;
      return false;
    } 

    userInfo.phone = phone;
  });
}

function callUpdateUserAvatar() {
  $.ajax({
    url: "/user/update-avatar",
    type: "put",
    cache: false,
    contentType: false,
    processData: false,
    data: userAvatar,
    success: function(result) {
    $(".user-modal-alert-success").find("span").text(result.message);
    $(".user-modal-alert-success").css("display","block");
    $('#navbar-avatar').attr('src',result.imgageSrc);
    originAvatarSrc = result.imgageSrc;
    $('#input-btn-cancel-update-user').click();
    },
    error: function(error) {
      $(".user-modal-alert-error").find("span").text(error.responseText);
      $(".user-modal-alert-error").css("display","block");

      $('#input-btn-cancel-update-user').click();
    }
  });
}

function callUpdateUserInfor() {
  $.ajax({
    url: "/user/update-infor",
    type: "put",
    data: userInfo,
    success: function(result) {
    $(".user-modal-alert-success").find("span").text(result.message);
    $(".user-modal-alert-success").css("display","block");
    
    originUserInfor = Object.assign(originUserInfor, userInfo);

    $('#navbar-username').text(originUserInfor.username);

    $('#input-btn-cancel-update-user').click();
    },
    error: function(error) {
      $(".user-modal-alert-error").find("span").text(error.responseText);
      $(".user-modal-alert-error").css("display","block");

      $('#input-btn-cancel-update-user').click();
    }
  });
}

$(document).ready(function() {

  originAvatarSrc = $('#user-modal-avatar').attr('src');
  originUserInfor = {
    username: $("#input-change-username").val(),
    gender: ($("#input-change-gender-male").is(':checked')) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
    address: $("#input-change-address").val(),
    phone: $("#input-change-phone").val()
  }

  updateUerInfo();

  $('#input-btn-update-user').bind('click', function(){
    if($.isEmptyObject(userInfo) && !userAvatar){
      alertify.notify('bạn phải thay đổi thông tin trước khi cập nhập dữ liệu', "error" , 7);
      return false;
    }
    if(userAvatar) {
      callUpdateUserAvatar();
    }
    if(!$.isEmptyObject(userInfo)){
      callUpdateUserInfor();
    }
  });
  $('#input-btn-cancel-update-user').bind('click', function(){
    userAvatar = null;
    userInfo = {};

    $('#input-change-avatar').val(null);
    $('#user-modal-avatar').attr("src",originAvatarSrc);

    $("#input-change-username").val(originUserInfor.username);
    (originUserInfor.gender === "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click();
    $("#input-change-address").val(originUserInfor.address);
    $("#input-change-phone").val(originUserInfor.phone);
  });
});