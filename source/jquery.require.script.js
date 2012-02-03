/**
 * jquery.require.script
 * Script loader plugin for $.require.
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

$.require.addLoader('script', (function()
{
	var canAsync = document.createElement("script").async === true || "MozAppearance" in document.documentElement.style || window.opera;

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

			// Serial script loading
			if (options.serial && taskBefore!==undefined) {

				// Only start current task when the
				// task before is resolved/rejected.
				taskBefore.always(task.start);

			} else {

				task.start();
			}

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

			// Asynchronous script execution. Default: Synchronous script execution.
			async: false,

			// Use XHR to load script. Default: Script injection.
			xhr: false
		},

		setup: function() {

			$.extend(self.defaultOptions, options);
		},

		task: function(name, options, taskBefore)

			var task = $.extend(this, $.Deferred());

			task.name = name;

			task.options = options;

			task.taskBefore = taskBefore;

			// Module definition
			if ($.isArray(name)) {

				task.name = name.join('@');

				task.moduleName = name[0];

				// Assign path to be resolved
				name = name[1];

				// Set module flag
				task.defineModule = true;

				// Raise a warning if the module already exist
				if ($.module.registry(task.moduleName)) {
					console.warn("$.require.script: " + task.moduleName + ' exists! Using existing module instead.');
				}

				task.module = $.module(task.moduleName);

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
		}

	});

	$.extend(self.task, {

		start: function() {

			var task = this,
				taskBefore = task.taskBefore;

			// If we're loading a module,
			if (task.module) {

				var moduleState = task.module.state();

				// and the module has been resolved,
				if (moduleState=="resolved") {

					// then resolve task.
					task.resolve();
					return;
				}

				// and the module has been rejected,
				if (moduleState=="rejected") {

					// then reject task.
					task.rejected();
					return;
				}
			}

			// Load script
			// canAsync flag is used to determine whether or not we are on IE.
			if (canAsync || task.options.xhr) {

				task.load();

			// For IE, we will have to preload the script using text/cache hack,
			// then reload the script again using text/javascript.
			} else {

				task.script = $.script({
					src: task.url,
					type: "text/cache"
				});

				task.script
					.done(function() {

						// IE may still execute script out of sync even though
						// the previous script is injected into the head first.
						if (taskBefore) {

							// So we will inject our script when the task
							// only when the task before is resolved.
							taskBefore.done(function(){

								// Remove "text/cache" node.
								task.script.remove();

								// Reinsert with "text/javascript" node.
								task.load();

							});

						} else {

							task.load();
						}
					});
			}
		},

		load: function() {

			var task = this,
				taskBefore = task.taskBefore,
				options = {};

			// Use previously created script instance if exists,
			// else create a new one.
			task.script = self.scripts[task.url] || (function() {

				var script = (task.options.xhr) ?

					// Load script via ajax.
					$.ajax({

						url: task.url,

						dataType: "text"

					}) :

					// Load script using script injection.
					$.script({

						url: task.url,

						type: "text/javascript",

						async: task.options.async,

					});

				return self.scripts[task.url] = script;

			})();

			// At this point, script may be loaded, BUT may yet
			// to be executed under the following conditions:
			// - Module loaded via script injection/xhr.
			// - Script loaded via via xhr.
			task.script
				.done(function(data) {

					var resolveTask = function() {

						// If task loads a module, resolve/reject task only when
						// the module is resolved/rejected as the module itself
						// may perform additional require tasks.
						if (task.module) {

							task.module
								.done(task.resolve);
								.fail(task.reject);

						} else {

							task.resolve();
						}
					};

					if (task.options.xhr) {

						if (task.defineModule) {

							// Create our own module factory
							task.module = $.module(task.moduleName, function() {

								var module = this;

								$.globalEval(data);

								module.resolveWith(data);
							});
						};

						// For XHR, if scripts needs to be executed synchronously
						// a.k.a. ordered script execution, then only eval it when
						// the task before it is resolved.
						if (!task.options.async || taskBefore) {

							taskBefore.done(function() {

								$.globalEval(data);

								resolveTask();

							});

							return;
						}

					};

					resolveTask();

				})
				.fail(function() {

					task.reject();
				});
		}
	});

	return self;

});
