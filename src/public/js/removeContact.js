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
              
              socket.emit("remove-contact", {contactId: targetId});

              // All step handle affter remove contact
              // Step 0 : check active
              checkActive = $(`#all-chat`).find(`li[data-chat = ${targetId}]`).hasClass('active');

              // Step 01 : remove in left side 
              $("#all-chat").find(`ul a[href="#uid_${targetId}"]`).remove();
              $("#user-chat").find(`ul a[href="#uid_${targetId}"]`).remove();

              // Step 02 : remove in rigth side
              $("#screen-chat").find(`div#to_${targetId}`).remove();

              // Step 03 : remove image modal
              $("body").find(`div#imagesModal_${targetId}`).remove();

              // Step 04 : remove attachment modal 
              $("body").find(`div#attachmentsModal_${targetId}`).remove();

              //  Step 05 : click first conversation
              if(checkActive){
                // click vao phan tu dau tien cua cuoc tro truyen khi load 
                $("ul.people").find("a")[0].click();
              }
          }
      });
      });
      
  });
}
socket.on("response-remove-contact", function(user) {
  $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();  
  decreaseNumberNotiContact("count-contacts");
  
  // All step handle affter remove contact
  // Step 0 : check active
  checkActive = $(`#all-chat`).find(`li[data-chat = ${user.id}]`).hasClass('active');

  // Step 01 : remove in left side 
  $("#all-chat").find(`ul a[href="#uid_${user.id}"]`).remove();
  $("#user-chat").find(`ul a[href="#uid_${user.id}"]`).remove();

  // Step 02 : remove in rigth side
  $("#screen-chat").find(`div#to_${user.id}`).remove();

  // Step 03 : remove image modal
  $("body").find(`div#imagesModal_${user.id}`).remove();

  // Step 04 : remove attachment modal 
  $("body").find(`div#attachmentsModal_${user.id}`).remove();

  //  Step 05 : click first conversation
  if(checkActive){
    // click vao phan tu dau tien cua cuoc tro truyen khi load 
    $("ul.people").find("a")[0].click();
  }

});
$(document).ready(function() {
  removeContact();
});



