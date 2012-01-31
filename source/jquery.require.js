/**
 * jquery.require.
 * A dependency loader built on top of $.Deferred() backbone.
 * An alternative take on RequireJS.
 *
 * Copyright (c) 2012 Jensen Tonne
 * www.jstonne.com
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

(function($) {

// internal function
var getFolderPath = function(path) {

	// TODO: Convert relative path into absolute path, those from <script> src attribute.
	return $.uri(path).setAnchor('').setQuery('').toPath('../').toString();
};

var self = $.require = function(options) {

	var batch = new self.batch(options);

	self.batches.push(batch);

	return task;

};

$.extend($.require, {

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

		retry: 3
	},

	setup: function(options) {

		$.extend(self.defaultOptions, options);
	},

	batches: [],

	batch: function(options) {

		var batch = this;

		batch.options = $.extend({}, self.defaultOptions, options);

		batch.tasks = [];

		// Create proxy functions to require loaders,
		// assigning "this" as current batch.

		$.each(self.loaders, function(name, factory) {

			batch[name] = function() {

				factory.apply(this, arguments);

				// Ensure require calls are chainable
				return batch;
			}

		});

		// Masquerade batch as a pseudo-promise object
		// until one of its method is actually called.

		$.each(['then','done','fail','always','pipe','progress'], function(i, func) {

			batch[func] = function() {

				// Create a master deferred object using $.when
				// and extend it onto our batch object.

				$.extend(batch, $.when.apply(null, batch.tasks));

				return batch[func].apply(arguments);
			}
		});

		return batch;
	},

	loaders: {},

	loader: function(name, factory) {

		self.loaders[name] = self[name] = factory;
	}

});


})(jQuery);
