$(document).ready(function() {
  $('#link-read-more-contacts-sent').bind('click',function(){
    let skipNumber = $('#request-contact-sent').find('li').length;
    $.get(`/contact/read-more-contacts-sent/${skipNumber}`, function(newContactUsers){
      if(!newContactUsers.length){
        alertify.notify("Bạn không còn danh sách nào để xem nữa !", "error" , 7);
        return false;
      }
      newContactUsers.forEach(function(user){
        $("#request-contact-sent").find('ul').append(`
            <li class="_contactList" data-uid="${user._id}">
              <div class="contactPanel">
                  <div class="user-avatar">
                      <img src="images/users/${user.avatar}" alt="">
                  </div>
                  <div class="user-name">
                      <p>
                         ${user.username}
                      </p>
                  </div>
                  <br>
                  <div class="user-address">
                      <span>&nbsp ${(user.address !== null) ? user.address : ""}</span>
                  </div>
                  <div class="user-remove-request-contact-sent action-danger display-important" data-uid="${user._id}">
                      Hủy yêu cầu
                  </div>
              </div>
          </li>`);
      });
      removeRequestContactSent();
    });
  });
});