$.module('module.nested.one', function() {

	var module = this;

	console.log('module.nested.one loaded.');

	$.require({
		timeout: 1000,
		verbose: true
	})
		.script(
			'module.one',
			'module.two'
		)
		.done(function()
		{
			console.log('module.nested.one dependencies loaded.');

			module.resolve();
		});

});
