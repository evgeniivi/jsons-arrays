jQuery(document).ready(function(){
	var aw = null;

	var htmlDescriptions = function(analyzed, parent = false) {
		var html = "";

		for (var desc of analyzed.descriptions) {
			html += '<div class="desc"' + (parent ? ' parent="' + parent.attr("field") + '"' : '') + ' field="' + desc.name + '">';
			html += '<div>' + desc.name + '</div>';
			html += '<div>' + desc.type + '</div>';
			html += '<div>' + desc.sampleData[desc.name] + '</div>';

			if (desc.showMore) {
				html += '<input type="submit" name="more" value="more"/>';
			}

			html += '<input type="submit" name="parse" value="parse"/>';
			html += '</div>';
		}
		html += '<input type="submit" name="newfield" value="new field"/>';
		html += '<input type="submit" name="rowif" value="if row"/>';
		html += '<input type="submit" name="rowdeleteif" value="if delete row"/>';

		!parent ? $(".descriptions").html(html): (parent.find('.desc').remove(), parent.append(html));
	}

	$("input[type='submit'][name='init']").on('click', function() {
		var data = JSON.parse($("textarea[name='data-source']").val());

		aw = new ArrayWorker();
		var html = "";

		aw.InitWorker(data, function(analyzed) {
			if (!analyzed.error) {
				htmlDescriptions(analyzed)
			} else {
				$(".message").html("error");
				
				setTimeout(function(){
					$(".message").html("");
				}, 4000)
			}
		});
	})

	$("input[type='submit'][name='run']").on('click', function() {
		var stringged = JSON.stringify(aw.GetResult(JSON.parse($("textarea[name='data-source']").val())));
		$("textarea[name='data-destination']").val(stringged);
	})

	$(document).on('click', "input[type='submit'][name='newfield']", function() {
		var parent = $(this).parent();
		parent.append("<input class='newfield' type='text' name='newfieldtext' value='newfield'/><textarea name='codefornew'>return item.newfield = 1;</textarea><input type='submit' value='done' name='donenew'  />")				
	})

	$(document).on('click', "input[type='submit'][name='rowif']", function() {
		var parent = $(this).parent();
		parent.append("<textarea name='rowifcode'>return item;</textarea><input type='submit' value='done' name='donerowif'  />")				
	})

	$(document).on('click', "input[type='submit'][name='rowdeleteif']", function() {
		var parent = $(this).parent();
		parent.append("<textarea name='rowdeleteifcode'>return false;</textarea><input type='submit' value='done' name='donerowdeleteif'  />")				
	})

	$(document).on('click', "input[type='submit'][name='donenew']", function() {
		var selfParent = $(this).parent();
		var parent = $(this).parent();
		var path = "";
		var parentField = null;
		var field = null;

		field = parent.find("input[name='newfieldtext']").val();
		parentField = parent.attr("field");

		path = field;

		if (parentField)
			path += " " + parentField;

		parentAttr = parent.attr("parent");

		while (parentAttr) {
			path += " "+parentAttr;
			parent = parent.parent();
			parentAttr = parent.attr("parent");
		}

		alert("Data can be added: " + aw.NewField(path, selfParent.find('textarea[name="codefornew"]').val()));		
	})

	$(document).on('click', "input[type='submit'][name='donerowif']", function() {
		var selfParent = $(this).parent();
		var parent = $(this).parent();
		var path = "";
		var parentField = null;
		var field = "";

		parentField = parent.attr("field");

		path = field;

		if (parentField)
			path += " " + parentField;

		parentAttr = parent.attr("parent");

		while (parentAttr) {
			path += " "+parentAttr;
			parent = parent.parent();
			parentAttr = parent.attr("parent");
		}

		path = path.trim();

		alert("Data can be applied: " + aw.RowIf(path, selfParent.find('textarea[name="rowifcode"]').val()));		
	})

	$(document).on('click', "input[type='submit'][name='donerowdeleteif']", function() {
		var selfParent = $(this).parent();
		var parent = $(this).parent();
		var path = "";
		var parentField = null;
		var field = "";

		parentField = parent.attr("field");

		path = field;

		if (parentField)
			path += " " + parentField;

		parentAttr = parent.attr("parent");

		while (parentAttr) {
			path += " "+parentAttr;
			parent = parent.parent();
			parentAttr = parent.attr("parent");
		}

		path = path.trim();

		alert("Data can be applied: " + aw.RowDeleteIf(path, selfParent.find('textarea[name="rowdeleteifcode"]').val()));		
	})

	$(document).on('change', "input[type='text'][name='newfieldtext']", function() {
		$(this).parent().find(" > textarea[name='codefor']").val("return item." + $(this).val() + " = 1;");
	})

	$(document).on('click', "input[type='submit'][name='parse']", function() {
		var parent = $(this).parent();

		parent.append("<textarea name='codefor'>return item."+parent.attr("field")+" + 'test';</textarea><input type='submit' value='done' name='done' />")				
	})

	$(document).on('click', "input[type='submit'][name='more']", function() {
		var parentSelf = $(this).parent();
		var parent = $(this).parent();
		var path = "";
		var parentField = null;
		var field = null;

		field = parent.attr("field");
		path = field;
		parentField = parent.attr("parent");

		while (parentField) {
			path += " "+parentField;
			parent = parent.parent();
			parentField = parent.attr("parent");
		} 

		htmlDescriptions(aw.More(path), parentSelf);
	})

	$(document).on('click', "input[type='submit'][name='done']", function() {
		var parent = $(this).parent();
		var path = "";
		var parentField = null;
		var field = null;

		field = parent.attr("field");
		path = field;
		parentField = parent.attr("parent");

		while (parentField) {
			path += " "+parentField;
			parent = parent.parent();
			parentField = parent.attr("parent");
		}

		alert("Sample data parsed: " + aw.Done(path, parent.find('textarea[name="codefor"]').val()));		
	})
});