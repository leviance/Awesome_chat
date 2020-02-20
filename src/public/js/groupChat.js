function cancelCreateGroup() {
  $('#btn-cancel-group-chat').bind('click', function() {
    $('#groupChatModal .list-user-added').hide();
    if ($('ul#friends-added>li').length) {
      $('ul#friends-added>li').each(function(index) {
        $(this).remove();
      });
    }
  });
}

function callSearchFriend(element){
  if(element.which == 13 || element.type == "click"){
    let keyWord = $('#input-search-friends-to-add-group-chat').val();
    let regexKeywords = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);

    if(!keyWord.length){
      alertify.notify("Bạn chưa nhập nội dung tìm kiếm","error",7);
      return false;
    }
    if(!keyWord.match(regexKeywords)){
      alertify.notify(" Tên người dùng không được chứa ký tự đặc biệt !!! ","error",7);
      return false;
    }

    $.get('/contact/search-friends/' + keyWord , function(data) {
      $("#group-chat-friends").html(data); 
      // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
      addFriendsToGroup();

      // Action hủy việc tạo nhóm trò chuyện
      cancelCreateGroup();
    });
  }
}

function callCreateGroupChat(){
  $('#btn-create-group-chat').unbind('click').on('click', function(){
    let countUser = $("ul#friends-added").find("li");
    if(countUser.length < 2){
      alertify.notify("Bạn cần chọn tối thiểu 2 người để tạo một nhóm trò truyện!","error",7);
      return false;
    }

    let groupChatName = $("#input-name-group-chat").val();
    if(groupChatName.length < 5 || groupChatName.length > 30){
      alertify.notify("Tên nhóm phải lớn hơn 5 và nhỏ hơn 30 ký tự !","error",7);
      return false;
    }

    let arrayIds = [];
    $("ul#friends-added").find("li").each(function(index,item){
      arrayIds.push({userId: $(item).data("uid")});
    });

    Swal.fire({
      title: `Bạn có chắc muốn tạo nhóm ${groupChatName}`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ'
    }).then((result) => {
      if(!result.value){
        return false;
      }
      $.post("/group-chat/add-new",{
        arrayIds: arrayIds,
        groupChatName : groupChatName
      },function(data){
        // Step 01 hidden modal
        $('#input-name-group-chat').val("");
        $('#btn-cancel-group-chat').click();
        $('#groupChatModal').modal('hide');

        // Step 02  handle leftSide.ejs
        let subGroupChatName = data.groupChat.name;
        if(subGroupChatName.length > 15){
          subGroupChatName = subGroupChatName.substr(0,14);
        }
        let leftSideData = `
        <a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
          <li class="person group-chat" data-chat="${data.groupChat._id}">
              <div class="left-avatar">
                  <img src="images/users/logo.jpg" alt="">
              </div>
              <span class="name">
                  <span class="group-chat-name">
                  ${subGroupChatName}<span>...</span>
                  </span> 
              <//span>
              <span class="time"></span>
              <span class="preview convert-emoji"></span>
          </li>
        </a>`;

        $("#all-chat").find("ul").prepend(leftSideData);
        $("#group-chat").find("ul").prepend(leftSideData);

        // Step 03 : handle right side
        let rightSideData = `
        <div class="right tab-pane" data-chat="${data.groupChat._id}" id="to_${data.groupChat._id}">
          <div class="top">
              <span>To: <span class="name">${data.groupChat.name}</span></span>
              <span class="chat-menu-right">
                  <a href="#attachmentsModal_${data.groupChat._id}" class="show-attachments" data-toggle="modal">
                      Tệp đính kèm
                      <i class="fa fa-paperclip"></i>
                  </a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
              <span class="chat-menu-right">
                  <a href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">
                      Hình ảnh
                      <i class="fa fa-photo"></i>
                  </a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)" class="number-members" data-toggle="modal">
                      <span class="show-number-members">${data.groupChat.userAmount}</span>
                      <i class="fa fa-users"></i>
                  </a>
              </span>
          </div>
          <div class="content-chat">
              <div class="chat chat-in-group" data-chat="${data.groupChat._id}"></div>
          </div>
          <div class="write" data-chat="${data.groupChat._id}">
              <input type="text" id="write-chat-${data.groupChat._id}" class="write-chat chat-in-group" data-chat="${data.groupChat._id}">
              <div class="icons">
                  <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                  <label for="image-chat-${data.groupChat._id}">
                      <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${data.groupChat._id}">
                      <i class="fa fa-photo"></i>
                  </label>
                  <label for="attachment-chat-${data.groupChat._id}">
                      <input type="file" id="attachment-chat-${data.groupChat._id}" name="my-attachment-chat" class="attachment-chat chat-in-group" data-chat="${data.groupChat._id}">
                      <i class="fa fa-paperclip"></i>
                  </label>
                  <a href="javascript:void(0)" id="video-chat-group" >
                      <i class="fa fa-video-camera"></i>
                  </a>
                  <input type="hidden" id="peer-id" value="">
              </div>
          </div>
      </div>`; 
      $("#screen-chat").prepend(rightSideData);

      // Step 04 : call function changeScreenChat
      changeScreenChat();

      // Step 05 : handle imagesModal
      let imageModalData = `
        <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">Tất cả hình ảnh</h4>
                  </div>
                  <div class="modal-body">
                      <div class="all-images" style="visibility: hidden;"></div>
                  </div>
              </div>
          </div>
        </div>`;
        $('body').append(imageModalData);

        //  Step 06 : Call function girdPhotos
        gridPhotos(5);

        //  Step 07 : handle attachmentModal 
        let attachmentModalData = `
        <div class="modal fade" id="attachmentsModal_${data.groupChat._id}" role="dialog">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">Tệp đính kèm</h4>
                  </div>
                  <div class="modal-body">
                      <ul class="list-attachments"></ul>
                  </div>
              </div>
          </div>
        </div>`;

        $('body').append(attachmentModalData);

        // Step 08 : Emit new Group created 
        socket.emit("new-group-created",{groupChat: data.groupChat});

        // Step 09 : nothing to code

        // Step 10 : update oline 
        socket.emit("check-status");
      })
      .fail(function(response){
        alertify.notify(response.responseText,"error",7);
      });
    });
  });
}


$(document).ready(function (){
  $('#input-search-friends-to-add-group-chat').bind('keypress', callSearchFriend);
  $('#btn-search-friends-to-add-group-chat').bind('click', callSearchFriend);
  callCreateGroupChat();

  socket.on('response-new-group-created',function(data){
    // Step 01 hidden modal : nothing to code :|

    // Step 02  handle leftSide.ejs
    let subGroupChatName = data.groupChat.name;
    if(subGroupChatName.length > 15){
      subGroupChatName = subGroupChatName.substr(0,14);
    }
    let leftSideData = `
    <a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
      <li class="person group-chat" data-chat="${data.groupChat._id}">
          <div class="left-avatar">
              <img src="images/users/logo.jpg" alt="">
          </div>
          <span class="name">
              <span class="group-chat-name">
              ${subGroupChatName}<span>...</span>
              </span> 
          <//span>
          <span class="time"></span>
          <span class="preview convert-emoji"></span>
      </li>
    </a>`;

    $("#all-chat").find("ul").prepend(leftSideData);
    $("#group-chat").find("ul").prepend(leftSideData);

    // Step 03 : handle right side
    let rightSideData = `
    <div class="right tab-pane" data-chat="${data.groupChat._id}" id="to_${data.groupChat._id}">
      <div class="top">
          <span>To: <span class="name">${data.groupChat.name}</span></span>
          <span class="chat-menu-right">
              <a href="#attachmentsModal_${data.groupChat._id}" class="show-attachments" data-toggle="modal">
                  Tệp đính kèm
                  <i class="fa fa-paperclip"></i>
              </a>
          </span>
          <span class="chat-menu-right">
              <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
              <a href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">
                  Hình ảnh
                  <i class="fa fa-photo"></i>
              </a>
          </span>
          <span class="chat-menu-right">
              <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
              <a href="javascript:void(0)" class="number-members" data-toggle="modal">
                  <span class="show-number-members">${data.groupChat.userAmount}</span>
                  <i class="fa fa-users"></i>
              </a>
          </span>
      </div>
      <div class="content-chat">
          <div class="chat chat-in-group" data-chat="${data.groupChat._id}"></div>
      </div>
      <div class="write" data-chat="${data.groupChat._id}">
          <input type="text" id="write-chat-${data.groupChat._id}" class="write-chat chat-in-group" data-chat="${data.groupChat._id}">
          <div class="icons">
              <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
              <label for="image-chat-${data.groupChat._id}">
                  <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${data.groupChat._id}">
                  <i class="fa fa-photo"></i>
              </label>
              <label for="attachment-chat-${data.groupChat._id}">
                  <input type="file" id="attachment-chat-${data.groupChat._id}" name="my-attachment-chat" class="attachment-chat chat-in-group" data-chat="${data.groupChat._id}">
                  <i class="fa fa-paperclip"></i>
              </label>
              <a href="javascript:void(0)" id="video-chat-group" >
                  <i class="fa fa-video-camera"></i>
              </a>
              <input type="hidden" id="peer-id" value="">
          </div>
      </div>
  </div>`; 
  $("#screen-chat").prepend(rightSideData);

  // Step 04 : call function changeScreenChat
  changeScreenChat();

  // Step 05 : handle imagesModal
  let imageModalData = `
    <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Tất cả hình ảnh</h4>
              </div>
              <div class="modal-body">
                  <div class="all-images" style="visibility: hidden;"></div>
              </div>
          </div>
      </div>
    </div>`;
    $('body').append(imageModalData);

    //  Step 06 : Call function girdPhotos
    gridPhotos(5);

    //  Step 07 : handle attachmentModal 
    let attachmentModalData = `
    <div class="modal fade" id="attachmentsModal_${data.groupChat._id}" role="dialog">
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Tệp đính kèm</h4>
              </div>
              <div class="modal-body">
                  <ul class="list-attachments"></ul>
              </div>
          </div>
      </div>
    </div>`;

    $('body').append(attachmentModalData);

    // Step 08 : Emit new Group created : nothing to code :|

    // Step 09 : Emit when member received a group chat
    socket.emit("member-received-group-chat",{groupChatId: data .groupChat._id});

    // Step 10 : update oline 
    socket.emit("check-status");
  });
}); 