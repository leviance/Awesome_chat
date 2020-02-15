function videoChat(divId){
  $(`#video-chat-${divId}`).unbind("click").on("click",function(){
    let targetId = $(this).data("chat");
    let callerName = $("#navbar-username").text();

    let dataToEmit = {
      listenerId : targetId,
      callerName : callerName
    };

    //  Step 01 : of caller
    socket.emit("caller-check-listener-online-or-not",dataToEmit)
  });
}

$(document).ready(function(){
  // Step 02 : of caller
  socket.on("server-send-listener-is-offline",function(){
    alertify.notify("Người dùng này hiện không trực tuyến !","error",7);
  });

  let getPeerId = "";
  const peer = new Peer();
  peer.on("open", function(peerId) {
    getPeerId = peerId;
  });
  // Step 03 ; of listener
  socket.on("server-request-peer-id-of-listener",function(response){
    let listenerName = $("#navbar-username").text();
    let dataToEmit = {
      callerId : response.callerId,
      listenerId : response.listenerId,
      callerName : response.callerName,
      listenerName: listenerName,
      listenerPeerId : getPeerId
    };

    //  Step 04 : of listener
    socket.emit("listener-emit-peer-id-to-server",dataToEmit);
  });

  //  Step 05 : of caller
  socket.on("server-send-peer-id-of-listener-to-caller",function(response){
    let dataToEmit = {
      callerId : response.callerId,
      listenerId : response.listenerId,
      callerName : response.callerName,
      listenerName: response.listenerName,
      listenerPeerId : response.listenerPeerId
    };
    
    // Step 06 : of caller
    socket.emit("caller-request-call-to-server",dataToEmit);

    let timerInterval;
    Swal.fire({
      title: `Đang gọi cho &nbsp; <span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
      html: `
        Thời gian: <strong style="color: #d43f3a;"></strong> Giây. <br/><br/>
        <button id="btn-cancel-call" class="btn btn-danger">
          Hủy cuộc gọi.
        </button>
      ` ,
      backdrop: "rgba(85,85,85,0.4)",
      width: "52rem",
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () =>{
        $("#btn-cancel-call").unbind("click").on("click",function(){
          Swal.close();
          clearInterval(timerInterval);

          // Step 07 of caller 
          socket.emit("caller-cancel-request-call-to-server",dataToEmit);
        });

        Swal.showLoading();
        timerInterval = setInterval(() =>{
          Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft()/ 1000);
        },1000);
      },
      onOpen: () => {
        // Step 12 : of caller
        socket.on("server-send-reject-call-to-caller",function(response){
          Swal.close();
          clearInterval(timerInterval);

          Swal.fire({
            type: "infor",
            title: `<span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; đã từ chối cuộc gọi !`,
            backdrop: "rgba(85,85,85,0.4)",
            width: "52rem",
            allowOutsideClick: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Xác nhận'
          });
        });

        // Step 13 : of caller
        socket.on("server-send-access-call-to-caller",function(response){
          Swal.close();
          clearInterval(timerInterval);
          console.log("caller okkkkkk");
          // 
        });
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      return false;
    });
  });

  // Step 08 : of listener
  socket.on("server-send-request-call-to-listener",function(response){
    let dataToEmit = {
      callerId : response.callerId,
      listenerId : response.listenerId,
      callerName : response.callerName,
      listenerName: response.listenerName,
      listenerPeerId : response.listenerPeerId
    };

    let timerInterval;
    Swal.fire({
      title: `<span style="color: #2ECC71;">${response.callerName}</span> &nbsp; Muốn trò truyện video với bạn <i class="fa fa-volume-control-phone"></i>`,
      html: `
        Thời gian: <strong style="color: #d43f3a;"></strong> Giây. <br/><br/>
        <button id="btn-reject-call" class="btn btn-danger">
          Từ chối.
        </button>
        <button id="btn-access-call" class="btn btn-success">
          Đồng ý.
        </button>
      ` ,
      backdrop: "rgba(85,85,85,0.4)",
      width: "52rem",
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () =>{
        $("#btn-reject-call").unbind("click").on("click",function(){
          Swal.close();
          clearInterval(timerInterval);

          // Step 10 : of listener
          socket.emit("listener-reject-request-call-to-server",dataToEmit);
        });

        $("#btn-access-call").unbind("click").on("click",function(){
          Swal.close();
          clearInterval(timerInterval);

          // Step 11 : of listener
          socket.emit("listener-access-request-call-to-server",dataToEmit);
        });
        

        Swal.showLoading();
        timerInterval = setInterval(() =>{
          Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft()/ 1000);
        },1000);
      },
      onOpen: () =>{
        // Step 09 : of listener
        socket.on("server-send-cancel-request-call-to-listener",function(response){
          Swal.close();
          clearInterval(timerInterval);
        });

        // Step 14 : of listener
        socket.on("server-send-access-call-to-listener",function(response){
          Swal.close();
          clearInterval(timerInterval);
          console.log("Listener okkkkkk");
          // 
        });
      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      return false;
    });
  });


});