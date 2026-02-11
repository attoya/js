

/**
 * Attoya JS Component
 * @copyright (c) 2024-present APSF LLC dba Attoya and contributors
 * @license MIT
 * @version v2.0.0
 */
class AttoyaComponent {

  // Vars
  console      = AttoyaConsole;
  xhr          = {}; // XML Http Requests
  events       = {};
  requests     = {};
  wrapper      = null;
  container    = null;
  content      = null;
  origin       = null;
  options      = {};
  view_options = {};

  /**
   * Form
   * @note Needs to be at base level for JS class inheritance
   * @docs https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields
   * @docs https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
   */
  form        = null;
  form_prefix = null;

  // Debug Modes
  debug          = false;
  debug_ajax     = false;
  debug_redirect = false;




  /**
   * Constructor
   * @param {type} options (required)
   *  - @param {type} class     (optional)
   *  - @param {type} wrapper   (required)
   *  - @param {type} container (optional)
   *  - @param {type} content   (optional)
   *  - @param {type} origin    (optional)
   */
  constructor(options) {

    // Set Options
    options = default_empty_object(options, {
      class     : null,
      wrapper   : null,
      container : null,
      content   : null,
      origin    : null,
    });

    // Convert container to a jQuery object
    if(typeof options.container === 'string') {
      options.container = $(options.container);
    }

    // Convert wrapper to a jQuery object
    if(typeof options.wrapper === 'string') {

      // Set class as wrapper, if wrapper is string
      if(is_empty(options.class) == true) {
        options.class = options.wrapper;
      }

      options.wrapper = $(options.wrapper);

    }

    // Convert origin to a jQuery object
    if(typeof options.origin === 'string') {
      options.origin = $(options.origin);
    }


    // Check wrapper is set
    if(is_empty(options.wrapper) === true) {
      throw new Error('Wrapper is not defined for AttoyaComponent');
    }

    // Move wrapper
    this.wrapper = options.wrapper;
    delete options.wrapper;

    // Move container
    this.container = options.container;
    delete options.container;

    // Move content
    this.content = options.content;
    delete options.content;

    // Move origin
    this.origin = options.origin;
    delete options.origin;

    // Merge Data Options
    let data_options = this.wrapper.attr('data-options');
    if(is_empty(data_options) == false) {
      data_options = JSON.parse(data_options);
      options      = default_empty_object(data_options, options);
    }

    // Update options
    this.options = options;

    // Get debug modes from console
    this.debug          = this.console.get_option('debug');
    this.debug_ajax     = this.console.get_option('debug_ajax');
    this.debug_redirect = this.console.get_option('debug_redirect');

    // Run
    this.init();

  }




  /**
   * Initializes Class
   */
  init() {

    // Private events that need to be triggered first
    this._init_events();
    this._init_requests();

    // Extended Classes
    this.init_events();
    this.init_requests();

    this.bind_events(this.events);

  }




  /**
   * Initializes Events
   */
  init_events() {

  }




  /**
   * Initializes Requests
   */
  init_requests() {

  }




  /**
   * Initializes Private Events
   */
  _init_events() {

    this.add_events({

      // Toggles

      // Actions
      'dblclick .disabled'                       : 'handle_disabled_click',
      'click .disabled'                          : 'handle_disabled_click',
      'click .button.confirm'                    : 'handle_confirm_click',

      // Triggers
      'lock'                                     : 'lock',
      'unlock'                                   : 'unlock',
      'reload'                                   : 'reload',

      // Ajax Requests
      'cancelSubmit.done'                        : 'cancelComplete',
      'cancelSubmit.fail'                        : 'cancelError',
      'archiveSubmit.done'                       : 'archiveComplete',
      'archiveSubmit.fail'                       : 'archiveError',
      'discardSubmit.done'                       : 'discardComplete',
      'discardSubmit.fail'                       : 'discardError',
      'validateSubmit.done'                      : 'validateComplete',
      'validateSubmit.fail'                      : 'validateError',
      'saveSubmit.done'                          : 'saveComplete',
      'saveSubmit.fail'                          : 'saveError',
      'sortSubmit.done'                          : 'sortComplete',
      'sortSubmit.fail'                          : 'sortError',
      'loadSubmit.done'                          : 'loadComplete',
      'loadSubmit.fail'                          : 'loadError',
      'reloadSubmit.done'                        : 'reloadComplete',
      'reloadSubmit.fail'                        : 'reloadError',

    });

  }




  /**
   * Initializes Private Requests
   * @returns {undefined}
   */
  _init_requests() {

  }




  /**
   * Bind all the events to wrapper
   */
  bind_events(events) {

    let self = this;

    for_each(events, function(trig_select, handler) {

      let splits   = trig_select.split(' ');
      let trigger  = splits[0];
      let selector = trig_select.replace(trigger, '').trim();

      // Named function handler
      if(typeof handler === 'string') {
        handler = self[handler];
      }

      // Undefined handler
      if(typeof handler === 'undefined') {
        console.error('There is no handler function on the extended class for this event trigger', trig_select);
      }

      let trigger_func = function() {

        // Pass all the arguments to the handler
        let args = [].slice.call(arguments);

        // Add Target as next argument if available
        if(args[0].hasOwnProperty('currentTarget') == true) {
          args.push($(args[0].currentTarget));
        }

        handler.apply(self, args);

      }

      if(selector === '') {
        $(self.wrapper).on(trigger, trigger_func);
      }
      else {
        $(self.wrapper).on(trigger, selector, trigger_func);
      }

    });

  }




  /**
   * Add Events
   */
  add_events(events) {

    let self = this;

    // Set object if empty
    if(is_empty(self.events) == true) {
      self.events = {};
    }

    for_each(events, function(this_event, handler) {

      let this_handler = handler;

      if(typeof handler === 'function') {
        this_handler = function(event) {

          // Stop any event bubbling up
          self.stop_event(event);

          let target = $(event.currentTarget);

          // Check if target is disabled
          if(target.hasClass('disabled')) {
            return false;
          }

          // Call original handler function
          handler(event, target);

        }
      }

      self.events[this_event] = this_handler;

    });

  }




  /**
   * Append Events - For adding after a class is initialized.
   */
  append_events(events) {

    // Add these events
    this.add_events(events);

    // Bind them
    this.bind_events(events);

  }




  /**
   * Add Requests
   */
  add_requests(requests) {

    let self = this;

    // Set object if empty
    if(is_empty(self.requests) == true) {
      self.requests = {};
    }

    for_each(requests, function(request, handler_key) {
      self.requests[request] = function(url, payload) {

        let options = {
          url          : url,
          method       : 'GET',
          content_type : null, // Force browser to auto set. Manual setting breaks due to `boundary` values for FormData.
          payload      : null,
          recall_abort : true, // Will abort previous xhr if called more than once
          async        : true,
        };

        let content_format = null;

        // Keys should be all caps
        handler_key = String(handler_key).toUpperCase();


        // Specific use for FORM POST
        if(handler_key == 'FORMDATA') {

          options.method = 'POST';
          content_format = 'formdata';

        }
        // Common HTTP Methods
        else if(handler_key == 'GET') {

          options.method = 'GET';
          content_format = 'params';

        }
        else {

          // All other methods POST, PUT, PATCH, LOAD, RELOAD, ARCHIVE, DELETE, OPTIONS
          options.method = handler_key;
          content_format = 'json';

        }


        // Process Payload
        if(typeof payload !== 'undefined') {

          // Get Params
          if(content_format == 'params') {

            if(typeof payload != 'string') {

              // Convert payload to url params
              payload = Object.keys(payload).map(function(key) {
                return key + '=' + encodeURIComponent(payload[key] + '');
              }).join('&');

            }

            options.url_params   = payload;
            options.content_type = 'application/x-www-form-urlencoded; charset=UTF-8';

            // Remove payload to avoid sending on body
            payload = null;

          }


          // Form Data
          if(content_format == 'formdata') {

            // @note Force browser to auto set options.content_type.
            // Manual setting breaks due to `boundary` values for FormData.

            // Convert payload object to form data
            let form_data = new FormData();
            for(let key in payload) {
              form_data.append(key, payload[key]);
            }
            payload = form_data;

          }


          // JSON
          if(content_format == 'json') {

            // Convert to string for posting
            payload = JSON.stringify(payload);

            options.content_type = 'application/json; charset=UTF-8';

          }


          // Add payload
          if(is_empty(payload) != true) {
            options.payload = payload;
          }

        }

        return options;

      };
    });

  }




  /**
   * AJAX call using a specific type of named request
   * request_key This is the index of the requests property to use for the ajax request
   */
  ajax(request_key) {

    let self = this;

    // Pass args to requests for ajax options
    let args    = [].slice.call(arguments).slice(1);
    let options = self.requests[request_key].apply(self, args);
    let xhr_key = request_key + options.url;

    // Abort prev ajax xhr request
    if(self.xhr[xhr_key] != null && options.recall_abort == true) {
      self.xhr[xhr_key].abort();
    }

    // Set a standard callback function
    let callback = function(response) {
      return true; // Default return true to allow trigger events
    };

    // Add first found function in args as callback
    for_each(args, function(i, arg) {
      if(typeof arg === 'function') {
        callback = arg;
      }
    });


    // Build request URL
    let request_url = options.url;

    // Add URL Params
    if(is_empty(options.url_params) == false) {
      request_url += '?' + options.url_params;
    }


    /**
     * Start XHR
     */
    self.xhr[xhr_key] = new XMLHttpRequest();
    self.xhr[xhr_key].open(options.method, request_url, options.async);

    if(is_empty(options.content_type) == false) {
      self.xhr[xhr_key].setRequestHeader('Content-Type', options.content_type);
    }

    // Handle Response
    self.xhr[xhr_key].onload = function() {

      // Success Response
      if(this.status >= 200 && this.status < 400) {
        self._ajax_callback(this, xhr_key, callback, request_key, 'done');
      }
      // Failure Response
      else {
        self._ajax_callback(this, xhr_key, callback, request_key, 'fail');
      }

    };

    // Handle Error
    self.xhr[xhr_key].onerror = function() {
      self._ajax_callback(this, xhr_key, callback, request_key, 'fail');
    };

    // Send Request
    self.xhr[xhr_key].send(options.payload);

  }




  /**
   * AJAX Callback
   */
  _ajax_callback(xhr, xhr_key, callback, request_key, event_type) {

    let trigger_type = request_key + '.' + event_type;

    let payload = null;
    try {
      payload = JSON.parse(xhr.response)
    }
    catch {
      payload = xhr.response;
    }

    if(callback(event_type) !== false) {
      if(this.events.hasOwnProperty(trigger_type)) {
        // Trigger Event if not false from callback()
        this.trigger(trigger_type, [payload, xhr, null]);
      }
    }

    delete this.xhr[xhr_key];

  }




  /**
   * Get Class Name
   */
  get_class_name(self = null) {

    if(self != null) {
      return self.__proto__.constructor.name;
    }

    return this.__proto__.constructor.name;

  }




  /**
   * Keyup
   */
  keyup(event, target) {

    // Ctrl + Enter Pressed Key
    if((event.ctrlKey || event.metaKey) && event.keyCode == 13) {
      this.save(event, target);
    }

    // Escape Key
    if(event.keyCode == 27) {
      this.cancel(event, target);
    }

  }




  /**
   * Handle Disabled Item Click
   * @returns {undefined}
   */
  handle_disabled_click(event, target) {

    // @important Run both as Chrome updates keep changing this for some reason
    event.stopImmediatePropagation();
    event.preventDefault();

  }




  /**
   * Handle Confirm Button Toggle
   * @returns {undefined}
   */
  handle_confirm_click(event, target) {

    let self = this;

    // Confirmation not required or disabled?
    if(target.hasClass('disabled')) {
      self.stop_event(event);
      return;
    }

    // Is this the first click?
    if(target.hasClass('affirm') == false) {

      // Timer to prevent double click
      setTimeout(function() {

        target.addClass('affirm');
        target.find('.button-label').hide();
        target.find('.confirm-label').show();

        // Timer to reset if not clicked
        setTimeout(function() {

          target.removeClass('affirm');
          target.find('.confirm-label').hide();
          target.find('.button-label').show();

        }, 3000); // Remove affirm

      }, 200); // Anti double click

      // Cancel click action
      event.stopPropagation();
      event.preventDefault();

      return;

    }

    // Is this the second click?
    if(target.hasClass('affirm') == true) {

      // Add 'disabled' class in setTimeout to prevent 'handle_disabled_click' being called
      setTimeout(function() {
        target.addClass('disabled');
      }, 0);

    }

  }




  /**
   * Lock Component
   */
  lock(event, target) {

    this.find('button').addClass('disabled is-lock');
    this.find('input').addClass('disabled is-lock');
    this.find('textarea').addClass('disabled is-lock');

    this.stop_event(event);

  }




  /**
   * Unlock Component
   */
  unlock(event, target) {

    // Only enable items that were marked as is-lock from event above.
    this.find('button.is-lock').removeClass('disabled is-lock');
    this.find('input.is-lock').removeClass('disabled is-lock');
    this.find('textarea.is-lock').removeClass('disabled is-lock');

    this.stop_event(event);

  }




  /**
   * Dialog
   */
  dialog(options = null) {

    // Set Options
    options = default_empty_object(options, {
      message : null,
      buttons : null,
    });

    // Add ok if no other buttons exist
    if(is_empty(options.buttons) == true) {
      options.buttons = {
        'Ok' : function() {
          return false;
        },
      }
    }

    Dialog.Build(options);

  }




  /**
   * Check if is dirty (unsaved changes)
   */
  is_dirty(show_dialog = true) {

    var is_dirty = false;

    // Check if is marked as dirty
    if(this.attr('data-is_dirty') == 'true') {
      is_dirty = true;
    }

    // Show is dirty confirmation
    if(is_dirty == true && show_dialog == true) {

      this.dialog({
        'message' : 'Are you sure you want to close? There are unsaved changes.',
        'buttons' : {
          'Yes' : function() {
            return true;
          },
          'No'  : function() {
            return false;
          },
        },
      });

    }

    return is_dirty;

  }




  /**
   * Init Dirty Flag
   */
  init_dirty(form, prompt_leaving = false) {

    this.clear_dirty(form);

    // Bind Form Change
    $(form).bindFormChange({
      'change' : function(event) {

        // Mark as dirty on form change
        $(form).attr('data-is_dirty', 'true');

        // Handle prompt on leaving if form is dirty
        if(prompt_leaving == true) {

          $(window).on('beforeunload', function() {
            return 'Are you sure you want to close? There are unsaved changes.';
          });

        }

      }
    });

  }




  /**
   * Clear Dirty Flag
   */
  clear_dirty(form) {

    $(form).attr('data-is_dirty', 'false');

    // Clear any beforeunload event
    $(window).off('beforeunload');

  }




  /**
   * Serialize Form - Works on all fields, including disabled.
   * @param form_element
   * @param params_output
   */
  serialize_form(form_element = null, params_output = false) {

    if(form_element == null) {
      console.error('Form element required for AttoyaComponent.serialize_form()');
      return false;
    }

    var data = {
      prefix : this.find('#id_prefix').val(),
    };

    // Get data for all inputs
    $(':input', form_element).each(function() {

      var value = $(this).val();

      // Use boolean for checkbox value
      if($(this).attr('type') == 'checkbox') {
        value = $(this).prop('checked');
      }

      // Only load add values to inputs with names
      if(is_empty(this.name) == false) {
        data[this.name] = value;
      }

    });

    if(params_output == true) {
      return $.param(data);
    }

    return data;

  }




  /**
   * Hydrate data and set to form
   * @param {object} data
   */
  hydrate_form(data) {

    // Use Attoya().hydrate();

  }




  /**
   * Clear Error
   * @param {jQuery.Event} event
   */
  clear_error(event, target) {

    // Clear error highlighting and remove error as title
    $(event.currentTarget).removeClass('error').attr('title', '');

  }




  /**
   * Get Event Row
   * Events coming in are from text or a click
   * Handle differently based on parameter input
   * @param {jQuery.Event} event (required) - Triggered event
   * @returns {jQuery}
   */
  get_event_row(event, target) {

    if(event.type == 'click') {
      return $(event.currentTarget).closest('tr');
    }
    else {
      return $(event).closest('tr');
    }

  }




  /**
   * Validate
   */
  validate(event, target) {

  }




  /**
   * Validate Complete
   */
  validateComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaComponent).validateComplete()', payload);

    this.stop_event(event);

  }




  /**
   * Validate Error
   */
  validateError = function(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaComponent).validateError()', payload);

    // Don't notify on aborts
    if(xhr.statusText == 'abort') {
      this.stop_event(event);
      return;
    }

    Dialog.OK({
      'title'   : 'Validate Error',
      'message' : 'An error occured while validating. Please check your details are correct. If the error persist, please report a system issue.',
    });

    this.stop_event(event);

  }




  /**
   * Save
   */
  save(event, target) {

  }




  /**
   * Save Complete
   */
  saveComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaComponent).saveComplete()', payload);

    this.stop_event(event);

  }




  /**
   * Save Error
   */
  saveError(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaComponent).saveError()', payload);

    // Don't notify on aborts
    if(xhr.statusText == 'abort') {
      this.stop_event(event);
      return;
    }

    Dialog.OK({
      'title'   : 'Saving Error',
      'message' : 'An error occured while saving. Please check your details are correct. If the error persist, please report a system issue.',
    });

    this.stop_event(event);

  }




  /**
   * Cancel
   */
  cancel(event, target) {

  }




  /**
   * Cancel Complete
   */
  cancelComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaComponent).cancelComplete', payload);

    this.stop_event(event);

  }




  /**
   * Cancel Error
   */
  cancelError(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaComponent).cancelError', payload);

    // Don't notify on aborts
    if(xhr.statusText == 'abort') {
      this.stop_event(event);
      return;
    }

    Dialog.OK({
      'title'   : 'Cancelling Error',
      'message' : 'An error occured while archiving. If the error persist, please report a system issue.',
    });

    this.stop_event(event);

  }




  /**
   * Archive
   */
  archive(event, target) {

    this.console.debug(this.get_class_name() + '(AttoyaComponent).archive()');

    this.stop_event(event);

  }




  /**
   * Archive Complete
   */
  archiveComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaComponent).archiveComplete()', payload);

    this.stop_event(event);

  }




  /**
   * Archive Error
   */
  archiveError(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaComponent).archiveError()', payload);

    // Don't notify on aborts
    if(xhr.statusText == 'abort') {
      this.stop_event(event);
      return;
    }

    Dialog.OK({
      'title'   : 'Archiving Error',
      'message' : 'An error occured while archiving. If the error persist, please report a system issue.',
    });

    this.stop_event(event);

  }




  /**
   * Discard
   */
  discard(event, target) {

    this.console.debug(this.get_class_name() + '(AttoyaComponent).discard()');

    this.stop_event(event);

  }




  /**
   * Discard Complete
   */
  discardComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaComponent).discardComplete()', payload);

    this.stop_event(event);

  }




  /**
   * Discard Error
   */
  discardError(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaComponent).discardError()', payload);

    // Don't notify on aborts
    if(xhr.statusText == 'abort') {
      this.stop_event(event);
      return;
    }

    Dialog.OK({
      'title'   : 'Discarding Error',
      'message' : 'An error occured while discarding. If the error persist, please report a system issue.',
    });

    this.stop_event(event);

  }




  /**
   * Sort
   */
  sort(ui, target = null) {

  }




  /**
   * Sort Complete
   */
  sortComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaComponent).sortComplete', payload);

    this.stop_event(event);

  }




  /**
   * Sort Error
   */
  sortError(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaComponent).sortError()', payload);

    // Don't notify on aborts
    if(xhr.statusText == 'abort') {
      this.stop_event(event);
      return;
    }

    Dialog.OK({
      'title'   : 'Sort Error',
      'message' : 'An error occured while sorting. Please check your details are correct. If the error persist, please report a system issue.',
    });

    this.stop_event(event);

  }




  /**
   * Load
   */
  load(event, target) {

  }




  /**
   * Load Complete
   */
  loadComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaComponent).loadComplete()', payload);

    this.stop_event(event);

  }




  /**
   * Load Error
   */
  loadError(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaComponent).loadError()', payload);

    // Don't notify on aborts
    if(xhr.statusText == 'abort') {
      this.stop_event(event);
      return;
    }

    Dialog.OK({
      'title'   : 'Load Error',
      'message' : 'An error occured while loading. If the error persist, please report a system issue.',
    });

    this.stop_event(event);

  }




  /**
   * Reload
   */
  reload(event, target, callback) {

    this.stop_event(event);

  }




  /**
   * Reload Complete
   */
  reloadComplete(event, payload, xhr, target, callback) {

    this.console.ajax(this.get_class_name() + '(AttoyaComponent).reloadComplete()', payload);

    // Run callback
    if(is_function(callback) == true) {

      // Wait a before callback. This is to make sure the new content is loaded.
      setTimeout(function() {
        callback();
      }, 500);

    }

    this.stop_event(event);

  }




  /**
   * Reload Error
   */
  reloadError(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaComponent).reloadError()', payload);

    // Don't notify on aborts
    if(xhr.statusText == 'abort') {
      this.stop_event(event);
      return;
    }

    Dialog.OK({
      'title'   : 'Reloading Error',
      'message' : 'An error occured while reloading. If the error persist, please report a system issue.',
    });

    this.stop_event(event);

  }




  /**
   * Data Attribute on wrapper
   */
  data(key, value) {

    if(typeof value === 'undefined') {
      return this.wrapper.attr('data-' + key);
    }
    else {
      return this.wrapper.attr('data-' + key, value);
    }

  }




  /**
   * Attribute on wrapper
   */
  attr(key, value) {

    if(typeof value === 'undefined') {
      return this.wrapper.attr(key);
    }
    else {
      return this.wrapper.attr(key, value);
    }

  }




  /**
   * Multiple Attributes on wrapper
   */
  attrs(attrs) {

    let self = this;

    if(is_empty(attrs) == false) {
      $.each(attrs, function(key, value) {
        self.attr(key, value);
      });
    }

  }




  /**
   * Properties on wrapper
   */
  prop(key, value) {

    if(typeof value === 'undefined') {
      return this.wrapper.prop(key);
    }
    else {
      return this.wrapper.prop(key, value);
    }

  }




  /**
   * Find on wrapper
   */
  find(selector) {

    return this.wrapper.find(selector);

  }




  /**
   * First on wrapper
   */
  first(selector) {

    return this.wrapper.first(selector);

  }




  /**
   * Closest on wrapper
   */
  closest(selectors, context) {

    return this.wrapper.closest(selectors, context);

  }




  /**
   * CSS on wrapper
   */
  css(selector) {

    return this.wrapper.css(selector);

  }




  /**
   * Add Class on wrapper
   */
  add_class(selector) {

    return this.wrapper.addClass(selector);

  }




  /**
   * Remove Class on wrapper
   */
   remove_class(selector) {

    return this.wrapper.removeClass(selector);

  }




  /**
   * Has Class on wrapper
   */
  has_class(selector) {

    return this.wrapper.hasClass(selector);

  }




  /**
   * Replace With on wrapper
   */
   replace_with(selector) {

    return this.wrapper.replaceWith(selector);

  }




  /**
   * Trigger on wrapper
   */
  trigger(type, data) {

    return this.wrapper.trigger(type, data);

  }




  /**
   * Don't propagate event
   */
  stop_propagation(event) {

    if(is_empty(event) == false) {
      event.stopPropagation();
    }

    return false;

  }




  /**
   * Prevent Default
   */
  prevent_default(event) {

    if(is_empty(event) == false) {
      event.preventDefault();
    }

    return false;

  }




  /**
   * Stop Event
   */
  stop_event(event) {

    if(is_empty(event) == false) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }

    return false;

  }




  /**
   * Reload the window
   */
  reload_window(event) {

    event.preventDefault();

    location.reload();

    return false;

  }




}



