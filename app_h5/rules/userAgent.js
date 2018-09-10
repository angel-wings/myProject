var ua = navigator.userAgent.toLowerCase();
if (/ip(hone|od|ad)/.test(ua)) {
   	var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/),
      		version = parseInt(v[1], 10);
   	if(version >= 8){
      		document.documentElement.classList.add('hairlines');
      		var link = document.createElement('link');
		link.setAttribute("rel", "stylesheet");  
   		link.setAttribute("type", "text/css");  
   		link.setAttribute("href", "iphone-section.css");  
		document.getElementsByTagName('head')[0].appendChild(link);
   	}else{
   		// document.documentElement.classList.add('hairlines')
      		var link = document.createElement('link');
		link.setAttribute("rel", "stylesheet");  
   		link.setAttribute("type", "text/css");  
   		link.setAttribute("href", "normal-section.css");  
		document.getElementsByTagName('head')[0].appendChild(link);
   	}
}else if (/android/.test(ua)){
	var link = document.createElement('link');
	link.setAttribute("rel", "stylesheet");  
   	link.setAttribute("type", "text/css");  
   	link.setAttribute("href", "andriod-section.css");  
	document.getElementsByTagName('head')[0].appendChild(link);
}else{
		var link = document.createElement('link');
		link.setAttribute("rel", "stylesheet");  
   		link.setAttribute("type", "text/css");  
   		link.setAttribute("href", "normal-section.css");     
		document.getElementsByTagName('head')[0].appendChild(link);
}