/**
 * 
 */
var httpUtil = {
		

	httpGetAsync: function(theUrl, callback){
		
	    var xmlHttp = new XMLHttpRequest();
	    xmlHttp.onreadystatechange = function() { 
	        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
	        	
	        	callback(xmlHttp.response);
	        }
	    };
	    xmlHttp.onloadend = function() {
	        if(xmlHttp.status == 404){
	        	
	        	callback(null);
	        }
	    };
	    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
	    xmlHttp.send(null);
	},

	parseXml: function(xmlStr){
		
		return (new window.DOMParser()).parseFromString(xmlStr, "text/html");
	},
	
	httpParseXml: function(url, callback){
		
		var self = this;
		this.httpGetAsync(url, function(response){
			
			var xml;
			if (response){
				
				xml = self.parseXml(response);
			}
			callback(xml);
		});
	}
}