$(document).ready(function() {
  $('#link-read-more-all-chat').bind('click',function(){
    let skipPersonal = $('#all-chat').find('li:not(.group-chat)').length;
    let skipGroup = $('#all-chat').find('li.group-chat').length;
   
    $.get(`/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`, function(data){
      if(data.leftSideData.trim() === ""){
        alertify.notify("Bạn không còn cuộc trò chuyện nào để xem nữa !", "error" , 7);
        return false;
      }
    
      // Step 01 : handle leftSide
      $("#all-chat").find("ul").append(data.leftSideData);

      //  Step 02 : handle scroll left
      resizeNineScrollLeft();
      nineScrollLeft();
     
      // Step 03 : handle rightSide
      $("#screen-chat").append(data.rightSideData);
      
      // Step 04 : call function screenChat
      changeScreenChat();
      
      // Step 05 : convert imoji
      //convertEmoji();
      
      // Step 06 : handle imageModal
      $("body").append(data.imageModalData);
      
      // Step 07 : call function girdPhotos
      gridPhotos(5);
      
      // Step 08 : handle attachmentModal
      $("body").append(data.attachmentModalData);
      
      // Step 09 : updata online
      socket.emit("check-status");

      // call read more message
      readMoreMessages(); 
      
    });
  });
});