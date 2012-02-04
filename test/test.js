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
