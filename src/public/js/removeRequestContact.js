
function removeRequestContact () {
  
    $('.user-remove-request-contact').bind('click', function(){
      let targetId = $(this).data('uid');
      $.ajax({
        url: "/contact/remove-request-contact",
        type: "delete",
        data : {uid: targetId},
        success: function(data){
          $("#find-user").find('div.user-remove-request-contact[data-uid = ' + targetId + "]").hide();
          $("#find-user").find('div.user-add-new-contact[data-uid = ' + targetId + "]" ).css("display","inline-block");
          decreaseNumberNotiContact(className = "count-request-contact-sent");
          socket.emit("remove-request-contact",{contactId: targetId});
        }
      });
    });
}

socket.on("response-remove-request-contact",function(user){
  $('.noti_content').find('div[data-uid ='+ user.id +']').remove();
  $("ul.list-notifications").find('li>div[data-uid ='+ user.id +']').parent().remove();

  // xoa o modal tab yeu cau ket ban

  decreaseNumberNotiContact(className = "count-request-contact-received");
  decreaseNumberNotification(className = "noti_contact_counter" ,1);
  decreaseNumberNotification(className = "noti_counter",1);
});