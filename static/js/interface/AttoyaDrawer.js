





class AttoyaDrawer extends AttoyaPlainComponent {




  /**
   * Constructor
   */
  constructor(options) {

    options = default_empty_object(options, {
      slug      : null,
      wrapper   : $('#attoya-drawer'),
      content   : $('#attoya-drawer-content'),
      origin    : $('#attoya-drawer').attr('data-origin'),
      height    : 250,
      focus     : null,
      fail      : null,
      blur      : null,
      completed : null,
      dialog    : {},
    });


    super(options);

  }




  /**
   * Initializes Class
   */
  init() {

    super.init();

    this.visible = false;
    this.loading = false;
    this.scale   = {};

    // Rescale on window resize actions
    $(window).on('resize', function() {

      Drawer.rescale();
      Drawer.resize();

    });

    // Trigger resize on load
    $(window).trigger('resize');

  }




  /**
   * Initialize Form
   */
  init_form(is_new = false) {

    super.init_form(is_new);

    if(is_new == true) {

      this.find('#attoya-drawer-menu .crud .archive').addClass('disabled');
      this.find('#attoya-drawer-menu .crud .discard').addClass('disabled');

    }

  }




  /**
   * Bind Autocomplete
   */
  bindAutocomplete(options) {

    options = default_empty_object(options, {
      drawer : true, // Flag this is for a drawer
    })

    return super.bindAutocomplete(options);

  }




  /**
   * Initializes Private Events
   */
  _init_events() {

    super._init_events();

    this.add_events({

      // Crud Menu
      'click #attoya-drawer-menu .crud .archive'       : 'archive',
      'click #attoya-drawer-menu .crud .discard'       : 'discard',

      // Action Menu

      // Primary Menu
      'click #attoya-drawer-menu .primary .save'       : 'save',
      'click #attoya-drawer-menu .primary .cancel'     : 'close',
      'click #attoya-drawer-menu .primary .close'      : 'close',

      // Actions
      'click .control-close'                           : 'close',
      'click .control-maximize'                        : 'maximize',
      'click .control-restore'                         : 'restore',

      'click .dialog.button'                           : 'click_dialog',

      // Triggers
      'Drawer:close'                                   : 'close',
      'Drawer:maximize'                                : 'maximize',
      'Drawer:restore'                                 : 'restore',

      // Ajax Requests

    });

  }




  /**
   * Initializes Private Requests
   * @returns {undefined}
   */
  _init_requests() {

    super._init_requests();

    this.add_requests({
      'loadSubmit'          : 'POST',
      'archiveSubmit'       : 'ARCHIVE',
      'discardSubmit'       : 'DISCARD',
      'saveSubmit'          : 'FORMDATA',
    });

  }




  /**
   * Close Drawer
   */
  close(event) {

    // Check if drawer is dirty. Exit if true.
    if(Drawer.is_dirty(true) == true) {
      return;
    }

    // Close Drawer
    $('#attoya-drawer').hide().animate({
      height : '0px'
    }, {
      duration : 'fast',
      queue    : false
    });

    // Wait and check if drawer is closed
    var wait = setInterval(function() {

      if(!$('#attoya-drawer').is(":animated")) {
        clearInterval(wait);
      }
      else {

        Drawer.visible = false; // Must reference as `Drawer.` do to call

        $('#attoya-drawer').remove();
        $('body').off('click');

      }

    }, 100);

  }




  /**
   * Close Drawer Dialog
   * Only close if visible or not loading
   * @param {bool} force
   */
  static close(force = false) {

    if(Drawer.visible !== true || Drawer.loading === true) {
      return false;
    }

    // Force close now
    if(force === true) {

      Drawer.visible = false; // Must reference as `Drawer.` do to call

      $('#attoya-drawer, #attoya-drawer-scroller-height').remove();
      $('body').off('click');

      return;

    }

    // Trigger event drawer close for actual closing
    $('#attoya-drawer').trigger('Drawer:close');

  }




  /**
   * Maximize Drawer
   */
  maximize(event, target) {

    var height = parse_int(window.innerHeight);

    $('#attoya-drawer').css('height', height + 'px');

    Drawer.resize();

  }




  /**
   * Restore Drawer
   */
  restore(event, target) {

    var height = $('#attoya-drawer').attr('data-restore_height');

    $('#attoya-drawer').css('height', height);

    Drawer.resize();

  }




  /**
   * Archive
   */
  archive(event, target) {

    // Check if not confirmed
    if($(target).hasClass('affirm') == false) {
      return;
    }

    // Grab legacy discard url, and fallback to new method on save url
    let url = this.content.attr('data-url_archive');
    if(is_empty(url) == true) {
      url = this.content.attr('data-url_save');
    }

    // Only stop event if url isnt present
    if(is_empty(url) == true) {

      this.console.error(this.get_class_name(), {
        'error' :'No `data-url_archive` or `data-url_save` defined.',
        'event' : event,
      });

      this.showToast({
        message : 'An error occurred while trying to archive.'
      });

      this.stop_event(event);

      return false;

    }

    // Show loader
    this.find('#attoya-drawer-menu .loader').show();

    this.ajax('archiveSubmit', url);

  }




  /**
   * Archive Complete
   */
  archiveComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaDrawer).archiveComplete()', payload);

    // Hide loader
    this.find('#attoya-drawer-menu .loader').hide();

    this.stop_event(event);

    // Close drawer if archived
    if(payload.success == true) {

      // Trigger update on origin
      try {
        $(this.origin).trigger('Drawer:archiveComplete', payload);
      }
      catch(error) {
        this.console.exception(this.get_class_name() + `.archiveComplete() Unable to trigger 'Drawer:archiveComplete' for origin '${this.origin}'`, error);
      }

      // Clear dirty flag so we can close
      Drawer.clear_dirty();

      // Close Drawer
      this.close();

    }

  }




  /**
   * Archive Error
   */
  archiveError(event, payload, xhr, target) {

    // Hide loader
    this.find('#attoya-drawer-menu .loader').hide();

    super.archiveError(event, payload, xhr, target);

  }




  /**
   * Discard
   */
  discard(event, target) {

    // Check if not confirmed
    if($(target).hasClass('affirm') == false) {
      return;
    }

    // Grab legacy discard url, and fallback to new method on save url
    let url = this.content.attr('data-url_discard');
    if(is_empty(url) == true) {
      url = this.content.attr('data-url_save');
    }

    // Only stop event if url isnt present
    if(is_empty(url) == true) {

      this.console.error(this.get_class_name(), {
        'error' :'No `data-url_discard` or `data-url_save` defined.',
        'event' : event,
      });

      this.showToast({
        message : 'An error occurred while trying to archive.'
      });

      this.stop_event(event);

      return false;

    }

    // Show loader
    this.find('#attoya-drawer-menu .loader').show();

    this.ajax('discardSubmit', url);

  }




  /**
   * Discard Complete
   */
  discardComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaDrawer).discardComplete()', payload);

    // Hide loader
    this.find('#attoya-drawer-menu .loader').hide();

    this.stop_event(event);

    // Close drawer if discarded
    if(payload.success == true) {

      // Trigger update on origin
      try {
        $(this.origin).trigger('Drawer:discardComplete', payload);
      }
      catch(error) {
        this.console.exception(this.get_class_name() + `.discardComplete() Unable to trigger 'Drawer:discardComplete' for origin '${this.origin}'`, error);
      }

      // Clear dirty flag so we can close
      Drawer.clear_dirty();

      // Close Drawer
      this.close();

    }

  }




  /**
   * Discard Error
   */
  discardError(event, payload, xhr, target) {

    // Hide loader
    this.find('#attoya-drawer-menu .loader').hide();

    super.discardError(event, payload, xhr, target);

  }




  /**
   * Validate
   * @note needs to match function of AttoyaBaseForm
   */
  validate(event, target) {

    // Exit if no form
    if(is_empty(this.form) == true) {
      this.console.warn(this.get_class_name(), '.validate() No form is defined ' + this.get_class_name());
    }

    let url = this.content.attr('data-url_save');
    if(is_empty(url) == true) {

      this.console.warn(this.get_class_name(), 'No `data-url_save` is defined on drawer content for ' + this.get_class_name());

      this.showToast({
        message : 'An error occurred while trying to validate your form.'
      });

      this.stop_event(event);
      return false;

    }

    // Serialize a div based form
    let payload = extend_object(this.serialize_form(this.form), {
      'meta' : { // @future
        'prefix'          : this.form_prefix,
        'validate'        : true,
        'validate_fields' : [
          target.attr('name'),
        ],
      },
      'validate'        : true,
      'validate_fields' : [
        target.attr('name'),
      ],
    });

    this.ajax('validateSubmit', url, payload);

  }




  /**
   * Save
   * @note needs to match function of AttoyaBaseForm
   */
  save(event, target) {

    // Exit if no form
    if(is_empty(this.form) == true) {
      this.console.warn(this.get_class_name(), '.save() No form is defined ' + this.get_class_name());
    }

    // Disable button to prevent double click
    this.find('.form-controls button').addClass('disabled');

    let url = this.content.attr('data-url_save');
    if(is_empty(url) == true) {

      this.console.warn(this.get_class_name(), 'No `data-url_save` is defined on drawer content for ' + this.get_class_name());

      this.showToast({
        message : 'An error occurred while trying to validate your form.'
      });

      this.stop_event(event);
      return false;

    }

    // Disable button to prevent double click
    this.find('#attoya-drawer-menu button.save').addClass('disabled');
    this.find('#attoya-drawer-menu button.cancel').addClass('disabled');
    this.form.addClass('disabled');

    // Show loader
    this.find('#attoya-drawer-menu .loader').show();

    // Serialize a div based form
    let payload = extend_object(this.serialize_form(this.form), {
      'meta' : { // @future
        'prefix' : this.form_prefix,
      },
    });

    this.ajax('saveSubmit', url, payload);

  }




  /**
   * Save Complete
   */
  saveComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaDrawer).saveComplete()', payload);

    this.stop_event(event);

    // Close drawer if saved
    if(payload.success == true) {

      // Trigger update on origin
      try {
        $(this.origin).trigger('Drawer:saveComplete', payload);
      }
      catch(error) {
        this.console.exception(this.get_class_name() + `.saveComplete() Unable to trigger 'Drawer:saveComplete' for origin '${this.origin}'`, error);
      }

      Drawer.clear_dirty();

      this.close();

    }
    else {

      // Hide loader
      this.find('#attoya-drawer-menu .loader').hide();

      // Enable buttons
      this.find('#attoya-drawer-menu button.save').removeClass('disabled');
      this.find('#attoya-drawer-menu button.cancel').removeClass('disabled');
      this.form.removeClass('disabled');

      // Enable buttons
      this.find('.form-controls button').removeClass('disabled');

      // Add error highlighting and set error as title
      this.showErrors(payload.errors);

    }

  }




  /**
   * Save Error
   */
  saveError(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaDrawer).saveError()', payload);

    // Don't notify on aborts
    if(xhr.statusText == 'abort') {
      this.stop_event(event);
      return;
    }

    // Hide loader
    this.find('#attoya-drawer-menu .loader').hide();

    // Enable buttons
    this.find('#attoya-drawer-menu button.save').removeClass('disabled');
    this.find('#attoya-drawer-menu button.cancel').removeClass('disabled');
    this.form.removeClass('disabled');

    Drawer.dialog({
      'message' : 'An error occured while saving. Please check your details are correct. If the error persist, please report an issue.',
    });

    this.stop_event(event);

  }




  /**
   * Show Error
   */
  showError(key, error) {

    const dialogKeyArray = [
      'model_ids_store',
    ];

    if(dialogKeyArray.includes(key) == true) {

      Drawer.dialog({
        'message' : error,
      });

    }

    super.showError(key, error);

  }




  /**
   * Click Dialog Button
   */
  click_dialog(event, target) {

    var type   = $(target).attr('data-type');
    var callback = Drawer.dialog_options.buttons[type];

    // Exit if callback isn't set correctly as a function
    if(!is_function(callback)) {
      return false;
    }

    // Run callback function
    if(callback() == true) {

      // Forse close
      Drawer.close(true);

      return false;

    }

    // Remove dialog
    $('#attoya-drawer-dialog').hide();

  }




  /**
   * Rescale (Window Resize)
   */
  static rescale() {

    this.scale = {
      width  : window.innerWidth,
      height : window.innerHeight,
    };

    // Exit if not visible
    if(this.visible !== true) {
      return false;
    }

    $('#attoya-drawer').animate({
      left  : 0,
      right : this.scale.width,
    }, 'fast');

    // Bring to maximum if beyond top (window was probably rescaled)
    if(this.scale.height < parse_int($('#attoya-drawer').css('height'))) {
      $('#attoya-drawer').css('height', this.scale.height + 'px');
    }

  }




  /**
   * Resize
   */
  static resize() {

    var height = parse_int($('#attoya-drawer').css('height'));

    // Display sizing controls based on height
    if(this.scale.height == height) {

      $('#attoya-drawer .control-maximize').hide();
      $('#attoya-drawer .control-restore').show();

      // Manual override for resizableBottomPanel setInnerResize on maximize

      // Calc scroll height given with offset for grab bar
      let scroller_height = (this.scale.height - 25);
      if(scroller_height < 20) {
        scroller_height = 20;
      }

      // Adjust scroller height to show content
      $('#attoya-drawer-scroller').css('height', scroller_height + 'px');

    }
    else {

      // Set restore height
      $('#attoya-drawer').attr('data-restore_height', $('#attoya-drawer').css('height'));

      $('#attoya-drawer .control-maximize').show();
      $('#attoya-drawer .control-restore').hide();

    }

  }




  /**
   * Dialog Load
   * Shows drawer with waiting graphic. Once Ajax request is complete
   * then the drawer is updated with returned html
   * @param {json} options (required)
   * - @param {string} url (required)
   */
  static load(options) {

    options = default_empty_object(options, {
      url          : null,
      data         : null,
      data_type    : null,
      data_attr    : null,
      content_type : null,
    });

    Drawer.loading = true;

    // Get relative height for wait graphic div
    var panel_height  = parse_int(get_cookie('drawer-height'));
    var window_height = parse_int(window.innerHeight * 0.6)
    var height        = parse_int(default_empty(panel_height, window_height) * 0.75);

    // Loading HTML / Graphic
    var loading_html = `
      <content id="drawer-content">
        <div class="column" style="width:100%; height:${height}px;">
          <i style="top:50%; left:50%; position: relative; font-size:2em;" class="far fa-ajax-loader"></i>
        </div>
      </content>
    `;

    // Show drawer with waiting graphic
    Drawer.show(loading_html, options);

    // Hide controls while loading
    $('#attoya-drawer .ui-resizable-controls').hide();

    // Clear timer if exists (prevent calling multiple times)
    if(Drawer.loading_timer) {
      clearTimeout(Drawer.loading_timer);
    }

    // Set timer with real function
    Drawer.loading_timer = setTimeout(function() {

      let ajax_object = {
        url         : options.url,
        type        : 'LOAD', // Send as LOAD METHOD so POST and PUT can be used for saving
        data        : JSON.stringify(options.data),
        dataType    : 'json',
        contentType : 'application/json; charset=UTF-8',
        async       : false,
        success     : function(payload) {

          Drawer.loading = false;

          if(is_empty(payload.error) == false) {

            // Show error outside drawer
            NotifyToast.show(
              payload.error,
              'error',
              'Drawer Error'
            );

            // Force close drawer
            Drawer.close(true);

          }
          else {

            // Display drawer content
            Drawer.update(payload.html, options);

            // Reshow controls
            $('#attoya-drawer .ui-resizable-controls').fadeIn(100).show();

          }

        },
        error : function(xhr, textStatus, error) {

          // Force close on hard error
          Drawer.loading = false;
          Drawer.close(true);

          // Run fail callback
          if(is_function(options.fail)) {
            options.fail();
          }

          // Get toast errors
          let toast_error = 'Unable to load drawer.';
          if(is_empty(xhr?.requestJSON?.toast) == false) {
            toast_error = xhr.requestJSON.toast
          }

          // Show toast error
          NotifyToast.show(
            toast_error,
            'error',
            'Drawer'
          );

        },
      };


      // Run jQuery AJAX @refactor to AttoyaComponent
      $.ajax(ajax_object);

    }, 1);

  }




  /**
   * Dialog Show
   * @param {string} content (required) | HTML of the drawer template
   * @param {json} options (required)
   *  - @param {string} origin (required) Class of wrapper for the `origin` wrapper (this case CodeExample event wrapper)
   *  - @param {json} attr (optional) data or aria Attributes to be added to drawer for use in drawer events/actions
   *  - @param {array} focus (optional) is an array of elements that can be clicked and keep the focus on drawer usage.
   *    - For example, any element click on the div id="companyInfo" will not close the drawer.
   *    - Anything other than the elements you supply, and the drawer itself, will close the drawer.
   *    - The specified items are based on the "parent" so any text fields within a div are considered
   *    - part of the `keep focus` elements
   *  - @param {element} slideTo (optional) element to slide to, giving room for drawer
   *  - @param {integer} height (optional) force height in pixels
   *  - @param {function} blur (optional) is a callback function to be called when focus is lost on Drawer
   *  - @param {function} completed (optional) is a callback function to be called after Drawer is setup
   */
  static show(content, options) {

    if(is_empty(content) == true) {
      AttoyaConsole.debug('Drawer.show()', 'Empty content')
      return false;
    }

    // Update if visible
    if(Drawer.visible === true) {
      AttoyaConsole.debug('Drawer.show()', 'Already visible');
      Drawer.update(content, options);
      return false;
    }

    Drawer.visible = true;
    Drawer.rescale();


    // Create HTML Element
    $('body').append(`
      <drawer id="drawer"
        data-origin="` + default_empty(options.origin, '') + `"
        data-is_dirty="false"
        style="display:none;"
        >

        <container id="drawer-container">
          <div id="drawer-scroller" class="content-scroll">` + content + `</div>
        </container>

      </drawer>
    `);

    // Add hight tracking
    if($('body #attoya-drawer-scroller-height').length == 0) {
      $('body').append( '<div id="drawer-scroller-height"></div>' );
    }


    // Add any data attributes
    add_attributes('#attoya-drawer', options.data_attr);


    // Control Items
    var controls = `
      <i class="control-restore far fa-window-restore" title="Restore"></i>
      <i class="control-maximize far fa-window-maximize" title="Maximize"></i>
      <i class="control-close far fa-close" title="Close"></i>
    `

    // Drawer Effects
    $('#attoya-drawer').resizableBottomPanel(extend_object(options, {
      controls    : controls,
      innerResize : '#attoya-drawer-scroller',
    }));


    // Slide To to prevent overlapping
    if(is_empty(options.slideTo) == false) {

      // Get/Calc Positions
      var scroll_top  = $(window).scrollTop();
      var element_top = parse_int($(options.slideTo).offset().top);
      var height      = get_cookie('drawer-height');

      if(is_empty_int(height)) {
        height = 600; // 600px default
      }

      var visible_height = parse_int(window.innerHeight - height);
      var drawerTop     = parse_int(scroll_top + visible_height);

      // Store scroll top when loading resizing stops
      set_cookie('ui-drawer-original-scroll-top', scroll_top, 30);

      // Is drawer covering element, then shift
      if(drawerTop < (element_top + 100)) {

        $('#attoya-drawer-scroller-height').css('height', height);

        var overlap = parse_int(element_top - drawerTop);
        $('html,body').animate({
          scrollTop : parse_int(scroll_top + overlap) + 100
        }, {
          duration  : 'fast',
          queue     : false,
        });

      }
    }

    // Resize Callback
    options.resize = function(self, event, ui) {

      // Make maximize enabled the on resize
      $('#attoya-drawer .control-restore').hide();
      $('#attoya-drawer .control-maximize').show();

    }

    // Callback function after setup is completed
    if(is_function(options.completed)) {
      options.completed();
    }

  }




  /**
   * Update Drawer Dialog Display
   * @param {json} data
   */
  static update(content, options) {

    // Check if drawer is dirty. Exit if true.
    if(Drawer.is_dirty(true) == true) {
      AttoyaConsole.debug('Drawer.update()', 'Is Dirty');
      return false;
    }

    // Update any data attributes
    add_attributes('#attoya-drawer', options.data_attr);

    // Update html content
    $('#attoya-drawer-container').html(`<div id="drawer-scroller" class="content-scroll">${content}</div>`);

    // Focus Handling Update
    Drawer.set_focus(options);

    // Calc height given with offset for grab bar
    var height = (parse_int($('#attoya-drawer').css('height')) - 25);
    if(height < 20) {
      height = 20;
    }

    $('#attoya-drawer-scroller').css('height', height + 'px');

  }




  /**
   * Set Focus bind elements on Drawer
   * @param {type} options
   *  - @param {json} focus (optional) is an array of elements that can be clicked and keep the focus on drawer usage.
   *    - For example, any element click on the div id="companyInfo" will not close the drawer.
   *    - Anything other than the elements you supply, and the drawer itself, will close the drawer.
   *    - The specified items are based on the "parent" so any text fields within a div are considiered
   *    - part of the `keep focus` elements
   *  - @param {function} blur (optional) is a callback function to be called when focus is lost on Drawer
   */
  static set_focus(options) {

    var focus = array_push(options.focus, [
      '#attoya-drawer',
      '.ui-autocomplete',
      '#[id*="monthpicker_"]',
    ]);

    // Focus Handling
    $('body').bindFocusElements(focus, function(selected) {

      // No appropriate selection found, close drawer
      if(selected == false) {

        Drawer.close();

        // Callback function for losing focus
        if(typeof (options.blur) === 'function') {
          options.blur();
        }

      }

    });

  }




  /**
   * Dialog
   * @param object options
   * - @param string message
   * - @param object buttons
   *   - @param function Button action function called on click.
   *     - Key is the string name for the button.
   *     - Return true to close drawer, false to keep open.
   */
  static dialog(options) {

    // Clear any previous dialogs
    Drawer.dialog_options = {};
    $('#attoya-drawer-dialog').remove();


    // Set Options
    options = default_empty_object(options, {
      message : null,
      buttons : null,
      class   : null,
    });

    // Add ok if no other buttons exist
    if(is_empty(options.buttons) == true) {
      options.buttons = {
        'Ok' : function() {
          return false;
        },
      }
    }

    // Store options for click checking
    Drawer.dialog_options = options;


    // Build buttons
    var buttons = '';
    $.each(options.buttons, function(name, button) {

      buttons += `<span class="button tiny control dialog" data-type="${name}">${name}</span> `;

    });


    // Build dialog - @note `<dialog>` tags are overridden by 3rd party css.
    var dialog = `
      <container id="drawer-dialog" class="large-12 columns ${options.class}">
        <div class="buttons">${buttons}</div>
        <div class="message">${options.message}</div>
      </container>
    `;


    // Add dialog to display
    $(dialog).prependTo('#attoya-drawer-content');


    // Show Dialog
    $('#attoya-drawer-dialog').show();

  }




  /**
   * Check if Drawer is dirty (unsaved changes)
   * @param {bool} show_dialog If drawer is dirty
   * @return {bool} If drawer is dirty or not
   */
  static is_dirty(show_dialog = true) {

    var is_dirty = false;

    // Check if drawer is marked as dirty
    if($('#attoya-drawer').attr('data-is_dirty') == 'true' || $('#attoya-drawer').find('.form').attr('data-is_dirty') == 'true') {
      is_dirty = true;
    }

    // Show is dirty confirmation
    if(is_dirty == true && show_dialog == true) {

      Drawer.dialog({
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
   * Clear Dirty Flag
   */
  static clear_dirty() {

    $('#attoya-drawer').attr('data-is_dirty', 'false');
    $('#attoya-drawer').find('.form').attr('data-is_dirty', 'false');

  }




  /**
   * Get Data Attribute
   */
   static getDataAttr = function(attribute) {

    if(Drawer.visible === false) {
      return false;
    }

    // Does attribute exist? (use attr() vs data(), causes bugs)
    if(typeof $('#attoya-drawer').attr('data-' + attribute) === 'undefined') {
      return false;
    }

    return $('#attoya-drawer').attr('data-' + attribute);

  };




  /**
   * Notify - Override to show notice on drawer as dialog
   */
  notify(options) {

    options = default_empty_object(options, {
      message : null,
      buttons : null,
    });

    Drawer.dialog(options);

  }




  /**
   * Get Data Attribute from Drawer
   * @param {json} data
   */
  static data(key, value) {

    if(Drawer.visible === false) {
      return false;
    }

    if(typeof value === 'undefined') {
      return $('#attoya-drawer').attr('data-' + key);
    }
    else {
      return $('#attoya-drawer').attr('data-' + key, value);
    }

  }




  /**
   * Modal Open
   * Used to stop scrolling on page for modal
   */
  static modalOpen() {

    // Disable scrolling when modal is open
    $('body').addClass('modal-open');
    $('#attoya-drawer').addClass('modal-open');
    $('#attoya-drawer-scroller').addClass('modal-open');

  }




  /**
   * Modal Closed
   * Used to start scrolling on page after modal
   */
  static modalClosed() {

    // Enable scrolling when modal is closed
    $('body').removeClass('modal-open');
    $('#attoya-drawer').removeClass('modal-open');
    $('#attoya-drawer-scroller').removeClass('modal-open');

  }




}





