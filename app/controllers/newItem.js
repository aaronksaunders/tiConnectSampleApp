var args = arguments[0] || {};

// callback the is used when the user closes the window
var callbackOnClose = null;

/**
 * opens the window and handles sets the function to be called
 * when the user exits the window
 */
$.open = function(_callback) {
	$.getView().open({
		modal : true
	});

	callbackOnClose = _callback;
};

function doHandleBtnClicked(_event) {
	Ti.API.info(JSON.stringify(_event, null, 2));

	blurTextFields();

	// pass data back to index.js
	if (callbackOnClose) {
		callbackOnClose({
			success : _event.source.id === "okBtn",
			data : {
				title : $.name.value,
				address : $.address.value
			}
		});
	}

	// close window
	$.getView().close();
}

/**
 * blurs all text fields so the keyboard goes away
 */
function blurTextFields() {
	// login view
	_.each($.mainWindow.children, function(_i) {
		_i.value !== undefined && _i.blur();
	});

}