//declar variables
var sys = require('util'),
    http = require('http'),
    exec = require('child_process').exec,
    url = require("url"),  
    path = require("path"),  
    //async = require('async'),
    fs = require("fs"),
    //pwd = process.argv.splice(2);
    pwd = process.cwd()


//getting output from a command issued
function command(com,callback) {
    var html;
    exec(com, function(error, stdout, stderr){
    var child = stdout;
    var raw = child.match(/^.*([]+|$)/gm);
    var len = raw.length;
    var arr = new Array(len);
    for (i=0;i<=len;i++){
        arr[i] = "<br><a href = '"+raw[i] + "'>" + raw[i] +"</a>";
    }
    html = arr.join("\n");
    console.log("this is command "+html);
    callback(html);

    });
};


    http.createServer(function(request, response) {  
        var uri = url.parse(request.url).pathname;  
        //var filename = path.join(process.cwd(), uri);  
        var filename = path.join(pwd, uri);  
        //var html;
        console.log(uri);
        console.log(filename);
        var str = request.url;
        //if last char of the url is /, then it is a directory i'm reffering
        var last = str.charAt(str.length-1);
        ///////////////
            if (last == '/') {
            var com = "ls -a -p " + pwd + uri;
            command(com, function(result){    
            response.writeHeader(200, {"Content-Type": "text/html"});
            response.write('<li>The list is here!</li>');
            response.write('<br>'+pwd+uri);
            //response.addListener('data',function(html){
                //html = command('ls -a');
                response.end(result);
                console.log('html received');
            //});

                });
            return;
        }

        path.exists(filename, function(exists) {  
        console.log(uri);
        console.log(filename);
            if(!exists) {  
                response.writeHead(404, {"Content-Type": "text/plain"});  
                response.end("404 Not Found\n");  
                return;  
            }  

            fs.readFile(filename, "binary", function(err, file) {  
                if(err) {  
                    response.writeHead(500, {"Content-Type": "text/plain"});  
                    response.end(err + "\n");  
                    return;  
                }  

                response.writeHead(200);  
                response.end(file, "binary");  
            });  
        });  
    }).listen(1234);  


sys.puts('server running!!!!');
