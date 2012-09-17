jQuery Field Dependencies
=========================

Author: Ben Brady 
Licensed: MIT

## Overview ##
Allows selected elements to be changed (shown/hidden or callback) based on a set of field validation rules.

This is useful for large forms where you may want to hide/disable various fieldsets which are relevant only if a particular input element is selected/checked.

## Options ##

**rules** 

An array of rule objects, each rule object has the following properties:

* field (required): A required field selector e.g. "input#email", "input[name=password]"

* validate (optional): 

 * Not specified, rule valid if field value is not undefined
 * string, field value is equal to the specified string.
 * function, called with first argument set to the rule.field selector. To validate return true.

			[
				{ field: "input[name=email]}, // an email field is not undefined.
				{ field: "input[name=password"], 
					validate: function(field) { if ($(field).val() != "12345") return true; }  // password is not 12345
				} 
			}]

**ruleLogic (optional)** 

 * 'any' default - at least one rule must validate (OR logic)
 * 'all' - all the rules must validate (AND logic)
		

**onValid (optional)**

Callback function, default hides the element(s) and disables child fields. Called with first argument = $(this).

    function(dependent_elements) { $(dependent_elements).show(); }

**onInvalid (optional)**

Callback function, default shows the element(s) and enables child fields. Called with first argument = $(this).

    function(dependent_elements) { $(dependent_elements).hide(); }

## Known Issues ##

* May call onValid/onInvalid events mutiple times if an element has several dependencies. Not great for visual effects.
* Only uses .change() event to bind fields to validation.

## Example ##
	
		<fieldset>
			<p>How do you get to work?</p>
			<p><input type="radio" name="transport" value="bike" />Bike</p>
			<p><input type="radio" name="transport" value="car" />Car</p>
		</fieldset>
		<fieldset id="car"><label for="fuel">How much fuel do you use a day?</label><input id="fuel" type="number" name="fuel">Litres</fieldset>
		<fieldset id="bike"><label for="fuel">Do you wear a helmet?</label><input id="fuel" type="checkbox" name="helmet"></fieldset>

		<script>
			var rule_car = {field:"input[name=transport]", 
			validate: "car"};
			$("#car").dependsOn({
				rules: [rule_car],
				onValid: function(elemenets) { 
					// elements is set to the jQuery object: $(#car)
					alert("Nice car");
					$(elements).css("background":"pink"); 
				}
			});
		</script>


