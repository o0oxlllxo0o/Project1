
const socket = io('https://chatbot-duan1.herokuapp.com');   //Xu dung socket de bat su kien 

var news=0;
var newsMasage=document.getElementById('newsMasage');
//Xu lu dong mo chat
function openForm() {
  document.getElementById("myForm").style.display = "block";
  news=0;
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  news=0;
}

//Xu ly noi dung chat
var uname=document.getElementById('uname');                 //Lay ten nguoi dung

var button=document.getElementById('button-login');

var myUL=document.getElementById('myUL');                   //Khung hien tin nhan

//Gui ten nguoi dung muon dang ky ve he thong
button.addEventListener('click',function(){
    socket.emit("user-name",uname.value);
})

//Xu ly ten nguoi dung
var user_name=document.getElementById('user-name');         //Lay the co chua ten nguoi dung

    //Xu ly ten nguoi dung khi server chap nhan ten hop le
    socket.on('confirm-name',function(data){
    var newPerson=document.createElement('li');             //Tao them mot the de chua ten nguoi dung
    newPerson.innerHTML="<a>" +data+ "</a>";                //Gan ten nguoi dung vao the
    myUL.appendChild(newPerson);                            //Them vao danh sach nguoi dang online
})

//Hien thi danh sach nhung nguoi dang online     
socket.on('list',function(data){
    for(var i=1;i<data.length;i++){
        var newPerson=document.createElement('li');
        newPerson.innerHTML="<a>" +data[i]+ "</a>";
        myUL.appendChild(newPerson);
    }
    
})

//Hien thi ten nguoi dung 
socket.on('name',function(data){
    user_name.innerHTML="<b>"+data+"</b>";
    document.getElementById('id01').style.display="none";
})

//Xu ly khi co nguoi thoat khoi app
socket.on('remove',function(data){
    var List=myUL.children;
    for(var i=0;i<List.length;i++){
        if(List[i].textContent==data){
            List[i].style.display='none';
        }
    }
})

//Xu ly tin nhan
var send=document.getElementById('send');//Nut gui
var message=document.getElementById('message-input');//Tin nhan nguoi dung nhap
var request=document.getElementById('message-out');//Hien thi tin nhan

//Xu ly su kien nhan nut send
send.addEventListener('click',function(){

    //Kiem tra xem ti nhan co rong khong
    if(message.value!=""){

        //Gui tin nhan len server
        socket.emit("client-send", "<b>"+user_name.textContent+": "+"</b>" +message.value);
        
        //Hien thi tin nhan len khung

        var rq=document.createElement('div');
        var clear=document.createElement('div');
        clear.classList.add('clear');
        rq.classList.add('textRight');
        rq.innerHTML="<span>"+message.value+"</span>";
        request.appendChild(rq);
        request.appendChild(clear);
        message.value="";
        request.scrollTop=request.scrollHeight;//Chinh con chuot lan hien thi tai tin nhan vua moi gui
    }
})

//Xu ly tin nhan khi nhan duoc nhung nguoi dung khac
socket.on("server-send",function(data){
    news+=1;
    if(news!=0){
    newsMasage.textContent=" ("+news+")";
    }
	var rs=document.createElement('div');
	var clear=document.createElement('div');
    
	clear.classList.add('clear');
	rs.innerHTML="<span>"+data+"</span>";
    rs.classList.add('textLeft');
	request.appendChild(rs);//Hien thi tin nhan nhung nguoi khac
	request.appendChild(clear);
    request.scrollTop=request.scrollHeight;//Chinh con chuot lan hien thi den vi tri tin nhan moi nhat
	console.log(data);
})
//////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////

//Xu ly tim kiem ten trong danh sach nguoi dung dang online
function myFunction() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
//////////////////////////////////
socket.on("Error",function(data){
   if(data==false){
    alert("Ten dang nhap da co nguoi dung");
   }
});