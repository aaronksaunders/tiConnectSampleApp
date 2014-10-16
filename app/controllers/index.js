function doMenuClick() {

}

/**
 *
 */
function doAddItemClicked() {
	var controller = Alloy.createController("newItem");
	controller.open(function(_response) {

		Ti.API.info('_response from add ' + JSON.stringify(_response, null, 2));
		if (_response.success) {
			// i have some data to add
		} else {
			// no data to add
		}
	});
}

/**
 *
 */
function drawList() {
	// create the collection
	var collection = Alloy.createCollection("Location");

	// fetch all items with promise
	var promise = collection.fetch().promise;

	promise.then(function(_data) {

		// clear the list
		$.section.deleteItemsAt(0, $.section.items.length);

		// this is pretty straight forward, assigning the values to the specific
		// properties in the template we defined above
		var items = [];
		for (var i in _data.models) {
			// add items to an array
			items.push({
				title : {
					text : _data.models[i].get('title') || 'Missing'// assign the values from the data
				},
				subtitle : {
					text : _data.models[i].get('address') || 'Missing'// assign the values from the data
				},
			});
		}

		// add the array, items, to the section defined in the view.xml file
		$.section.setItems(items);

	}, function(_error) {
		Ti.API.error(JSON.stringify(_error, null, 2));
		alert(JSON.stringify(_error, null, 2));
	});
}


$.homeWindow.add($.homeList);
$.getView().open();
drawList();

/**
 * saves an object
 */
function saveObject() {

	// the IBM Bluemix documentation specifies how the data must be formatted for uploading
	// so we set up the dataas such and save it to the model.
	var data = {
		"attributes" : {
			"title" : "Test With Class Name",
			"address" : "1134 Buchanan St, NW",
			"_geoloc" : [151.201523, -33.86887]
		}
	};

	// create the model
	var model = Alloy.createModel("Location");

	// call save, passing the data, and getting a promise in return
	var $promise = model.save(data);

	// handle success or error with the promise
	$promise.promise.then(function(_response) {
		console.log(JSON.stringify(_response, null, 2));
	}, function(_error) {
		console.log(JSON.stringify(_error, null, 2));
	});
}

false && saveObject();

if (false) {
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

