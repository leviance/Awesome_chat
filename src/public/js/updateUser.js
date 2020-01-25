let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;

function updateUerInfo() {
  $('#input-change-avatar').bind('change', function() {
    let fileData = $(this).prop("files")[0];
    let math = ["image/png","image/jpg","image/jpeg"];
    let limit = 1048576 * 10;

    if($.inArray(fileData.type, math) === -1){
      alertify.notify('kiểu file không hợp lệ',"error", 7);
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
    userInfo.username = $(this).val();
  });
  $("#input-change-gender-male").bind("click",function(){
    userInfo.gender = $(this).val();
  });
  $("#input-change-gender-female").bind("click",function(){
    userInfo.gender = $(this).val();
  });
  $("#input-change-address").bind("change",function(){
    userInfo.adress = $(this).val();
  });
  $("#input-change-phone").bind("change",function(){
    userInfo.phone = $(this).val();
  });

}

$(document).ready(function() {
  updateUerInfo();

  originAvatarSrc = $('#user-modal-avatar').attr('src')
  console.log('dia chi cua anh la : ' + originAvatarSrc);
  $('#input-btn-update-user').bind('click', function(){
    if($.isEmptyObject(userInfo) && !userAvatar){
      alertify.notify('bạn phải thay đổi thông tin trước khi cập nhập dữ liệu', "error" , 7);
      return false;
    }
    $.ajax({
      url: "/user/update-avatar",
      type: "put",
      cache: false,
      contentType: false,
      processData: false,
      data: userAvatar,
      success: function(result) {
        //
      },
      error: function(error) {
        //
      }
    })
    console.log(userAvatar);
    console.log(userInfo);
  });
  $('#input-btn-cancel-update-user').bind('click', function(){
    userAvatar = null;
    userInfo = {};
    $('#user-modal-avatar').attr("src",originAvatarSrc);
  });
});