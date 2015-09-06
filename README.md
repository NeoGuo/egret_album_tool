# egret-album-tool
调用用户手机相册，实现照片的预览和上传。注意仅支持浏览器运行模式！APP打包模式是不支持的，需要另外的实现方式。

使用方式：

###第一步：配置第三方库###

* 将本库中的ext目录，放置到您的项目目录下（放到别的路径下也可以，根据您的需求请自便）
* 打开项目的egretProperties.json文件，在"modules"数组中增加：{"name": "uploader","path": "ext/uploader"}
* 如果引用不到，请检查路径设置是否正确

###第二步：调用###

```
//调用相册，选择一张图片
selectImage(this.selectedHandler,this);
//在回调函数中，接收3个参数:
//thisRef : 就是this的引用，上面传入的那个this
//imgURL : 是选择的图片的缩略图的字符串数据(不是原图)，您可以用RES加载，来实现预览
//file : 就是选择的那个照片文件引用，如果要上传原始数据，需要引用
private selectedHandler(thisRef:any,imgURL:string,file:Blob):void {
	//用RES加载，即可显示到Egret中实现预览
    RES.getResByUrl(imgURL,thisRef.compFunc,thisRef,RES.ResourceItem.TYPE_IMAGE);
}
```

```
//如果要上传，需要获取照片的原始数据，传递的参数是：
//file : 就是上面selectedHandler回调中得到的那个照片文件引用
//bytesHandler : 回调函数，因为加载是异步的，加载完成后就调用回调函数
//this : 同上
getImageData(file,this.bytesHandler,this);
//回调函数中，接收2个参数：
//thisRef : this引用
//imgBytes : 照片的原始数据，类型是ArrayBuffer
private bytesHandler(thisRef:any,imgBytes:ArrayBuffer):void {
    console.log("大图数据:"+imgBytes);
}
```

已知问题：

* iOS下用摄像头拍照的照片，角度不对(http://blog.csdn.net/cdnight/article/details/35236793)
