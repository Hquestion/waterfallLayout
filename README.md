waterfallLayout
===============

瀑布流布局插件

 使用说明：
===============

$("selector").waterfallLayout({
         "marginLeft": 20,
        "marginTop": 15,
        "picPadding": 10,
        "numPerLine" : 4,
        "waterfallElement": "li"
    })
    
 重要提示：必须在图片加载、DOM绘制完成之后再进行布局，否则无法获取图片高度，导致页面错乱
 推荐使用jquery插件：jquery.waitforimages.js，以确保图片加载完成
 jquery.waitforimages.js插件地址：https://github.com/alexanderdickson/waitForImages
