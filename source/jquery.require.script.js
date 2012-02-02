
/**
 * jquery.require.script
 * Script loader plugin for $.require.
 * https://github.com/jstonne/jquery.require
 *
 * Copyright (c) 2012 Jensen Tonne
 * www.jstonne.com
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

$.require.addLoader('script', (function()
{

	var self = function() {

		var batch = this;

	};

	$.extend(self, {

		defaultOptions: {
			// Overrides require path.
			path: '',

			extension: 'js',

			// Serial script loading. Default: Parallel script loading.
			serial: false,

			// Synchronous script execution. Default: Synchronous script execution.
			sync: false,

			// Use XHR to load script. Default: Script injection.
			xhr: false,
		},

		setup: function() {

			$.extend(self.defaultOptions, options);
		}

	});

	return self;

});
