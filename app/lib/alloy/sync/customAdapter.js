function S4() {
	return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
}

function guid() {
	return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function InitAdapter() {
	//throw "localStorage persistence supported only with MobileWeb.";
	console.log(Alloy.CFG);
}

function Sync(method, model, opts) {

	var promise = $q.defer();

	var name = model.config.adapter.collection_name,
	    data = model.config.data,
	    resp = null;
	switch (method) {
	case "create":

		// set the className on the model
		model.attributes["className"] = name;

		// make http request
		superAgent.post(url + '/uploads')//
		.set('IBM-Application-Secret', Alloy.CFG.bluemix.appSecret)//
		.send([model.attributes])//
		.end(function(err, res) {
			//console.log(res.body.object);

			if (!err) {
				resp = res.body;
				model.attributes = {};
				_.isFunction(opts.success) && opts.success(resp.object[0]);
				promise.resolve(model);
			} else {
				_.isFunction(opts.error) && opts.error(err);
				promise.reject(err);
			}
		});
		break;

	case "read":

		var readURL = "";

		if (opts && opts.id || model && model.id) {
			readURL = url + '/objects/' + (opts && opts.id || model && model.id);
		} else {
			readURL = url + '/objects?classname=' + name + '&&';
		}

		superAgent.get(readURL)//
		.set('IBM-Application-Secret', Alloy.CFG.bluemix.appSecret)//
		.set('Accept', 'application/json')//
		//.timeout(10000)//
		.end(function(err, res) {
			//console.log(res.body.object);

			if (!err) {
				resp = res.body;

				_.isFunction(opts.success) && opts.success(resp);
				"read" === method && model.trigger("fetch sync");
				promise.resolve(model);
			} else {
				_.isFunction(opts.error) && opts.error(err);
				promise.reject(err);
			}
		});

		break;

	case "update":
		data[model.id] = model;
		storeModel(data);
		resp = model.toJSON();
		break;

	case "delete":
		var readURL = "";
		var objectId = (opts && opts.id || model && model.id);

		superAgent.del(url + '/objects/' + objectId)//
		.set('IBM-Application-Secret', Alloy.CFG.bluemix.appSecret)//
		.set('Accept', 'application/json')//
		.end(function(err, res) {

			if (!err) {
				resp = res.body;
				debugger;
				_.isFunction(opts.success) && opts.success(resp);
				
				// on delete, return the response, not model
				promise.resolve(resp);
			} else {
				_.isFunction(opts.error) && opts.error(err);
				promise.reject(err);
			}
		});
	}

	return promise;
}

var _ = require("alloy/underscore")._;
var $q = require("q");
var superAgent = require('superagent');

// THIS CAN BE MODEL SPECIFIC... I was being lazy
var url = "https://mobile.ng.bluemix.net:443/data/rest/v1/apps/" + Alloy.CFG.bluemix.appId;

module.exports.sync = Sync;

module.exports.beforeModelCreate = function(config) {
	config = config || {};
	config.data = {};
	InitAdapter();
	return config;
};

module.exports.afterModelCreate = function(Model) {
	Model = Model || {};
	Model.prototype.config.Model = Model;
	return Model;
};
