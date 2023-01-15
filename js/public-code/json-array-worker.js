class ArrayWorker {
	InitWorker(data, cb){
		var self = this;

		this.data = data;
		this.html = "";
		this.GetProperties(function(answer) {
			if (!answer.error)
				self.descriptions = answer.descriptions

			cb(answer);
		});
	}


	GetProperties(cb) {
		if (!Array.isArray(this.data) || this.data.length == 0) {
			cb({description: null, error: true})
		}

		var descriptions = this.InterspectObject(this.data[0]);

		cb({descriptions: descriptions, error: false});
	}

	GetResult(data) {
		var newArray = [];

		for(var item of data) {
			var modifiedItem = this.ReGetResult(item, this.descriptions);	

			if (!modifiedItem.toDelete)		
				newArray.push(modifiedItem);
		}

		return newArray;
	}

	ReGetResult(itemField, descriptions) {
		var result = {};

		if (descriptions.nfname) {
			result[descriptions.nfname] = descriptions.nf(itemField);
		}

		for(var field of descriptions) {
			if (field.descriptions) {
				result[field.name] = [];
				for(var item of itemField[field.name]) {
					var modifiedItem = this.ReGetResult(item, field.descriptions);

					if (!modifiedItem.toDelete)	
						result[field.name].push(modifiedItem);
				}
			} else if (field['f']) {
				result[field.name] = field.f(itemField);
			} else {
				result[field.name] = itemField[field.name];
			}
		}

		if (descriptions.rf) {
			result = descriptions.rf(result);
		}

		if (descriptions.rmf) {
			if(descriptions.rmf(result)){
				result = {toDelete: true}
			}
		}

		return result;
	}

	InterspectObject(obj) {
		var descriptions = [];

		for(var key in obj) {
			var descriptionItem = {};
			descriptionItem.name = key;
			descriptionItem.type = typeof(obj[key]);

			if (descriptionItem.type == "object") {
				descriptionItem.showMore = true;
			}
			descriptionItem.sampleData = obj;
			descriptions.push(descriptionItem);
		}

		return descriptions;
	}

	NewField(path, code){
		var paths = path.split(" ");
		var k = paths.length;
		var more = this.descriptions;
		var data = this.data;
		var descriptions = [];
		var field = paths[paths.length -1];
		var keyMore = null;
		var description = null;
		var j = 0;

		do {
			k--;
			while(more[j]) {
				description = more[j]
				if (paths.length == 1) {
					more.nf = new Function("item", code);
					more.nfname = paths[0];
					keyMore = j;
					break;
					break;
				}
				if (description.name == paths[k]) {
					if (k == 1) {
						more = more[j].descriptions;
						more.nf = new Function("item", code);
						more.nfname = paths[0];
						break;
						break;
					} else if (k > 1){						
						more = more[j].descriptions;
						j = 0;
						break;
					} 
				} else {
					j++;
				}
			} 					
		} while (k != 0);

		return  more.nf(more[0].sampleData);
	}

	RowIf(path, code) {
		var paths = path.split(" ");
		var k = paths.length;
		var more = this.descriptions;
		var data = this.data;
		var descriptions = [];
		var field = paths[paths.length -1];
		var keyMore = null;
		var description = null;
		var j = 0;

		do {
			k--;
			while(more[j]) {
				description = more[j]
				if (paths[0] == "") {
					more.rf = new Function("item", code);
					keyMore = j;
					break;
					break;
				}
				if (description.name == paths[k]) {
					if (k == 0) {
						more = more[j].descriptions;
						more.rf = new Function("item", code);
						break;
						break;
					} else if (k > 0){						
						more = more[j].descriptions;
						j = 0;
						break;
					} 
				} else {
					j++;
				}
			} 					
		} while (k > 0);

		return  more.rf(more[0].sampleData);
	}

	RowDeleteIf(path, code) {
		var paths = path.split(" ");
		var k = paths.length;
		var more = this.descriptions;
		var data = this.data;
		var descriptions = [];
		var field = paths[paths.length -1];
		var keyMore = null;
		var description = null;
		var j = 0;

		do {
			k--;
			while(more[j]) {
				description = more[j]
				if (paths[0] == "") {
					more.rmf = new Function("item", code);
					keyMore = j;
					break;
					break;
				}
				if (description.name == paths[k]) {
					if (k == 0) {
						more = more[j].descriptions;
						more.rmf = new Function("item", code);
						break;
						break;
					} else if (k > 0){						
						more = more[j].descriptions;
						j = 0;
						break;
					} 
				} else {
					j++;
				}
			} 					
		} while (k > 0);

		return  more.rmf(more[0].sampleData);
	}

	More(path) {
		var paths = path.split(" ");
		var k = paths.length;
		var more = this.descriptions;
		var descriptions = [];
		var field = paths[paths.length -1];

		do {
			k--;
			for(var key in more) {
				if(more[key].name == paths[k]) {
					descriptions = more[key].descriptions = this.InterspectObject(more[0].sampleData[paths[k]][0]);
					more = more[key].descriptions;
					break;
				}
			}
		} while (k != 0);

		return {descriptions: descriptions, error: false};
	}

	Done(path, code) {
		var paths = path.split(" ");
		var k = paths.length;
		var more = this.descriptions;
		var data = this.data;
		var descriptions = [];
		var field = paths[paths.length -1];
		var keyMore = null;
		var description = null;
		var j = 0;

		do {
			k--;
			while(more[j]) {
				description = more[j]
				if (description.name == paths[k]) {
					if (k == 0) {
						more[j].f = new Function("item", code);
						keyMore = j;
						break;
						break;
					} else {
						more = more[j].descriptions;
						j = 0;
						k--;
					}
				} else {
					j++;
				}
			} 					
		} while (k != 0);

		return  more[keyMore].f(more[keyMore].sampleData);
	}
}