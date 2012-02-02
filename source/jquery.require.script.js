
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

		var batch = this,
			args = $.makeArray(arguments),
			options,
			names;

		// Expand arguments into its actual definition
		if ($.isPlainObject(args[0]) {
			options = args[0];
			names = args.slice(1);
		} else {
			names = args;
		}

		options = $.extend(self.defaultOptions, options, {batch: batch});

		// Create tasks and add it to the batch.
		var taskBefore;

		$.each(names, function(i, name) {

			var task = new self.task(name, options, taskBefore);

			batch.addTask(task);

			taskBefore = task;
		});

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
		},

		task: function(name, options, taskBefore)

			var task = $.extend(this, $.Deferred());

			task.name = name;

			task.options = options;

			// Module definition
			if ($.isArray(name)) {

				task.name = name.join('@');

				task.moduleName = name = name[1];

				// Set module flag
				task.defineModule = true;

				// Use XHR for module definitions
				task.options.xhr = true;
			}

			// Resolve name to paths

			// Absolute path
			if ($.isUrl(name)) {

				task.url = name;

			// Relative path
			} else if (/^(\/|\.)/.test(task.name)) {

				task.url = $.uri(task.options.path)
							.toPath(name)
							.toString();

			// Module path
			} else {

				task.url = $.uri(task.options.path)
							.toPath('./' + name + task.options.extension)
							.toString();

				task.module = $.module(name);
			}

			task.start();
		}

	});

	$.extend(self.task, {

		start: function() {

		}

	});

	return self;

});
