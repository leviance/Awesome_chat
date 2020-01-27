function decreaseNumberNotiContact(calssName){
  let currentValue = +$('.' + className).find("em").text();
  currentValue -= 1;

  if(currentValue === 0){
    $('.' + className).html('')
  }
  else {
    $('.' + className).html('(<em>'+ currentValue +'</em>)');
  }
}

function removeRequestContact () {
  
    $('.user-remove-request-contact').bind('click', function(){
      let targetId = $(this).data('uid');
      let calssName = "count-request-contact-sent";
      $.ajax({
        url: "/contact/remove-request-contact",
        type: "delete",
        data : {uid: targetId},
        success: function(data){
          $("#find-user").find('div.user-remove-request-contact[data-uid = ' + targetId + "]").hide();
          $("#find-user").find('div.user-add-new-contact[data-uid = ' + targetId + "]" ).css("display","inline-block");
          decreaseNumberNotiContact(calssName);
        }
      });
    });
}