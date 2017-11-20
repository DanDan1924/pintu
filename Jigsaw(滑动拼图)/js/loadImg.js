var imgList=[
	"images/slogan@2x.png",
	"images/title@3x.png",
	"images/door@2x.png",
	"images/close@2x.png",
	"images/vr_bg@2x.png",
	"images/door@2x.png",
	"images/owhatlogo@2x.png",

	"images/fang/1.png",
	"images/fang/2.png",
	"images/fang/3.png",
	"images/fang/4.png",
	"images/fang/5.png",
	"images/fang/6.png",
	"images/fang/7.png",
	"images/fang/8.png",
	"images/fang/9.png",
	"images/fang/10.png",
	"images/fang/11.png",
	"images/fang/12.png",
	"images/fang/13.png",
	"images/fang/14.png",
	"images/fang/15.png",
	"images/fang/16.png",
	"images/fang/17.png",
	"images/fang/18.png",
	// "images/fang/19.png",
	// "images/fang/20.png",

	"images/chang/1.png",
	"images/chang/2.png",
	"images/chang/3.png",
	"images/chang/4.png",
	"images/chang/5.png",
	"images/chang/6.png",
	"images/chang/7.png",
	"images/chang/8.png",
	"images/chang/9.png",
	"images/chang/10.png",
	"images/chang/11.png",
	"images/chang/12.png",
	"images/chang/13.png",
	"images/chang/14.png",
	"images/chang/15.png",
	"images/chang/16.png",
	"images/chang/17.png",
	"images/chang/18.png",
	// "images/chang/19.png",
	// "images/chang/20.png",		
	"images/bg_puzzle@2x.png",
	"images/title_bg@2x.jpg",
];
(function (doc, win) {
  doc.addEventListener('DOMContentLoaded', function(){
	  var load=document.getElementById("loadding");
	  var loadpercent=document.getElementById("loadPer");
	  var len=imgList.length;
	  var single=100/len;
	  var curPercent=0;
	  var imgArr=new Array();
	  var inter=null;
	  for(var i=0;i<len;i++){
		  imgArr[i]=new Image();
		  imgArr[i].src=imgList[i];
		  imgArr[i].index=i;
		  imgArr[i].onload=function(){
		  	   curPercent+=single;
			   if((curPercent+single)>=100){
			  	  curPercent=100;
				  // loadpercent.innerHTML=parseInt(curPercent)+"%";
				  setTimeout(function(){
					  load.style.display="none";
					  load.remove();
					  document.body.className="loaded";
				},500);
			   }
			   // loadpercent.innerHTML=parseInt(curPercent)+"%";
		  }
	  }
	  if(len==0){
	  	// loadpercent.innerHTML=100+"%";
	  	 setTimeout(function(){
			  load.style.display="none";
			  load.remove();
			  document.body.className="loaded";
		},1000);
	  }
  }, false);
})(document, window);