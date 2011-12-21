(function() {  

	function html_tag(string, tag_name) {
		return '<' + tag_name + '>' + string + '</' + tag_name + '>';
	}
	
	function valid_email(email) {
		var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return regex.test(email);
	}
	
	function trim(string) {
		return string.replace(/^\s\s*/, '').replace(/\s\s*$/, '');	
	}
	
	function humanize(string) {
		var s = string.replace(/(\_|\-|\#|\.)/g, ' ').toLowerCase();
		return trim(s.charAt(0).toUpperCase() + s.slice(1));
	}
	
	$.fn.validate = function( options ) {
		
    	// Create some defaults, extending them with options provided

	    var settings = $.extend({
			'error_tag'			:  '.validation_errors',
			'error_tag_prepend' :  '',
			'error_tag_append'  :  '',
			'submit'			:  'input[type="submit"]'
	    }, options);

		return this.each(function() {
			
			var form       =  $(this);
			var error_tag  =  $(settings.error_tag);
			var submit     =  $(settings.submit, form);
				
			var input;
			var errors
			var attr; 
			var message;
			var data_validate;
			var validation_array;
			var min_length;
			var max_length;

			submit.click(function() {
				
				// reset errors 
				
				errors = "";
				error_tag.html("");
				
				$(form).children().each(function() {
						
					input = $(this); // instance cache the object	
					data_validate = input.attr('data-validate');
					
					if(data_validate) {
						
						validation_array = data_validate.split("|");						
						
						for (var i = 0; i < validation_array.length; i++) {
						
							// required
							
							if(validation_array[i] === "required" && input.val() === "") {
								attr = input.attr('data-validate-required-message');
								message = attr ? html_tag(attr, 'li') : html_tag(humanize(input.attr('name')) + ' can\'t be blank', 'li');
								errors = errors + message;
							}
							
							// email validation
							
							if(validation_array[i] === "email" && valid_email(input.val()) === false) {
								attr = input.attr('data-validate-email-message');
								message = attr ? html_tag(attr, 'li') : html_tag(humanize(input.attr('name')) + ' is invalid', 'li');
								errors = errors + message;								
							}
							
							// minimum length
							
							if(validation_array[i].split('[')[0] === "min_length" && 
							input.val().length < validation_array[i].split('[')[1].replace(']', '')) {
								
								min_length = validation_array[i].split('[')[1].replace(']', '');															
								attr = input.attr('data-validate-min_length-message');
								message = attr ? html_tag(attr, 'li') : html_tag(humanize(input.attr('name')) + ' has a minimum length of ' + min_length, 'li');
								errors = errors + message;							
							}
							
							// maximum length
							
							if(validation_array[i].split('[')[0] === "max_length" && 
							input.val().length > validation_array[i].split('[')[1].replace(']', '')) {
								
								max_length = validation_array[i].split('[')[1].replace(']', '');								
								attr = input.attr('data-validate-max_length-message');
								message = attr ? html_tag(attr, 'li') : html_tag(humanize(input.attr('name')) + ' has a maximum length of ' + max_length, 'li');
								errors = errors + message;								
							}
							
							// numeric 
							
							if(validation_array[i] === "numeric" && !(!isNaN(parseFloat(input.val())) && isFinite(input.val())) ) {
								attr = input.attr('data-validate-numeric-message');
								message = attr ? html_tag(attr, 'li'):  html_tag(humanize(input.attr('name')) + ' is not a number', 'li');
								errors = errors + message;
							}
							
							// trim
							
							if(validation_array[i] === "trim") {
								input.val(trim(input.val()));	
							}
																				
						} // end for loop
					
					} 
				});
				
				if(errors != "") {
					error_tag.append(settings.error_tag_prepend + '<ul>' + errors + '</ul>' + settings.error_tag_append).show();	
					return false;
				}
				
			}); // submit.click()
		});
	};  
}());
