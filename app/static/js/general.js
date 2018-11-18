function buildAPIUrl(uri) {
    return 'http://localhost:8080/api/v1/' + uri;
}

function sortJsonArrayByProperty(objArray, prop, direction){
    if (arguments.length<2) throw new Error("sortJsonArrayByProp requires 2 arguments");
    var direct = arguments.length>2 ? arguments[2] : 1; //Default to ascending

    if (objArray && objArray.constructor===Array){
        var propPath = (prop.constructor===Array) ? prop : prop.split(".");
        objArray.sort(function(a,b){
            for (var p in propPath){
                if (a[propPath[p]] && b[propPath[p]]){
                    a = a[propPath[p]];
                    b = b[propPath[p]];
                }
            }
            // convert numeric strings to integers
            a = a.match(/^\d+$/) ? +a : a;
            b = b.match(/^\d+$/) ? +b : b;
            return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
        });
    }
}

function notify(title, type, message) {
    // type: "notice", "info", "success", or "error".
	new PNotify({
		title : title,
		text : message,
		type : type,
		styling : 'bootstrap3',
		delay : 3000,
		buttons : {
			closer : true,
			sticker : false
		},
		animate : {
			animate : true,
			in_class : 'slideInDown',
			out_class : 'slideOutUp'
		}
	});
}