var cArr=["p6","p5","p4","p3","p2","p1"];
var index=0;
$(".prev").click(
    function(){
        previmg()
    }
)
$(".next").click(
    function () {
        nextimg()
    }
)
function previmg(){  // 上一张
    cArr.unshift(cArr[5]);  // 向数组的开头添加元素，返回新的长度
    cArr.pop();   // 删除并返回数组的最后一个元素
    //i是元素的索引，从0开始
    //e为当前处理的元素
    //each循环，当前处理的元素移除所有的class，然后添加数组索引i的class
    $("li").each(function(i,e){
        $(e).removeClass().addClass(cArr[i]);
    })
    index--;
    if (index<0) {
        index=6;
    }
}
function nextimg(){  // 下一张
    cArr.push(cArr[0]);
    cArr.shift();
    $("li").each(function(i,e){
        $(e).removeClass().addClass(cArr[i]);
    })
    index++;
    if (index>6) {
        index=0;
    }
}

//点击class为p2的元素触发上一张照片的函数
$(document).on("click",".p2",function(){
    previmg();
    return false;//返回一个false值，让a标签不跳转
});
//点击class为p4的元素触发下一张照片的函数
$(document).on("click",".p4",function(){
    nextimg();
    return false;
});

//	鼠标移入nav时清除定时器
$("nav").mouseover(function(){
    clearInterval(timer);
})
//	鼠标移出nav时开始定时器
$("nav").mouseleave(function(){
    timer=setInterval(nextimg,4000);
})
//	进入页面自动开始定时器
timer=setInterval(nextimg,4000);