var testLoadOrder = function() {

	$.require({
		verbose: true
	})
	 .script(
	 	'./files/1.js',
	 	'./files/2.js',
	 	'./files/3.js',
	 	'./files/4.js'
	 )
	 .done(function(){
	 	console.log('Test load order ended.');
	 });

}

var testFailedLoadOrder = function() {

	$.require({
		timeout: 1000,
		verbose: true
	})
	 .script(
	 	'./wrongFolder/1.js',
	 	'./wrongFolder/2.js',
	 	'./wrongFolder/3.js',
	 	'./wrongFolder/4.js'
	 )
	 .done(function(){
	 	console.log('Test failed load order ended.');
	 });

}


var testLoadModuleOrder = function() {

	$.require({
		timeout: 1000,
		verbose: true
	})
	 .script(
	 	'module.one',
	 	'module.two'
	 )
	 .done(function(){
	 	console.log('Test load module order ended.');
	 })
}

var testLoadNestedModuleOrder = function() {

	$.require({
		timeout: 1000,
		verbose: true
	})
	 .script(
	 	'module.nested.one',
	 	'module.nested.two',
	 	'module.four'
	 )
	 .done(function(){
	 	console.log('Test load nested module order ended.');
	 });

}


var testMixedLoadOrder = function() {

	$.require({
		timeout: 1000,
		verbose: true
	})
	 .script(
	 	'module.nested.one',
	 	'./files/1.js',
	 	'module.nested.two',
	 	'./files/2.js',
	 	'module.four'
	 )
	 .done(function(){
	 	console.log('Test mixed load order ended.');
	 });

}

var testStylesheetLoading = function() {

	$.require({
		timeout: 1000,
		verbose: true
	})
	.stylesheet(
		'style.one',
		'./style.two.css',
		'./files/style.three.css'
	)
	.done(function(){
		console.log('Test stylesheet loading ended.');
	});
}

var testTemplateLoading = function() {

	$.require({
		timeout: 1000,
		verbose: true
	})
	.template(
		'template.one',
		['template.two', './template.two.ejs'],
		['template.three', './files/template.three.ejs']
	)
	.done(function(){
		$('.templateContent1').html( $.template('template.one') );
		$('.templateContent2').html( $.template('template.two') );
		$('.templateContent3').html( $.template('template.three') );
	});
}


