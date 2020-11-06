const socket = io('https://chatbot-duan1.herokuapp.com');
var news=0;
var newsMasage=document.getElementById('newsMasage');

function openForm() {
  document.getElementById("myForm").style.display = "block";
  news=0;
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  news=0;
}

/////////////////////////////////////////////////////////
var uname=document.getElementById('uname');
var button=document.getElementById('button-login');
var myUL=document.getElementById('myUL');
button.addEventListener('click',function(){
    socket.emit("user-name",uname.value);
})
var user_name=document.getElementById('user-name');
    socket.on('confirm-name',function(data){
    var newPerson=document.createElement('li');
    newPerson.innerHTML="<a>" +data+ "</a>";
    myUL.appendChild(newPerson);
})
socket.on('list',function(data){
    for(var i=1;i<data.length;i++){
        var newPerson=document.createElement('li');
        newPerson.innerHTML="<a>" +data[i]+ "</a>";
        myUL.appendChild(newPerson);
    }
    
})
socket.on('name',function(data){
    user_name.innerHTML="<b>"+data+"</b>";
    document.getElementById('id01').style.display="none";
})
/////////////////////////////////////////////////////////
socket.on('remove',function(data){
    var List=myUL.children;
    for(var i=0;i<List.length;i++){
        if(List[i].textContent==data){
            List[i].style.display='none';
        }
    }
})
///////////////////////////////////////////////////////////////////////
var send=document.getElementById('send');
var message=document.getElementById('message-input');
var request=document.getElementById('message-out');
send.addEventListener('click',function(){
    if(message.value!=""){
        socket.emit("client-send", "<b>"+user_name.textContent+": "+"</b>" +message.value);
        var rq=document.createElement('div');
        var clear=document.createElement('div');
        clear.classList.add('clear');
        rq.classList.add('textRight');
        rq.innerHTML="<span>"+message.value+"</span>";
        request.appendChild(rq);
        request.appendChild(clear);
        message.value="";
        request.scrollTop=request.scrollHeight;
    }
})
//////////////////////////////////////////////////////////////
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
	request.appendChild(rs);
	request.appendChild(clear);
    request.scrollTop=request.scrollHeight;
	console.log(data);
})
//////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////
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