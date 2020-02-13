function textAndEmoijChat(divId){
  $(".emojionearea").unbind("keyup").on("keyup", function(element){
    let currentEmojioneArea = $(this);
    if(element.which == 13){
      let targetId = $(`#write-chat-${divId}`).data("chat");
      let messageVal = $(`#write-chat-${divId}`).val();

      if(!targetId.length || !messageVal.length){
        return false;
      }
      let dataTextEmoijForSend = {
        uid: targetId,
        messageVal: messageVal
      }
      if($(`#write-chat-${divId}`).hasClass('chat-in-group')){
        dataTextEmoijForSend.isChatGroup = true;
      }

      // call send message 
      $.post("/message/add-new-text-emoji",dataTextEmoijForSend, function(data){
        let dataToEmit = {
          message: data.message,

        };

        let messageOfMe = $(`<div class="bubble me" data-mess-id="${data.message._id}"></div>`);
        messageOfMe.text(data.message.text);
        let convertEmojiMessage = emojione.toImage(messageOfMe.html());


        if(dataTextEmoijForSend.isChatGroup){
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" alt="" class="avatar-small" title="${data.message.sender.name}">`;
          messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId;
        }
        else{
          messageOfMe.html(convertEmojiMessage); 
          dataToEmit.contactId = targetId;  
        }
         
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);

        $(`#write-chat-${divId}`).val("");
        currentEmojioneArea.find(".emojionearea-editor").text("");

        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-real-time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

        $(`.person[data-chat=${divId}]`).on("tricker.moveConversationToTheTop",function(){
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("tricker.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("tricker.moveConversationToTheTop");

        // emit real time
        socket.emit("chat-text-emoij",dataToEmit);

        // emit remove typing real-time
        typingOff(divId);

        let check = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif");
        if(check.length){
          check.remove();
        }
      }).fail(function(response){
        alertify.notify(response.responseText,"error",7);
      });

    }
  });
}

$(document).ready(function(){
  socket.on("response-chat-text-emoij", function(response){
    let divId = "";

    // step 01: handle message data before show
    let messageOfYou = $(`<div class="bubble you" data-mess-id="${response.message._id}"></div>`);
    messageOfYou.text(response.message.text);
    let convertEmojiMessage = emojione.toImage(messageOfYou.html());


    if(response.currentGroupId){
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" alt="" class="avatar-small" title="${response.message.sender.name}">`;
      messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);

      divId = response.currentGroupId;
    }
    else{
      messageOfYou.html(convertEmojiMessage);  
      divId = response.currentUserId;
    }

    // step 02 : append message to screen
    if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")){
      $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
      nineScrollRight(divId);

      increaseNumberMessageGroup(divId); 
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-real-time")
    }

    // step 03 : remove all data at input : nothing to code 

    // step 04 : change data preview and time in leftside 
    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
    $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));

    // step 05 : move conversation to top
    $(`.person[data-chat=${divId}]`).on("tricker.moveConversationToTheTop",function(){
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("tricker.moveConversationToTheTop");
    });
    $(`.person[data-chat=${divId}]`).trigger("tricker.moveConversationToTheTop");

    // step 06 : emit real time : nothing to code
  });
});