exports.definition = {
	config : {

		adapter : {
			type : "customAdapter",
			collection_name : "Locations"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here

			parse : function(_response) {
				
				// get all of the attributes to return to the model object
				var returnObject = _response.attributes;
				returnObject.createdAt = _response.createdAt;
				returnObject.modifiedAt = _response.modifiedAt;
				returnObject.objectId = _response.objectId;
				returnObject.id = _response.objectId;
				
				return returnObject;
			}
		});

		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			parse : function(_response) {
				
				// save the meta data from the response to the collection
				this.bookmark = JSON.parse(_response.bookmark);
				return _response.object;
			}
		});

		return Collection;
	}
};
