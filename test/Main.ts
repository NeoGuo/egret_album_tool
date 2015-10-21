class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;
    private icon:egret.Bitmap;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        var uiClass:any = egret.getDefinitionByName("LoadingUI");
        //this.loadingView = new LoadingUI();
        this.loadingView = new uiClass();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;
        this.icon = this.createBitmapByName("btn");
        this.icon.anchorOffsetX = this.icon.width/2;
        this.icon.anchorOffsetY = this.icon.height/2;
        this.icon.x = stageW / 2;
        this.icon.y = stageH / 2 - 60;
        this.icon.touchEnabled = true;
        this.addChild(this.icon);
        this.icon.addEventListener(egret.TouchEvent.TOUCH_TAP,this.doSelect,this);
    }
    private doSelect(evt:egret.TouchEvent):void {
        if(isWeixin())
            selectImageWX(this.selectedHandler,this);
        else
            selectImage(this.selectedHandler,this);
    }
    private selectedHandler(thisRef:any,imgURL:string,file:Blob):void {
        //alert("img selected"+imgURL);
        RES.getResByUrl(imgURL,thisRef.compFunc,thisRef,RES.ResourceItem.TYPE_IMAGE);
        //getImageData(file,thisRef.bytesHandler,thisRef);
    }
    private bytesHandler(thisRef:any,imgBytes:ArrayBuffer):void {
        console.log("大图数据:"+imgBytes);
    }
    private compFunc(texture:egret.Texture):void {
        //alert("compFunc"+texture);
        var imgReview:egret.Bitmap = new egret.Bitmap(texture);
        imgReview.touchEnabled = true;
        imgReview.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.removeImgReview,this);
        this.addChild(imgReview);
    }
    private removeImgReview(evt:egret.TouchEvent):void {
        var imgReview:egret.Bitmap = evt.currentTarget;
        this.removeChild(imgReview);
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

}


