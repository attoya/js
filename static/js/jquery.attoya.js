

/**
 * Attoya JS jQuery Plugin
 * @copyright (c) 2024-present APSF LLC dba Attoya and contributors
 * @license MIT
 * @version v2.0.0
 */




/**
 * Data storage for jQuery.attoya.js functions
 */
var jQueryAttoya = function() {

  var bindFocusElementsOptions = {
      element_parents: null,
      callback:        null
  };

};






/**
 * Attoya JS jQuery Functions
 */
jQuery.extend(jQuery.fn, {




  /**
   * Bind Focus Elements
   * @note used in Blowout
   *
   * Bind body click event that will check if current
   * event's element is in an array of supplied elements
   * (element_parents), or is the parent.
   *
   * var element_parents = ['contactForm', 'blowout'];
   * $("body").bindFocusElements(element_parents, function(selected) {
   *   if(selected == -1) {
   *     Blowout.close();
   *     // Callback function for losing focus
   *     if(typeof (options.blur) === 'function') {
   *       options.blur();
   *     }
   *   }
   * });
   *
   * @param {array} element_parents
   * @param {function} callback
   * @returns {int} Return will be -1 if not selected and 1 if selected
   */
  bindFocusElements: function(element_parents, callback) {

    // Add a replace-able click event
    $(this).attr('onclick', '$(this).checkFocusElements(this);');

    // Use data() to store as a true objects
    jQueryAttoya.bindFocusElementsOptions = {
      element_parents: element_parents,
      callback:        callback
    };

  },




  /**
   * Check Focus Elements
   * Function call created by bindFocusElements()
   */
  checkFocusElements: function(element) {

    var options  = jQueryAttoya.bindFocusElementsOptions;
    var selected = false;

    // Is target within a parent of approved focus element parents
    $.each(options.element_parents, function(index, element) {

      // Use window.event as 'onclick' does not pass event
      if($(window.event.target).parents(element).length > 0) {
        selected = true;
      }

    });


    if(typeof (options.callback) === 'function') {
      options.callback(selected);
    }
    else {
      return selected;
    }

  },




  /**
   * Resizable Bottom Panel
   * Applies the functionality of a resizable panel attached the bottom of window. See Blowout.js for usage.
   *
   * $('#blowout').resizableBottomPanel(options)
   *
   * @param {json} options
   *  - @param integer height
   *  - @param integer maxHeight
   *  - @param string controls
   *  - @param string innerResize
   *  - @param integer innerResizeOffset
   *  - @param function resize (element, event, ui)
   *  - @param function stop (element, event, ui)
   */
  resizableBottomPanel: function(options) {

    var self = this;

    var ResizableObject = {
      maxHeight : default_empty(options.maxHeight, window.innerHeight),
      minHeight : 50,
      handles   : "n",
      autoHide  : true,
      stop      : function(event, ui) {

        // Keep top from going off screen by adjusting height
        if(parse_int($(self).css('top')) < 0) {
          ui.size.height = parse_int($(self).css('height')) + parse_int($(self).css('top'));
          $(self).css('height', ui.size.height);
        }

        // Remove top css to keep on bottom
        $(self).css('top', '');

        // Store height when resizing stops
        set_cookie('ui-resizable-bottom-panel-height', ui.size.height, 30);

        // Stop function
        if(is_function(options.stop)) {
          options.stop(this, event, ui);
        }

      },
      resize    : function(event, ui) {

        // Set inner resize object on resize
        setInnerResize(ui.size.height);

        // resize function
        if(is_function(options.resize)) {
          options.resize(this, event, ui);
        }

      },
    };


    // Set inner resize element
    var setInnerResize = function(height) {

      if(is_empty(options.innerResize) == true) {
        return;
      }

      // Calc height given with offset for grab bar and extra offset
      height = (height - 45) - default_empty(options.innerResizeOffset, 0);
      if(height < 20) {
        height = 20;
      }

      $(options.innerResize).css('height', height + 'px');

    };


    // Resizable Top with static resizable bar
    $(self).resizable(ResizableObject)
           .prepend('<div class="ui-resizable-n-static"></div>');


    // Set default height
    if(is_empty(options.height) == true) {

      var stored_height = get_cookie('ui-resizable-bottom-panel-height');

      if(!is_empty_int(stored_height)) {
        // Set to last stored height
        options.height = parse_int(stored_height);
      }
      else {
        // Default to 200px
        options.height = parse_int(600);
      }

    }


    // Animate to show
    $(self).hide()
           .css('visibility', 'visible')
           .fadeIn(100);

    $(self).css({
      height   : options.height + 'px',
    }, {
      duration : 100,
      queue    : false,
    });

    // Set inner resize height at load
    setInnerResize(options.height);

    // Add controls to main grip
    if(is_empty(options.controls) == false) {
      $(self).find('.ui-resizable-n')
             .html('<div class="ui-resizable-controls">' + options.controls + '</div>');
    }

  },




  /**
   * JumpSlide Effect. On mouse over selector, item will jump up, then down on mouse out.
   * @param {string} direction | height : width
   * @param {integer} size in pixels
   */
  effectJumpSlide: function(direction, size) {

    // Initial Slide
    $(this).hide().css('visibility', 'visible').fadeIn("fast");
    $(this).animate({[direction]: size + "px"}, "fast");

    // Bind mouse movements for slide
    $(this).on('mouseenter', function() {

      if(!$(this).is(":animated")) {
        $(this).animate({[direction]: size + "px"}, "fast");
      }

    });

    $(this).on('mouseleave', function() {

      if(!$(this).is(":animated")) {
        $(this).animate({[direction]: "100px"}, "fast");
      }

    });

  },




  /**
   * Slide to element location on page with animation
   * Animation to slide to a given selector on the page. Padding in pixels.Default padding is 20.
   * @note used for Wizard
   * @param {integer} padding in pixels
   */
  slideTo: function(padding) {

    if(is_empty(padding) == true) {
      padding = 50;
    }

    $('html,body').animate({
      scrollTop: ($(this).offset().top - padding)
    }, {
      duration: 500,
      queue:    false
    });

  },




  /**
   * Bind Form Change
   * @note used for AttoyaComponent.js
   *
   * $('#form').bindFormChange(options);
   *
   * To check if form has changed call hasFormChanged(). Will return boolean.
   * $('#form').hasFormChanged();
   *
   * To reset the form call resetFormChange().
   * $('#form').resetFormChange();
   *
   * @param {json} options
   * - @param {array} ignore_elements (optional)
   * - @param {function} change (optional) Parameters select(event).
   */
  bindFormChange: function(options) {

    var self = this;

    options = default_empty_object(options, {
      ignore_elements : null,
      change          : null
    });

    $(self.selector + ' *').filter(':input').each(function(i, form_element) {

      $(this).change(function(event) {

        var found = false;

        // Look for elements containing part of the ignore element
        if(is_empty(options.ignore_elements) == false) {
          $.each(options.ignore_elements, function(i, ignore_element) {

            if($(form_element).attr('id').indexOf(ignore_element) >= 0) {
              found = true;
            }

          });
        }

        // If not found then mark form as change
        if(found === false) {

          // Mark is dirty
          $(self.selector).attr('data-is_dirty', 'true');

          // Change Callback Function
          if(is_function(options.change)) {
            options.change(event);
          }

        }

      });

    });

  },




  /**
   * Will find the first input within an element and set the focus to the first input.
   * @note used for Wizard
   */
  focusFirstInput: function() {

    $(this.selector + ' :input:enabled:visible:first').focus();

  },




  /**
   * Find height of textbox content
   * @note used for elasticHeightGroup
   * @returns {undefined}
   */
  findTextboxContentHeight: function() {

    var self = this;

    var lineHeight = parseInt(default_empty(self.css('lineHeight'), 16));
    var font       = self.css('font-weight') + ' ' + self.css('font-size') + ' ' + self.css('font-family');
    var count      = 0;

    // Get number of lines
    lines = self.val().split(/\r|\r\n|\n/);
    $.each( lines, function( key, value ) {

      var line_width = get_text_width(value, font);
      var box_width  = parse_int(self.css('width'));

      // Count extra lines for wordwrap
      if(line_width > box_width) {
        count += parseInt(line_width / box_width) + 1;
        if((line_width % box_width) != 0) {
          count += 1;
        }
      }
      else {
        count += 1;
      }

    });

    // Calc new height
    return (lineHeight * count) + 8; // 8px for adjustment

  },




  /**
   * Elastic Height Group
   * @param {array} related_fields (required)
   * @returns {undefined}
   */
  elasticHeightGroup: function(related_fields) {

    if($(this).length == 0) {
      return false;
    }

    if(!is_array(related_fields)) {
      related_fields = null;
    }

    var sizing = function(self, related_fields) {

      // Find new height
      var height = $(self).findTextboxContentHeight();

      // Set minimum height
      var minHeight = parse_int($(self).css('lineHeight'));
      if(height < minHeight) {
        height = minHeight;
      }

      // Find Highest Related
      if(related_fields != null) {
        $.each(related_fields, function(i, related) {
          var thisHeight = $(related).findTextboxContentHeight();
          if(thisHeight > height) {
            height = thisHeight;
          }
        });
      }

      // Set Height(s)
      $(self).css({height: height + 'px'});
      if(related_fields != null) {
        $.each(related_fields, function(i, related) {

          $(related).css({height: height + 'px'});

        })
      }
    };

    // Set CSS
    $(this).css({
      'box-sizing': 'border-box',
      'overflow': 'hidden'
    });

    if(related_fields != null) {
      $.each(related_fields, function(i, related) {

        $(related).css({
          'box-sizing': 'border-box',
          'overflow': 'hidden'
        });

      });
    }

    sizing(this, related_fields);
    $(this).on('input blur', function() {

      sizing(this, related_fields);

    });

    return this;
  },




  /**
   * Elastic Height
   * @refactor Causes UI problems when its gets larger
   * @returns {undefined}
   */
  elasticHeight: function(minLines = 1) {

    if($(this).length == 0) {
      return this;
    }

    // Exit if already enabled
    if($(this).hasClass('elastic-height') == true) {
      return this;
    }

    // Set CSS
    $(this).attr('rows', 1).css({
      'box-sizing' : 'border-box',
      'overflow'   : 'hidden',
      'min-height' : (parse_int(minLines) * 14) + 14 + 'px',
    });

    // Add class to see if already enabled
    $(this).addClass('elastic-height');

    // Default scroll height in case element hidden from view
    let defaultScrollHeight = $(this)[ 0 ].scrollHeight;
    if(defaultScrollHeight == 0) {
      defaultScrollHeight = 35; // Is the number needed to end up at 51px at render.
    }
    $(this).height('auto').height(defaultScrollHeight);

    $(this).on('input focus', function() {
      $(this).height('auto').height($(this)[ 0 ].scrollHeight + 3);
    });

    $(this).on('input blur', function() {
      $(this).height('auto').height($(this)[ 0 ].scrollHeight + 3);
    });

    return this;

  },




  /**
   * Auto Format Input
   *
   * Integer Min 0 Example
   * $('.moq, .max_quantity').autoFormatInput({type: 'integer', min: 0});
   *
   * Float Min Min Example
   * $('.unit_cost, .batch_qc_cost').autoFormatInput({type: 'float', min:0});
   *
   * Float Min and Max Example
   * $('.yield_loss').autoFormatInput({type: 'float', min: 0, max: 100});
   *
   * @param {json} options
   *  - @param {string} type (optional) - Default 'integer' (float/decimal, integer)
   *  - @param {integer} decimal (optional) - Decimal Places to Format, default 2
   *  - @param {float} min (optional)
   *  - @param {float} max (optional)
   */
  autoFormatInput: function(options) {

    options = default_empty_object(options, {
      type    : 'integer',
      decimal : 2,
      min     : 0,
      max     : null,
    });

    // MathJS only handles up to 8 decimal places nicely
    if(options.decimal > 8) {
      options.decimal = 8;
    }

    if(options.min != null) {
      if(options.type == 'integer') {
        options.min = parse_int(options.min);
      }
      else {
        options.min = parse_float(options.min);
      }
    }
    if(options.max != null) {
      if(options.type == 'integer') {
        options.max = parse_int(options.max);
      }
      else {
        options.max = parse_float(options.max);
      }
    }


    $.each(this, function(i, self) {

      $(self).change(function() {

        // Get Current Value
        let value = default_empty($(this).val(), 0);
        value = parse_float(value); // Convert to int

        // Minimum Value
        if(is_float(options.min) == true) {
          if(is_empty_float(value) == true || (value < options.min) == true) {
            value = options.min;
          }
        }

        // Maximum Value
        if(is_float(options.max) == true) {
          if(value > options.max) {
            value = options.max;
          }
        }

        // Format Decimal
        if(options.type == 'decimal' || options.type == 'float') {
          value = parse_decimal(value, options.decimal);
        }

        // Format Integer
        if(options.type == 'integer') {
          value = parse_int(value);
        }

        $(this).val(value);

      });
    });

    return this; // For stacking jQuery functions

  },




  /**
   * Date Select
   */
  dateSelect: function() {

    $(this).datepicker({
      showWeek   : true,
      firstDay   : 1,
      dateFormat : 'dd M yy',
    });

  },




  /**
   * Enable UI Element
   *
   * Optional parameter of readonly as boolean.Use this if your form field will be posted in a disabled state.
   * If pure disable then the field will not be posted.
   *
   * $(selector).disable();
   * $(selector).disable(true);
   * $(selector).enable();
   *
   * To keep from other items enabling a button when you don't want, you can set a lock key string.
   * By setting this, you must use the same key when enabling.
   *
   * var lock_key = 'submit-hold';
   * $(selector).disable(true, lock_key);
   * $(selector).enable(lock_key);
   * $(selector).enable(lock_key, true);
   *
   * @param {string} lock_key
   * @param {bool} remove_lock
   */
  enable: function(lock_key, remove_lock) {

    $.each(this, function(i, self) {

      var set_lock_key = $(self).attr('data-disable_lock_key');

      // Check if lock key set and if given key matches
      if(is_empty(set_lock_key) == false && (set_lock_key != lock_key)) {
        // Do nothing, no lock key or invalid key
        return false;
      }
      else if(remove_lock === true && set_lock_key == lock_key) {
        // Remove lock
        $(self).attr('data-disable_lock_key', '');
      }

      var attribute = $(self).attr('data-disable_attr');
      if(is_empty(attribute) == true) {
        attribute = 'disabled';
      }
      $(self).attr(attribute, false)
             .removeClass('disabled');
    });

    return this; // For stacking jQuery functions
  },




  /**
   * Disable UI Element
   * @param {boolean} readonly
   * @param {string} lock_key
   */
  disable: function(readonly, lock_key) {

    var attribute = 'disabled';
    if(readonly === true) {
      attribute = 'readonly';
    }

    $.each(this, function(i, self) {

      $(self).attr(attribute, true)
             .attr('data-disable_attr', attribute)
             .addClass('disabled');

      if(is_empty(lock_key) == false) {
        $(self).attr('data-disable_lock_key', lock_key);
      }

    });

    return this; // For stacking jQuery functions

  },




  /**
   * Check if UI Element is Disabled
   * Check on disabled elements
   */
  isDisabled: function() {

    return $(this).hasClass('disabled');

  },




  /**
   * Prevent Double Click on UI Element
   */
  preventDblClick: function() {

    $.each(this, function(i, self) {

      var bind_element = $(self); // Set default to self

      /**
       * If parent is an anchor tag, then bind element to parent
       * This is for buttons created with symfony link_to helper
       */
      if($(self).parent().get(0).tagName === 'A') {
        bind_element = $(self).parent();
      }

      /**
       * Bind click event to given bind element
       * If element is disabled then stop event propagation
       * Otherwize disable the element and allow event
       */
      bind_element.click(function(event) {

        if($(self).isDisabled() === true) {
          event.preventDefault();
        }
        else {
          $(self).disable();
        }

      });

    });

    return this; // For stacking jQuery functions

  },




  /**
   * Single Click (click with preventDblClick())
   * @param {function} click_callback
   */
  singleClick: function(click_callback) {

    $.each(this, function(i, self) {
      $(self).preventDblClick().click(click_callback);
    });

    return this; // For stacking jQuery functions

  },




  /**
   * Reverse Object Order
   */
  reverse: function() {

    return this.pushStack(this.get().reverse(), arguments);

  },




  /**
   * Checks if Value is empty on selector
   * Required Tools.js
   */
  isEmpty: function() {

    return is_empty($(this).val());

  },




  /**
   * Check if value is an integer
   * Required Tools.js
   */
  isInt: function() {

    return is_int($(this).val());

  },




  /**
   * Check if value is empty interger
   * Required Tools.js
   */
  isEmptyInt: function() {

    return is_empty_int($(this).val());

  },




  /**
   * Check if value is a decimal number
   * Required Tools.js
   */
  isFloat: function() {

    return is_float($(this).val());

  },




  /**
   * Check if value is empty decimal (float)
   * Required Tools.js
   */
  isEmptyFloat: function() {

    return is_empty_float($(this).val());

  }




});






/**
 * Create jQueryAttoya Object
 */
$(document).ready(function() {

  new jQueryAttoya;

});





