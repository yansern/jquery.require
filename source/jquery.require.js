/**
 * jquery.require.
 * A dependency loader built on top of $.Deferred() backbone.
 * An alternative take on RequireJS.
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

$.require = (function() {

	// internal function
	var getFolderPath = function(path) {

		// TODO: Convert relative path into absolute path, those from <script> src attribute.
		return $.uri(path).setAnchor('').setQuery('').toPath('../').toString();
	};

	var self = function(options) {

		var batch = new self.batch(options);

		self.batches[batch.id] = batch;

		if (batch.options.verbose) {
			console.info('$.require: Batch ' + batch.id + ' created.', batch);
		}

		return batch;
	};

	// Require methods & properties

	$.extend(self, {

		defaultOptions: {

			// Path selection order:
			path: (function() {
				var path =
					// By "require_path" attribute
					$('script:has([require_path])').attr('require_path') ||

					// By last script tag's "src" attribute
					getFolderPath($('script:last').attr('src')) ||

					// By window location
					getFolderPath(window.location.href);

				return path;
			})(),

			timeout: 10000,

			retry: 3,

			verbose: true
		},

		setup: function(options) {

			$.extend(self.defaultOptions, options);
		},

		batches: {},

		batch: function(options) {

			var batch = this;

			batch.id = $.uid();

			// Batch manager tracks the state of tasks in batch.taskList and batch.tasks.
			batch.manager = $.Deferred();

			batch.options = $.extend({}, self.defaultOptions, options);

			return batch;
		},

		addLoader: function(name, factory) {

			// Static call, e.g.
			// $.require.script.setup({});
			self[name] = factory;

			// Create proxy functions to require loaders,
			// assigning current batch to factory's "this".
			self.batch.prototype[name] = function() {

				factory.apply(this, arguments);

				// Ensure require calls are chainable
				return this;
			};

			self.loaders[name] = self[name] = factory;
		},

		removeLoader: function(name) {
			delete self.batch.prototype[name];
			delete self[name];
		}

	});

	// Batch class

	$.extend(self.batch.prototype, {

		taskList: [],

		tasksFinalized: false,

		addTask: function(task) {

			var batch = this;

			if (!$.isDeferred(task)) {
				return;
			};

			if (taskFinalized) {

				if (batch.options.verbose) {
					console.warn('$.require: ' + task.name + ' ignored because tasks of this batch are finalized.', task);
				};

				return;
			};

			task.then(
				batch.taskDone,
				batch.taskFail,
				batch.taskProgress
			);

			batch.taskList.push(task);
		},

		taskDone: function() {

			var batch = this;

			if (batch.options.verbose) {
				console.info('$.require: ' + task.name + ' loaded successfully.', task);
			};

			batch.manager.notifyWith(batch, [task]);
		},

		taskFail: function() {

			var batch = this;

			if (batch.options.verbose) {
				console.error('$.require: ' + task.name + ' failed to load.', task);
			};

			batch.manager.notifyWith(batch, [task]);
		},

		taskProgress: function() {

			var batch = this;

			batch.manager.notifyWith(batch, [task]);
		},

		// TODO: Statistics
		stat: function(){
		}
	});

	// Masquerade newly created batch instances as a pseudo-promise object
	// until one of those promise's method is called. This is to ensure that
	// no callbacks are fired too early until all loading tasks are finalized.

	$.each(['then','done','fail','always','pipe','progress'], function(i, func) {

		self.batch.prototype[func] = function() {

			var batch = this;

			// Finalize all tasks so no further tasks
			// can be added to the batch job.
			batch.taskFinalized = true;

			// Extend batch with batch manager's promise methods,
			// overriding original pseudo-promise methods.
			$.extend(batch, batch.manager.promise());

			// Create a master deferred object for all tasks
			batch.tasks = $.when.apply(null, batch.taskList);

			batch.tasks
				// Resolve batch if all tasks are done
				.done(function(){

					if (batch.options.verbose) {
						console.info('$.require: Batch ' + batch.id + ' completed.', batch);
					};

					batch.manager.resolve();
				})

				// Reject batch if one of the task failed
				.fail(function(){

					if (batch.options.verbose) {
						console.info('$.require: Batch ' + batch.id + ' completed.', batch);
					};

					batch.manager.reject();
				});

			return batch;
		}
	});

	return self;

})();
