/**
 * author hexiaolei
 * 2014-05-02
 * fork on github: https://github.com/Hquestion/waterfallLayout
 *
 * 实现原理：
 * 1.获取所需瀑布流布局的所有节点
 * 2.先固定第一行元素的位置、宽高，保存第一行高度数组
 * 3.取高度最小的元素节点，把后面的元素放到其下面，重新计算存储高度
 * 4.重复第三步
 * #5.为提高性能，考虑到对节点内所有元素迭代计算较为庞大，对高度数组、当前页面元素个数进行存储，
 * 以便再往节点填充元素时，截取数组，确保只对新添加的元素迭代处理
 *
 * 使用说明：
 * $("selector").waterfallLayout({
 *      "marginLeft": 20,
        "marginTop": 15,
        "picPadding": 10,
        "numPerLine" : 4,
        "waterfallElement": "li"
 * })
 *
 * 重要提示：必须在图片加载、DOM绘制完成之后再进行布局，否则无法获取图片高度，导致页面错乱
 * 推荐使用jquery插件：jquery.waitforimages.js，以确保图片加载完成
 * jquery.waitforimages.js插件地址：https://github.com/alexanderdickson/waitForImages
 */
;(function($){
    var defaultSetting = {
        "marginLeft": 20,
        "marginTop": 15,
        "picPadding": 10,
        "numPerLine" : 4,
        "waterfallElement": "li"
    };

    /**
     * 存储高度数组及当前元素个数，截取数组，只对新添加的元素布局
     */
    var heightArr,currentElementLength;
    if(!heightArr){
        heightArr = [];
    }
    if(!currentElementLength){
        currentElementLength = 0;
    }

    $.fn.waterfallLayout = function(param){
        var setting = $.extend(defaultSetting, param || {});

        var $main = $(this);
        var liWidth = ($main.width() - setting.marginLeft * (setting.numPerLine - 1)) / Number(setting.numPerLine);
        var picWidth = liWidth - setting.picPadding * 2;
        $main.css({
            "list-style": "none",
            "position": "relative",
            "display": "block"
        });
        /**
         * 提取设置元素样式方法
         * @param $item 节点元素
         * @param eleWidth 节点宽度
         * @param picWidth 内部图片宽度
         */
        var setItemCss = function($item, eleWidth, picWidth){
            $item.css({
                "position": "absolute",
                "width": eleWidth + "px"
            });
            $item.find("img").css({
                "width": picWidth + "px",
                "padding": setting.picPadding + "px"
            });
        };
        /**
         * 提取方法，对新加入页面的元素布局
         * @param $item 节点元素
         */
        var layout = function($item){
            var minHeight = Math.min.apply(Math, heightArr);
            var minIndex = $.inArray(minHeight, heightArr);
            heightArr[minIndex] = ($item.height() + minHeight + setting.marginTop);
            $item.css({
                "top": (minHeight + setting.marginTop) + "px",
                "left": ($item.width() + setting.marginLeft) * minIndex + "px"
            });
        };

        var $allList = $main.find(setting.waterfallElement);
        var $list = $allList.slice(currentElementLength);
        currentElementLength = $allList.length;
        if($.isEmptyObject(heightArr) || heightArr.length === 0){
            $.each($list, function(index, item){
                setItemCss($(item), liWidth, picWidth);

                if(index < setting.numPerLine){
                    heightArr.push(Number($(item).height()));
                    $(item).css({
                        "top": "0px",
                        "left": ($(item).width()+ setting.marginLeft) * index + "px"
                    });
                }else{
                    layout($(item));
                }

            });
        }else{
            $.each($list, function(index, item){
                setItemCss($(item), liWidth, picWidth);
                layout($(item));
            });
        }
    };
})(jQuery);