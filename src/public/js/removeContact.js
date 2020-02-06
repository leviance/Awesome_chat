function removeContact() {
  $('.user-remove-contact').unbind('click').on('click', function() {
      let targetId = $(this).data('uid');
      let username = $(this).parent().find('div.user-name p').text();

      Swal.fire({
        title: `Bạn có chắc muốn xóa ${username} khỏi danh bạ !`,
        text: "Hãy chắc chắn rằng bạn đã suy nghĩ kỹ :( ",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy bỏ'
      }).then((result) => {
        if(!result.value){
          return false;
        }
        $.ajax({
          url: "/contact/remove-contact",
          type: "delete",
          data: {
              uid: targetId
          },
          success: function(data) {
              $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();  
              decreaseNumberNotiContact("count-contacts");
            // sau này làm chức năng chat thì sẽ xóa tiếp user ở phần chat

              socket.emit("remove-contact", {
                  contactId: targetId
              });
          }
      });
      });
      
  });
}
socket.on("response-remove-contact", function(user) {
  $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();  
  decreaseNumberNotiContact("count-contacts");
  // sau này làm chức năng chat thì sẽ xóa tiếp user ở phần chat

});
$(document).ready(function() {
  removeContact();
});



