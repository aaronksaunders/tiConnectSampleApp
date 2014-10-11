$.index.open();

function saveObject() {
	var data = {
		"attributes" : {
			"title" : "Test With Class Name",
			"address" : "1134 Buchanan St, NW",
			"_geoloc" : [151.201523, -33.86887]
		}
	};

	var model = Alloy.createModel("Location");
	var $promise = model.save(data);

	$promise.promise.then(function(_response) {
		console.log(JSON.stringify(_response, null, 2));
	}, function(_error) {
		console.log(JSON.stringify(_error, null, 2));
	});
}

false && saveObject();

if (true) {
	var collection = Alloy.createCollection("Location");

	// FETCH ONE ITEM BY ID WITH PROMISE
	var $promise = collection.fetch({
		id : "e83b4bb4692e0798d54bd385544179547493349d"
	});

	$promise.promise.then(function(_result) {
		// get one item
		console.log("in then " + JSON.stringify(_result, null, 2));
		
		// FETCH ALL ITEMS WITH PROMISE
		return collection.fetch().promise;
	}).then(function(_result) {
		
		// get all items result
		console.log("in then all items " + JSON.stringify(_result, null, 2));

	}, function(_error) {
		console.log("in error " + _error);
	});
}

