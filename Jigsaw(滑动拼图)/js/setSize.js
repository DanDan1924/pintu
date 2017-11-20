window.isload=false;
(function (doc, win) {
  var docEl = doc.documentElement,
	resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	recalc = function () {
	  var clientWidth = docEl.clientWidth>=750 ? 375 : docEl.clientWidth;
	  if (!clientWidth) return;
	  docEl.style.fontSize =(clientWidth / 7.5) + 'px';
	  isload=true;
	};

  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
  // doc.addEventListener('DOMContentLoaded', function(){document.body.setAttribute("class","loaded");}, false);//控制dom载入时候导致字体变化加过度效果
})(document, window);
