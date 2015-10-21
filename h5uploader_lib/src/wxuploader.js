/**
 * Created by shaoruiguo on 15/10/16.
 */
function selectImageWX(selectedFunc,thisValue) {
    selectedHandler = selectedFunc;
    thisRef = thisValue;
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            //alert(localIds[0]);
            tmpCreateImage(localIds[0]);
        }
    });
}