var testLoadOrder = function() {

	$.require({
		verbose: true
	})
	 .script(
	 	'./files/1.js',
	 	'./files/2.js',
	 	'./files/3.js',
	 	'./files/4.js'
	 );

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
	 );

}
