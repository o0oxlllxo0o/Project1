//Su dung framework expressjs
const express=require('express');
const app=express();
const path=require('path');

//Cai dat thu muc tinh css,js,image...
app.use(express.static(path.join(__dirname,'src/public')));

const server=require('http').Server(app);

//Su dung socket 
const io=require('socket.io')(server);

//Su dung express-handlebars 
var exphbs  = require('express-handlebars');
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'src/views'));

//Them bo doc giai ma cac tep 
app.use(express.urlencoded({
	extended:true}));
app.use(express.json());

//Server lang nghe port 3000 hoac port tu cong moi truong khac
server.listen(process.env.PORT||3000,function(){
	console.log('Da ket noi');

});
/////////////////////////////////////////////////////
var list=[""];//Danh sach nguoi dang nhap
var listId=[""];//Danh sach socketId nguoi dang nhap

//Xu li du lieu khi co nguoi dang nhap
io.on("connection",function(socket){
	console.log(socket.id);
	listId.push(socket.id);
	console.log('Co nguoi ket noi');//Thog bao co nguoi ket noi

	//Neu danh sach co nguoi thi gui toan bo danh sach cho nguoi moi vao
	if(list.length>1)socket.emit('list',list);

	//Them nguoi vao he thong neu nhu ten dang nhap khong trung voi ten nguoi da dang ky
	socket.on("user-name",function(data){
		var ok=true;
		for(var i=0;i<list.length;i++){
			//Kiem tra xem co trung ten hay khong
			if(data==list[i]){
				console.log('trung ten');
				ok=false;
				break;
			}
		}
		//Ten hop le them vao danh sach
		if(ok){
			list.push(data);	
			socket.broadcast.emit("confirm-name",data);//Gui ten den tat ca nguoi dung online
			socket.emit("name",data);//Gui lai ten cho chinh nguoi dung
		}
		//Ten khong hop le
		else{
			console.log("error");
			socket.emit("Erorr",ok)
		} 
		console.log(list);
	})
	//Gui tin nhan cho nhung nguoi cung he thong
	socket.on("client-send",function(data){
		console.log(data);
		socket.broadcast.emit("server-send",data);
	})

	//Xu ly nhung nguoi thoat khoi app
	socket.on('disconnect',function(){
		for(var i=1;i<listId.length;i++){
			if(listId[i]==socket.id){
				io.sockets.emit('remove',list[i]);
				listId.splice(i,1);
				list.splice(i,1);
				break;
			}
		}
		console.log(list);
	})
})

//Tra ve tranh home
app.get('/',function(req,res){
	res.render('home');
})

