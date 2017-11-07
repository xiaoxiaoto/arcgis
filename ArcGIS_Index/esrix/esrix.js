//扩展ArcGIS jsapi

var dojoConfig = {
	async : true,
	packages : [{
		"name" : "esrix",
		"location" : location.pathname.replace(/\/[^/]+$/, "") + "/esrix"
	}]
};
