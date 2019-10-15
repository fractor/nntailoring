'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
Base class containing common functionality for {@link Task} and {@link TaskGroup}.

@class BaseInterface
@extends EventEmitter
@constructor
@access private
*/

var BaseInterface = function (_require$EventEmitter) {
	_inherits(BaseInterface, _require$EventEmitter);

	_createClass(BaseInterface, null, [{
		key: 'create',

		/**
  Creates and returns new instance of the current class.
  @param {...*} args - The arguments to be forwarded along to the constructor.
  @return {Object} The new instance.
  	@static
  @access public
  */
		value: function create() {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return new (Function.prototype.bind.apply(this, [null].concat(args)))();
		}

		/**
  BaseInterface Constructor
  	Adds support for the done event while
  ensuring that errors are always handled correctly.
  It does this by listening to the `error` and `completed` events,
  and when the emit, we check if there is a `done` listener:
  	- if there is, then emit the done event with the original event arguments
  - if there isn't, then output the error to stderr and throw it.
  	Sets the following configuration:
  	- `nameSeparator` defaults to `' ➞  '`, used to stringify the result of `.names`
  	*/

	}]);

	function BaseInterface() {
		_classCallCheck(this, BaseInterface);

		// Allow extensions of this class to prepare the class instance before anything else fires

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BaseInterface).call(this));

		if (_this.prepare) {
			_this.prepare();
		}

		// Set state and config
		if (_this.state == null) _this.state = {};
		if (_this.config == null) _this.config = {};
		if (_this.config.nameSeparator == null) _this.config.nameSeparator = ' ➞  ';

		// Generate our listener method that we will beind to different events
		// to add support for the `done` event and better error/event handling
		function listener(event) {
			for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				args[_key2 - 1] = arguments[_key2];
			}

			// Prepare
			var error = args[0];

			// has done listener, forward to that
			if (this.listeners('done').length !== 0) {
				this.emit.apply(this, ['done'].concat(args));
			}

			// has error, but no done listener and no event listener, throw error
			else if (error && this.listeners(event).length === 1) {
					if (event === 'error') {
						throw error;
					} else {
						this.emit('error', error);
					}
				}
		}

		// Listen to the different events without listener
		_this.on('error', listener.bind(_this, 'error'));
		_this.on('completed', listener.bind(_this, 'completed'));
		// this.on('halted', listener.bind(this, 'halted'))
		// ^ @TODO not yet implemented, would be an alternative to pausing
		return _this;
	}

	/**
 Attaches the listener to the `done` event to be emitted each time.
 @param {Function} listener - Attaches to the `done` event.
 @chainable
 @returns {this}
 @access public
 */


	_createClass(BaseInterface, [{
		key: 'whenDone',
		value: function whenDone(listener) {
			// Attach the listener
			this.on('done', listener.bind(this));

			// Chain
			return this;
		}

		/**
  Attaches the listener to the `done` event to be emitted only once, then removed to not fire again.
  @param {Function} listener - Attaches to the `done` event.
  @chainable
  @returns {this}
  @access public
  */

	}, {
		key: 'onceDone',
		value: function onceDone(listener) {
			// Attach the listener
			this.once('done', listener.bind(this));

			// Chain
			return this;
		}

		/**
  Alias for {@link BaseInterface#onceDone}
  @param {Function} listener - Attaches to the `done` event.
  @chainable
  @returns {this}
  @access public
  */

	}, {
		key: 'done',
		value: function done(listener) {
			return this.onceDone(listener);
		}

		/**
  Gets our name prepended by all of our parents names
  @type {Array}
  @access public
  */

	}, {
		key: 'getNames',


		// ---------------------------------
		// Backwards compatability helpers

		value: function getNames(opts) {
			return opts && opts.separator ? this.names.join(opts.separator) : this.names;
		}
	}, {
		key: 'getConfig',
		value: function getConfig() {
			return this.config;
		}
	}, {
		key: 'getTotalItems',
		value: function getTotalItems() {
			return this.totalItems;
		}
	}, {
		key: 'getItemTotals',
		value: function getItemTotals() {
			return this.itemTotals;
		}
	}, {
		key: 'isCompleted',
		value: function isCompleted() {
			return this.completed;
		}
	}, {
		key: 'hasStarted',
		value: function hasStarted() {
			return this.started;
		}
	}, {
		key: 'addGroup',
		value: function addGroup() {
			return this.addTaskGroup.apply(this, arguments);
		}
	}, {
		key: 'clear',
		value: function clear() {
			return this.clearRemaining.apply(this, arguments);
		}
	}, {
		key: 'names',
		get: function get() {
			// Fetch
			var names = [];var _config = this.config;
			var name = _config.name;
			var parent = _config.parent;
			var nameSeparator = _config.nameSeparator;

			if (parent) names.push.apply(names, _toConsumableArray(parent.names));
			if (name !== false) names.push(this.name);
			names.toString = function () {
				return names.join(nameSeparator);
			};

			// Return
			return names;
		}

		/**
  Get the name of our instance.
  If the name was never configured, then return the name in the format of `'${this.type} ${Math.random()}'` to output something like `task 0.2123`
  @type {String}
  @access public
  */

	}, {
		key: 'name',
		get: function get() {
			return this.config.name || this.state.name || (this.state.name = this.type + ' ' + Math.random());
		}
	}]);

	return BaseInterface;
}(require('events').EventEmitter);

// Exports


module.exports = { BaseInterface: BaseInterface };