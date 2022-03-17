var http = require('http');
var fs = require('fs');
//54.180.159.197:53868
var CUR_SERVER_REQ = 0;
const MAX_SERVER_REQ = 10;

var REQ_PER_USER = {};

var isTrue = true;


var app = http.createServer(function(req, res){
	thisDate = "화요일";
	//thisDate = new Date();
	//CUR_SERVER_REQ++;
	//console.log(req.connection.remoteAddress.split(":")[req.connection.remoteAddress.split(":").length-1].replaceAll(".","-"));
	//var cur_userAddress = req.connection.remoteAddress.split(":")[req.connection.remoteAddress.split(":").length-1].replaceAll(".","_").replaceAll("0","A").replaceAll("1","B").replaceAll("2","C").replaceAll("3","D").replaceAll("4","E").replaceAll("5","F").replaceAll("6","G").replaceAll("7","H").replaceAll("8","I").replaceAll("9","J");
	//eval("REQ_PER_USER."+req.connection.remoteAddress.split(":")[req.connection.remoteAddress.split(":").length-1].replaceAll(".","_").replaceAll("0","A").replaceAll("1","B").replaceAll("2","C").replaceAll("3","D").replaceAll("4","E").replaceAll("5","F").replaceAll("6","G").replaceAll("7","H").replaceAll("8","I").replaceAll("9","J"), )

	//if(Number.isNaN())

	var thisTime = new Date();
	try{
		console.log(thisDate+":"+ thisTime + " 번 요청됨 | 요청자 : "+req.connection.remoteAddress.split(":")[req.connection.remoteAddress.split(":").length-1] + " | 요청 URL : " + req.url);
		var url = req.url;
		if((CUR_SERVER_REQ < MAX_SERVER_REQ) && isTrue){
			fs.exists(url.replace("/", "").split("?")[0], function(exists){
				if(url.replace("/", "") == "index.js"){
					res.writeHead(401, {'Content-Type':'text/plain; charset=utf-8'});
					res.write("인증되지 않은 사용자");
					res.end();
				}else if(url.replace("/","").split("/")[0] == "protected"){
					res.writeHead(401, {'Content-Type':'text/plain; charset=utf-8'});
					res.write("인증되지 않은 사용자");
					res.end();
				}else{
					if(exists){
						//res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});


						/*
						if(url.split("?")[0] == "/src/font/barungo.woff2"){
							res.writeHead(200, {'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'public, max-age=30'});
							console.log("바런고요청");
						}
						*/

						if(fs.lstatSync(__dirname+url.split("?")[0]).isDirectory()){
							//Directory
							res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
							res.write("["+url+"] 해당 파일은 존재하지 않습니다");
							res.end();

						}else{
							//file
							res.writeHead(200, {'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'public, max-age=3'});

							res.end(fs.readFileSync(__dirname+url.split("?")[0]));
						}

						//res.end(fs.readFileSync(__dirname+url.split("?")[0]));

					}else{
						if(url.replace("/", "").split("?")[0].split(".")[1] == "do"){
							fs.exists("./protected/js/method/"+url.replace("/", "").split("?")[0].split(".")[0]+".js", function(exists){
								if(exists){
									if(url.split("?").length == 1){
										res.writeHead(202, {'Content-Type':'text/plain; charset=utf-8'});
										require("./protected/js/method/"+url.replace("/", "").split("?")[0].split(".")[0]+".js").init(req, res);
										res.end();
									}else{
										res.writeHead(202, {'Content-Type':'text/plain; charset=utf-8'});
										require("./protected/js/method/"+url.replace("/", "").split("?")[0].split(".")[0]+".js").init(req, res, url.split("?")[1]);
										res.end();
									}
								}else{
									res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
									res.write("존재하지 않는 메소드");
									res.end();
								}
							});
						}else if(url.replace("/", "").split("?")[0] == ""){
							res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
							res.end(fs.readFileSync(__dirname+"/index.html"));
						}else{
							res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});
							res.write("["+url+"] 해당 파일은 존재하지 않습니다");
							res.end();
						}
					}
				}
			});
		}else{
			res.writeHead(503);
			res.write("too many request");
			res.end();
		}
	}catch(e){
		console.log(e);
	}
});
app.listen(process.env.PORT);
/*
setInterval(()=>{
	if(CUR_SERVER_REQ > 0){
		CUR_SERVER_REQ--;
		console.log("리퀘스트 공간이 늘었습니다 : "+CUR_SERVER_REQ);
	}
}, 1000);
*/
