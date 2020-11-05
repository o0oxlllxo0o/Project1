const express=require('express');
const app=express();
const path=require('path');

app.use(express.static(path.join(__dirname,'src/public')));

const server=require('http').Server(app);
const io=require('socket.io')(server);


var exphbs  = require('express-handlebars');
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.urlencoded({
	extended:true}));
app.use(express.json());
server.listen(process.env.PORT||3000,function(){
	console.log('Da ket noi');

});
/////////////////////////////////////////////////////
var list=[""];
var listId=[""];
io.on("connection",function(socket){
	console.log(socket.id);
	listId.push(socket.id);
	console.log('Co nguoi ket noi');
	if(list.length>1)socket.emit('list',list);

	socket.on("client-send",function(data){
		console.log(data);
		socket.broadcast.emit("server-send",data);
	})
	socket.on("user-name",function(data){
		var ok=true;
		for(var i=0;i<list.length;i++){
			if(data==list[i]){
				console.log('trung ten');
				ok=false;
				break;
			}
		}
		if(ok){
			list.push(data);	
			io.sockets.emit("confirm-name",data);
			socket.emit("name",data);
		} 
		console.log(list);
	})
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
/////////////////////////////////////////////////////////
app.get('/',function(req,res){
	res.render('home');
})

