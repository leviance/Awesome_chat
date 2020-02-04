function callFindUsers(element){
  if(element.which == 13 || element.type == "click"){
    let keyWord = $('#input-find-users-contact').val();
    let regexKeywords = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);

    if(!keyWord.length){
      alertify.notify("Bạn chưa nhập nội dung tìm kiếm","error",7);
      return false;
    }
    if(!keyWord.match(regexKeywords)){
      alertify.notify(" Tên người dùng không được chứa ký tự đặc biệt !!! ","error",7);
      return false;
    }

    $.get('/contact/find-users/' + keyWord , function(data) {
      $("#find-user ul").html(data); 
      addContact(); // js/adaContact.js
      removeRequestContactSent(); // js/removeRequestContactSent.js
    });
  }
}

$(document).ready(function (){
  $('#input-find-users-contact').bind('keypress', callFindUsers);
  $('#btn-find-users-contact').bind('click', callFindUsers);

}); 