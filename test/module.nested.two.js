$.module('module.nested.two', function() {

	var module = this;

	console.log('module.nested.two loaded.');

	$.require({
		timeout: 1000,
		verbose: true
	})
		.script(
			'module.three'
		)
		.done(function()
		{
			console.log('module.nested.two dependencies loaded.');

			module.resolve();
		});

});
