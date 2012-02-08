/**
 * jquery.require.stylesheet
 * Stylesheet loader plugin for $.require.
 *
 * Part of jquery.require family.
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

$.require.addLoader('stylesheet', (function() {

	var self = function() {

		var batch = this,
			args = $.makeArray(arguments),
			options,
			names;

		// Expand arguments into its actual definition
		if ($.isPlainObject(args[0])) {
			options = args[0];
			names = args.slice(1);
		} else {
			names = args;
		}

		options = $.extend(self.defaultOptions, options, {batch: batch});

		$.each(names, function(i, name) {

			var task = new self.task(name, options),
				existingTask = self.stylesheets[task.url];

			task = existingTask || task;

			batch.addTask(task);

			if (!existingTask) {
				self.stylesheets[task.url] = task;
				task.start();
			}
		});
	};

	$.extend(self, {

		defaultOptions: {
			// Overrides require path.
			path: '',

			extension: 'css',

			// @TODO: XHR loading.
			// Use XHR to load stylesheet. Default: Link injection. @import() for IE.
			xhr: false
		},

		setup: function() {

			$.extend(self.defaultOptions, options);
		},

		stylesheets: {},

		task: function(name, options) {

			var task = $.extend(this, $.Deferred());

			task.name = name;

			task.options = options;

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
							.toPath('./' + name + '.' + task.options.extension)
							.toString();
			}
		}

	});

	$.extend(self.task.prototype, {

		start: function() {

			var task = this;

			if ($.stylesheet(task.options)) {

				task.resolve();

			} else {

				task.reject();
			}
		}

	});

	return self;

});
