/**
 * Created by shaoruiguo on 15/6/13.
 */
var mime = {'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'bmp': 'image/bmp'};
var selectedHandler;
var bytesHandler;
var thisRef;
var MAX_HEIGHT = 300;
function selectImage(selectedFunc,thisValue) {
    selectedHandler = selectedFunc;
    thisRef = thisValue;
    var fileInput = document.getElementById("fileInput");
    if(fileInput==null){
        fileInput = document.createElement("input");
        fileInput.id = "fileInput";
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.style.height = "0px";
        fileInput.style.display = "block";
        fileInput.style.overflow = "hidden";
        document.body.insertBefore(fileInput,document.body.firstChild);
        fileInput.addEventListener('change', tmpSelectFile, false);
    }
    setTimeout(function(){fileInput.click()},100);
}
function tmpSelectFile(evt) {
    //console.log("image selected...");
    var file = evt.target.files[0];
    var type = file.type;
    if (!type) {
        type = mime[file.name.match(/\.([^\.]+)$/i)[1]];
    }
    var ret = myCreateObjectURL(file);
    tmpCreateImage && tmpCreateImage(ret,file);
    var fileInput = document.getElementById("fileInput");
    fileInput.value="";
}
function tmpCreateImage(uri,file) {
    var image = new Image();
    image.onload = function(){
        var canvas = document.createElement("canvas");
        if(!isWeixin() && image.height > MAX_HEIGHT) {
            //宽度等比例缩放
            image.width *= MAX_HEIGHT / image.height;
            image.height = MAX_HEIGHT;
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);
            var smallURL = canvas.toDataURL("image/png");
        } else {
            smallURL = uri;
        }
        image.width = image.height = 1;
        selectedHandler & selectedHandler(thisRef,smallURL,file);
    }
    image.src = uri;
    image.style.visibility = "hidden";
    document.body.appendChild(image);
}
function myCreateObjectURL(blob){
    if(window.URL != undefined)
        return window['URL']['createObjectURL'](blob);
    else
        return window['webkitURL']['createObjectURL'](blob);
}
function myResolveObjectURL(blob){
    if(window.URL != undefined)
        window['URL']['revokeObjectURL'](blob);
    else
        window['webkitURL']['revokeObjectURL'](blob);
}

function getImageData(file,bytesFunc,thisValue) {
    bytesHandler = bytesFunc;
    thisRef = thisValue;
    try{var reader = new FileReader();}
    catch(err) {console.log("no support FileReader")}
    function tmpLoad() {
        bytesHandler && bytesHandler(thisRef,this.result);
    }
    reader.onload = tmpLoad;
    reader.readAsArrayBuffer(file);
}
function isWeixin(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}