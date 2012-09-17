/*
Form Dependency Plugin
======================
Allows for elements to be shown/hidden based on a set of field validation rules.

See README.md for documentation.

Author: Ben Brady 
Licensed: MIT

*/



(function ($) {
	$.fn.dependsOn = function (opts) {
		var elements = this;
		var defaults = {
			rules: [], 	// each rule is an object with a field and optional validate function or string
			ruleLogic: "all", // any: at least one rule must pass // all : all rules need to be true
			onValid: function (elems) {
				$(elems).show();
				$(elems).find(':input').attr("disabled", false);
			},
			onInvalid: function (elems) {
				$(elems).hide();
				$(elems).find(':input').attr("disabled", true);
			}
		};

		opts = $.extend(defaults, opts);

		var validate_rules = function () {
			var valid = 0;
			var invalid = 0;
			$.each(opts.rules, function (ix, rule) {
				if (rule.validate == undefined) {
					//no validation function string match value means we just check if the field value is not empty.
					rule.validate = function (field) {
						var val;
						if($(field + ':not(:disabled)').length == 0) {
							return true;
						}
						if ($(field).is('input[type=checkbox], input[type=radio]')) {
							val = $(field + ':not(:disabled):checked').val();
						} else {
							val = $(field + ":not(:disabled)").val();
						}
						if (val != undefined) {
							return true;
						};
						return false;
					}
				}
				if (typeof (rule.validate) === 'string') {
					// strings mean we just compare the value directly
					var match_string = rule.validate;
					rule.validate = function (field) {
						var val;
						if ($(field).is('input[type=checkbox], input[type=radio]')) {
							val = $(field + ':not(:disabled):checked').val();
						} else {
							val = $(field + ":not(:disabled)").val();
						}
						if (val === match_string) {
							return true;
						};
						return false;
					}
				}
				var isValid = rule.validate(rule.field);
				if (isValid) {
					valid++;
				} else {
					invalid++;
				}
			});
			if (opts.ruleLogic == "all" && invalid > 0) {
				opts.onInvalid(elements);
			} else if (opts.ruleLogic == "any" && valid == 0) {
				opts.onInvalid(elements);
			}
			else {
				opts.onValid(elements);
			}
		}

		// Bind events
		$.each(opts.rules, function (index, rule) {
			$(rule.field).change(function () {
				validate_rules();
			});
		});

		// Initial validation, usually done on page load
		validate_rules();

		// Don't break the chain!
		return this;
	};
})(jQuery);