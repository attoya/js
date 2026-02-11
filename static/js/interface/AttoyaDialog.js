





var AttoyaDialog = function() {

  this.loaderVisible = false;

};




/**
 * Dialog Init
 */
AttoyaDialog.init = function() {

};




/**
 * OK Dialog
 * @param {string} title (optional)
 * @param {string} message (required)
 * @param {function} callback (optional)
 */
AttoyaDialog.OK = function(title, message, callback) {

  return this.Build({
    title   : title,
    message : message,
    buttons : {
      'Ok' : callback
    }
  });

};




/**
 * OK/Cancel Dialog
 * @param {string} title (optional)
 * @param {string} message (required)
 * @param {function} ok_callback (optional)
 * @param {function} cancel_callback (optional)
 */
AttoyaDialog.OKCancel = function(title, message, ok_callback, cancel_callback) {

  return this.Build({
    title   : title,
    message : message,
    buttons : {
      'Cancel' : cancel_callback,
      'Ok'     : ok_callback
    }
  });

};




/**
 * Warning OK/Cancel Dialog with Red Color
 * @param {string} title (optional)
 * @param {string} message (required)
 * @param {function} ok_callback (optional)
 * @param {function} cancel_callback (optional)
 */
AttoyaDialog.WarningOkCancel = function(title, message, ok_callback, cancel_callback) {

  return AttoyaDialog.OKCancel(title, message, ok_callback, cancel_callback)
          .prev('.ui-dialog-titlebar').addClass('ui-state-error').css('border', '0')
          .parent('.ui-dialog').addClass('ui-state-error');

};




/**
 * Yes/No Dialog
 * @param {string} title (optional)
 * @param {string} message (required)
 * @param {function} yes_callback (optional)
 * @param {function} no_callback (optional)
 */
AttoyaDialog.YesNo = function(title, message, yes_callback, no_callback, options) {

  return this.Build({
    ...options, // @note ...options is equivalent to Python's **kwargs
    title   : title,
    message : message,
    buttons : {
      'No'   : no_callback,
      'Yes'  : yes_callback
    }
  });

};




/**
 * Warning Yes/No Dialog with Red Color
 * @param {string} title (optional)
 * @param {string} message (required)
 * @param {function} ok_callback (optional)
 * @param {function} cancel_callback (optional)
 */
AttoyaDialog.WarningYesNo = function(title, message, yes_callback, no_callback) {

  return AttoyaDialog.YesNo(title, message, yes_callback, no_callback)
          .prev('.ui-dialog-titlebar').addClass('ui-state-error').css('border', '0')
          .parent('.ui-dialog').addClass('ui-state-error');

};




/**
 * Link To Confirm Dialog (Override for symfony confirm dialog)
 * @param {string} element (required)
 * @param {string} message (required)
 * @returns false
 */
AttoyaDialog.LinkToConfirm = function(element, message) {

  this.Build({
    title   : 'Confirm',
    message : message,
    buttons : {
      'Cancel' : null,
      'Ok'     : function() {
        location.href = $(element).attr('href');
      }
    }
  });

  return false; // Must be done to cance button click action

};




/**
 * Build Dialog
 * @param {json} options (required)
 *  - See AttoyaDialog.Builder for options
 */
AttoyaDialog.Build = function(options) {

  // Create base Dialog from string
  var DialogObject = $('<div>' + options.message + '</div>');

  return AttoyaDialog.Builder(DialogObject, options);

};




/**
 * Dialog Builder
 * @param {json} options
 *  - @param {sting} title (optional)
 *  - @param {object} buttons (optional) Object of buttons
 *  - @param {int} width (optional)
 *  - @param {int} height (optional)
 */
AttoyaDialog.Builder = function(DialogObject, options) {

  this.loaderHide();

  var dialog_options = {
    title       : options.title,
    dialogClass : default_empty(options.title, 'ui-no-titlebar'),
    resizable   : false,
    modal       : true,
    draggable   : false,
    // show        : null, # @note don't to show or hide transitions as unknown issue makes the dialog jump on load
    // hide        : null,
  };

  if(options.width > 0) {
    dialog_options.width = options.width;
  }
  if(options.width > 0) {
    dialog_options.height = options.height;
  }
  if(options.position != undefined) {
    dialog_options.position = options.position;
  }

  DialogObject.dialog(dialog_options);

  var buttons = [], key = 0;


  // Add buttons
  $.each(options.buttons, function(name, callback) {

    buttons[key] = {
      text  : name,
      id    : 'dialog-' + key + '-btn',
      click : function() {

        var destroy = true;

        if(is_function(callback)) {
          var response = callback();
          // Only override destroy if is boolean response
          if(typeof (response) === 'boolean') {
            destroy = response;
          }
        }

        if(destroy === true) {
          $(this).dialog('destroy');
        }
      }

    };

    key += 1;

  });

  return DialogObject.dialog('option', 'buttons', buttons);

};




/**
 * Show Flash
 * @param {string} type (required) error | notic
 * @param {string} message (required)
 */
AttoyaDialog.flashShow = function(type, message) {

  if(is_empty(type) == true) {
    type = 'error';
  }

  if(is_empty(message) == true) {
    message = 'No message';
  }

  $('#ui-flash-' + type).html(message);
  $('#ui-flash-' + type).slideDown('fast');

};




/**
 * Hide Flash
 * @param {string} type (required) error | notice
 */
AttoyaDialog.flashHide = function(type) {

  if(is_empty(type) == true) {
    type = 'error';
  }

  $('#ui-flash-' + type).html('');
  $('#ui-flash-' + type).slideUp('fast');

};




/**
 * Show Loader Div
 * @param {boolean} force (optional)
 */
AttoyaDialog.loaderShow = function(force) {

  AttoyaDialog.loaderVisible = true;

  $('body').append('<div class="dialog-loading-overlay ui-widget-overlay ui-helper-hidden" style="z-index:9000;">'
          + '<img src="/images/wait.gif" style="top:50%; margin-top:-25px; margin-left:-25px; left:50%; position: relative;" class="updating_image ui-corner-all">'
          + '</div>');

  $('.dialog-loading-overlay').fadeIn('fast');

  // If Loader isn't forced then allow click to exit
  if(force !== true) {
    $('.dialog-loading-overlay').click(function() {

      AttoyaDialog.loaderHide();

    });
  }

};




/**
 * Hide Loader Div
 */
AttoyaDialog.loaderHide = function() {

  if(AttoyaDialog.loaderVisible === true) {

    $('.dialog-loading-overlay').fadeOut('fast').remove();
    AttoyaDialog.loaderVisible = false;

  }

};




/**
 * Create Object
 */
$(document).ready(function() {

  new AttoyaDialog.init();

});



