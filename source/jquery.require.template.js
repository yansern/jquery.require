/**
 * jquery.require.template
 * Template loader plugin for $.require.
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

$.require.addLoader('template', (function() {

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

		options = $.extend(
			{},
			self.defaultOptions,
			batch.options,
			options,
			{batch: batch}
		);

		$.each(names, function(i, name) {

			var task = new self.task(name, options);

			batch.addTask(task);

			task.start();
		});

	};

	$.extend(self, {

		defaultOptions: {
			// Overrides require path.
			path: '',

			extension: 'ejs'
		},

		setup: function() {

			$.extend(self.defaultOptions, options);
		},

		loaders: {},

		task: function(name, options, taskBefore) {

			var task = $.extend(this, $.Deferred());

			task.name = name;

			task.options = options;

			// Template definition
			if ($.isArray(name)) {

				task.name = name[0];

				// Assign path to be resolved
				name = name[1];
			}

			// Absolute path
			if ($.isUrl(name)) {

				task.url = name;

			// Relative path
			} else if (/^(\/|\.)/.test(name)) {

				task.url = $.uri(task.options.path)
							.toPath(name)
							.toString();

			// Template module
			} else {

				task.url = $.uri(task.options.path)
							.toPath('./' + name + '.' + task.options.extension)
							.toString();
			}
		}

	});

	$.extend(self.task.prototype, {

		start: function() {

			var task = this,
				taskBefore = task.taskBefore;

			task.loader = self.loaders[task.url] || (function() {

				var loader = $.ajax({

					url: task.url,

					dataType: "text"
				});

				return self.loaders[task.url] = loader;

			})();

			task.loader
				.done(function(content) {

					$.template(task.name, content);

					task.resolve();
				})
				.fail(function() {

					task.reject();

				});
		}
	});

	return self;

})()
);
