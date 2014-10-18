// global var for locations collection
// see https://github.com/appcelerator/alloy/blob/master/test/apps/models/binding_listview/alloy.js

// also see alloy.js where we have initiated the collecion; this is needed only
// if you are using model and collection binding
var Location = Alloy.Globals.Location;

/**
 *
 */
function doMenuClick() {
	// not using...
}

/**
 * when the user clicks in the button on IOS or selects the menu on android
 *
 * we will open a new window/controller and get the information for saving a
 * new model to the backend system.
 */
function doAddItemClicked() {
	var controller = Alloy.createController("newItem");
	controller.open(function(_response) {

		Ti.API.info('_response from add ' + JSON.stringify(_response, null, 2));
		if (_response.success) {
			// i have some data to add

			saveObject(_response.data);
		} else {
			// no data to add
			alert('User camcelled action');
		}
	});
}

/**
 * this function is called when NOT using model/collection binding
 */
function drawListWithNoBinding() {
	// create the collection
	var collection = Alloy.createCollection("Location");

	// fetch all items with promise, see readme for more information
	// on promises and the benefits over callback hell!!
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
				canEdit : true,
				_objectId : _data.models[i].id,
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
		// if there was and error getting the data, display error here
		Ti.API.error(JSON.stringify(_error, null, 2));
		alert("Error getting data from server\n" + JSON.stringify(_error, null, 2));
	});
}

/**
 * used with the binding
 */
function doTransform(_model) {
	var o = _model.toJSON();
	return {
		title : (o.title || 'Missing'),
		subtitle : (o.address || 'Missing'),
		objectId : _model.id
	};

}

/**
 * 
 */
function handleDeleteItem(_event) {
	Ti.API.info('-event ' + JSON.stringify(_event));
	var objectId = _event.section.getItemAt(_event.itemIndex).properties._objectId;

	var model = Alloy.createModel('Location', {
		id : objectId
	});
	model.destroy().promise.then(function(_response) {
		alert("Item Deleted Successfully");
	}, function(_error) {
		alert("Error " + JSON.stringify(_error, null, 2));
	});
}

function setUpEvents() {
	if (OS_IOS) {
		$.homeList.addEventListener('delete', handleDeleteItem);
	}
}

// here we are adding the ListView to the window programatically
// since we are using platform selectors in the index.xml view file.
//
// I have used this approach so I do not need to create multiple files
$.homeWindow.add($.homeList);

// open the main view in index.xml
$.getView().open();

// setup ListView Events
setUpEvents();

// ****
// SET TO FALSE TO SEE DEMONSTRATION WITHOUT BINDING
// ****

if (false) {
	drawListWithNoBinding();
} else {
	// fetching the data will trigger the application to update the
	// ListView and render the content
	var aPromise = Location.fetch().promise;
	aPromise.then(function(_data) {
		// dont really care, binding will handle this!
	}, function(_error) {
		alert(JSON.stringify(_error));
	});

}

/**
 * saves an object
 *
 * @params _params.title
 * @params _params.address
 */
function saveObject(_params) {

	// the IBM Bluemix documentation specifies how the data must be formatted for uploading
	// so we set up the dataas such and save it to the model.
	var data = {
		"attributes" : _params
	};

	// create the model
	var model = Alloy.createModel("Location");

	// call save, passing the data, and getting a promise in return
	var $promise = model.save(data).promise;

	// handle success or error with the promise
	$promise.then(function(_response) {
		console.log(JSON.stringify(_response, null, 2));
		alert("Item Saved Successfully");

		// update the List
		Alloy.Globals.Location.fetch();
	}, function(_error) {
		console.log(JSON.stringify(_error, null, 2));
		alert("Error saving object " + JSON.stringify(_error, null, 2));
	});
}

/**
 *
 */
function getOneItem(_objectId) {
	var collection = Alloy.createCollection("Location");

	// FETCH ONE ITEM BY ID WITH PROMISE
	var $promise = collection.fetch({
		id : _objectId /*"e83b4bb4692e0798d54bd385544179547493349d"*/
	});

	$promise.promise.then(function(_result) {
		// get one item
		console.log("in then " + JSON.stringify(_result, null, 2));

	}, function(_error) {
		console.log("in error " + _error);
	});
}

