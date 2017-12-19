console.log("Inject Started!");

function saveBase64AsFile(base64, fileName) {
    
        var link = document.createElement("a");
        link.setAttribute("href", base64);
        link.setAttribute("download", fileName);
        link.click();
}
    
function calcFileSize(url){
    var str = url;
    //删除等号
    var equalIndex = str.indexOf('=');
    if(str.indexOf('=')>0)
    {
        str = str.substring(0,equalIndex);
    }
    //字符流大小
    var strLength = str.length;
    var fileLength = parseInt(strLength-(strLength/8)*2);
    return fileLength;
}

function dateFtt(fmt,date)   
{ //author: meizz   
  var o = {   
    "M+" : date.getMonth()+1,                   
    "d+" : date.getDate(),                      
    "h+" : date.getHours(),                    
    "m+" : date.getMinutes(),                  
    "s+" : date.getSeconds(),                  
    "q+" : Math.floor((date.getMonth()+3)/3),   
    "S"  : date.getMilliseconds()               
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 



(function() {
    var OrigWebSocket = window.WebSocket;
    var callWebSocket = OrigWebSocket.apply.bind(OrigWebSocket);
    var wsAddListener = OrigWebSocket.prototype.addEventListener;
    wsAddListener = wsAddListener.call.bind(wsAddListener);

    window.WebSocket = function WebSocket(url, protocols) {
        var ws;
        if (!(this instanceof WebSocket)) {
            // Called without 'new' (browsers will throw an error).
            ws = callWebSocket(this, arguments);
        } else if (arguments.length === 1) {
            ws = new OrigWebSocket(url);
        } else if (arguments.length >= 2) {
            ws = new OrigWebSocket(url, protocols);
        } else { // No arguments (browsers will throw an error)
            ws = new OrigWebSocket();
        }
        
        wsAddListener(ws, 'message', function(event) {
            //*******************main code here********************
            //to do something with event.data
            var type = event.data.split(",")[0].split(".")[1];
            if(type == "sync"){
                var syncTime = event.data.split(",")[1].split(".")[1];
                //console.log("Sync:"+syncTime);
            }
            else if(type == "png"){
                var list = event.data.split(";");
                console.log(list);
                for(var i = 0;i<list.length-1;i++){
                    //console.log(list[i])
                    if(list[i].split(",")[0].split(".")[1]=="png"){
                        //console.log(list[i]);
                        var data = list[i].split(",")[5].split(".")[1];
                        var fileLength = calcFileSize(data);
                        var imgurl = "data:image/png;base64," + data ;
                        var timestamp = new Date().getTime();
                        var filename = timestamp + ".png";
                        console.log(filename);
                        if(fileLength>200){
                            saveBase64AsFile(imgurl,filename);
                            //localStorage.setItem(filename,imgurl);   
                        }
                    }
                    
                } 
            }
            console.log("-----------------------------------")
            
        });
        return ws;
    }.bind();
   
    window.WebSocket.prototype = OrigWebSocket.prototype;
    window.WebSocket.prototype.constructor = window.WebSocket;

    var wsSend = OrigWebSocket.prototype.send;
    wsSend = wsSend.apply.bind(wsSend);
    OrigWebSocket.prototype.send = function(data) {
        // TODO: Do something with the sent data if you wish.
        return wsSend(this, arguments);
    };
})();