




// @refactor into AttoyaBaseComponent to avoid Mixin Problems
class AttoyaForm extends AttoyaComponent {




  /**
   * Constructor
   */
  constructor(options) {

    // Set Options
    options = default_empty_object(options, {
      wizard            : false,
      changelog         : false,
      changelog_default : null,
      local_storage     : false,
      prompt_leaving    : false,
      inactive_timeout  : 60000 * 10, // 10 minutes,
    });

    super(options);

  }




  /**
   * Initializes Class
   */
  init() {

    super.init();

    this.form        = this.wrapper.find('.form');
    this.form_prefix = default_empty(this.form.attr('data-form_prefix'), 'blank');
    let form_new     = parse_bool(this.form.attr('data-form_new'));

    // Form Options
    this.form_options = null;
    let form_options  = this.form.attr('data-options');
    if(is_empty(form_options) == false) {
      this.form_options = JSON.parse(form_options);
    }

    this.resetInactiveTimer(); // Start inactive timer

    this.init_form(form_new);

  }




  /**
   * Initialize Form
   */
  init_form(is_new = false) {

    let self    = this;
    this.is_new = is_new;

    // Create Form Wizard
    if(self.options.wizard == true) {
      self.wizard = new Wizard({
        wrapper : $(this.form),
        origin  : this.wrapper,
      });
    }

    // Initialise all inputs
    self.form.find(':input:not(.button)').each(function() {

      // Generate key
      let key = self.form_prefix + '-' + $(this).attr('class');
      $(this).attr('key', key);

    });

    // Bind Form Change
    self.init_dirty(self.form, self.options.prompt_leaving);

  }




  /**
   * Initializes Private Events
   */
  _init_events() {

    super._init_events();

    // @note Make sure general events are unique and to not trigger events from other classes
    this.add_events({

      // Toggles

      // Actions
      'click .form-controls .save'               : 'save',
      'click .form-controls .cancel'             : 'cancel',
      'change .form :input'                      : 'changeInput',
      'keyup .form #id_ref'                      : 'fieldRefUpdate',

      // Triggers
      'focusout .form :input'                    : 'validate',

      // Ajax Requests

    });


    // Wizard Events
    if(this.options.wizard == true) {

      this.add_events({

        'Wizard:save'                                   : 'save'

      });

    }

  }




  /**
   * Initializes Private Requests
   */
  _init_requests() {

    super._init_requests();

    this.add_requests({
      'validateSubmit' : 'FORMDATA',
      'saveSubmit'     : 'FORMDATA',
    });

  }




  /**
   * Check if form is dirty (unsaved changes)
   * @param {bool} show_dialog If form is dirty
   * @return {bool} If form is dirty or not
   */
  isFormDirty(show_dialog = true) {

    let is_dirty = false;

    // Check if blowout is marked as dirty
    if(this.form.attr('data-is_dirty') == 'true') {
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
   * Clear Dirty Form Flag
   */
  clearFormDirty() {

    this.form.attr('data-is_dirty', 'false');

  }




  /**
   * Field Ref Update
   */
  fieldRefUpdate(event, target) {

    let val = target.val();

    // Ref should always be uppercase
    val = val.toUpperCase();

    // Use underscores for spaces
    val = val.replace(/ /g,"_");

    target.val(val);

    this.stop_event(event);

  }




  /**
   * Change Input
   */
  changeInput(event, target) {

    this.clearError(event, target);

    // Exit if local storage not enabled
    if(this.options.local_storage == false) {
      return;
    }

    // Set local storage if key assigned
    if(is_empty(target.attr('key')) == false) {
      this.setLocalStorage(target);
    }

  }




  /**
   * Set Local Storage
   */
  enableLocalStorage(element) {

    if(is_empty(element) == true) {
      return;
    }

    // Mark Enabled
    element.attr('data_local-storage', true);

    // Set initial value if set
    element.val( this.getLocalStorage(element) );

  }




  /**
   * Set Local Storage
   */
  setLocalStorage(element) {

    if(is_empty(element) == true) {
      return;
    }

    let now     = new Date();
    let key     = $(element).attr('key');
    let enabled = parse_bool($(element).attr('data_local-storage'));

    if(enabled == false) {
      this.console.warn(this.get_class_name() + '(AttoyaForm).setLocalStorage() Local Storage not enabled for element. Call enableLocalStorage() from your form_init()', element);
      return null;
    }

    if(is_empty(key) == true) {
      this.console.warn(this.get_class_name() + '(AttoyaForm).setLocalStorage() No `key` attibute defined for element.', element);
      return null;
    }

    // Store object with value and expire
    let item = {
      'value'  : $(element).val(),
      'expire' : now.getTime() + (60000 * 60 * 2), // 2 Hours
    };

    localStorage.setItem(key, JSON.stringify(item));

  }




  /**
   * Get Local Storage
   */
  getLocalStorage(element) {

    if(is_empty(element) == true) {
      return;
    }

    let now     = new Date();
    let key     = $(element).attr('key');
    let enabled = parse_bool($(element).attr('data_local-storage'));

    if(enabled == false) {
      this.console.warn(this.get_class_name() + '(AttoyaForm).getLocalStorage() Local Storage not enabled for element. Call enableLocalStorage() from your form_init()', element);
      return null;
    }

    if(is_empty(key) == true) {
      this.console.warn(this.get_class_name() + '(AttoyaForm).getLocalStorage() No `key` attibute defined for element.', element);
      return null;
    }

    // Check if item is set first before parsing
    let item = localStorage.getItem(key);
    if(is_empty(item) == true) {
      return null;
    }

    // Extract value and expire
    item = JSON.parse(item);

    // Purge old local storage that isn't an object
    if(typeof(item) != 'object') {
      localStorage.removeItem(key)
      return null;
    }

    // Check if has passed expiration, if so delete
    if(now.getTime() > item.expire) {
      localStorage.removeItem(key)
      return null;
    }

    return item.value;

  }




  /**
   * Archived
   */
  archiveComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaForm).archiveComplete()', payload);

    componentMenuTopbarAction.loaderHide();

    // Redirect to returned link
    if(is_empty(payload.href) == false && this.debug_redirect == false) {
      window.location = payload.href;
    }

    this.stop_event(event);

  }




  /**
   * Discarded
   */
  discardComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaForm).discardComplete()', payload);

    componentMenuTopbarAction.loaderHide();

    // Redirect to returned link
    if(is_empty(payload.href) == false && this.debug_redirect == false) {
      window.location = payload.href;
    }
    else {
      super.discardComplete(event, payload, xhr, target);
    }

    this.stop_event(event);

  }




  /**
   * Validate
   */
  validate(event, target) {

    let url = this.form.attr('data-url_save');
    if(is_empty(url) == true) {

      this.console.warn(this.get_class_name(), 'No `data-url_save` defined on form ' + this.get_class_name());

      this.showToast({
        message : 'An error occurred while trying to validate your form.'
      });

      this.stop_event(event);

      return false;

    }

    // Serialize a div based form
    let payload = extend_object(this.serialize_form(this.form), {
      'meta' : { // @future
        'prefix' : this.form_prefix,
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

    this.stop_event(event);

  }




  /**
   * Validate
   */
  validateComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaForm).validateComplete()', payload);

    // Only Show Error if success is false
    if(payload.success == false) {

      this.showErrors(payload.errors);

    }

    this.stop_event(event);

  }




  /**
   * Save
   */
  save(event, target) {

    let self = this;


    // Request Changelog
    if(self.options.changelog == true) {

      let changelog_default = default_empty;

      if($('.model_id').isEmpty()) {
        changelog_default = this.options.changelog_default;
      }

      // Get changelog before we submit
      self.showChangelogDialog(function(changelog) {

        if(is_empty(changelog) == false && changelog !== false) {
          self.wrapper.find('.changelog').val(changelog);
          // @future Refactor and call save function here
        }

      }, changelog_default);

    }


    // Disable button to prevent double click
    if(this.options.wizard == true) {
      // Wizard buttons
      self.find('button.save').addClass('disabled');
    }
    else {
      // Form Controls
      this.find('.form-controls button').addClass('disabled');
    }


    let url = this.form.attr('data-url_save');
    if(is_empty(url) == true) {

      this.console.warn(this.get_class_name(), 'No `data-url_save` defined on form ' + this.get_class_name());

      this.showToast({
        message : 'An error occurred while trying to save your form.',
      });

      this.stop_event(event);

      return false;

    }

    // Serialize a div based form
    let payload = extend_object(this.serialize_form(this.form), {
      'meta' : { // @future
        'prefix' : this.form_prefix,
      },
    });

    this.ajax('saveSubmit', url, payload);

    this.stop_event(event);

  }




  /**
   * Save Complete
   */
  saveComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaForm).saveComplete()', payload);

    // Goto show page if saved
    if(payload.success == true) {

      // Redirect to show url if provided
      if(is_empty(payload.url) == false && this.debug_redirect == false) {
        window.location = payload.url;
      }

    }
    else {

      // Enable buttons
      if(this.options.wizard == true) {
        // Wizard buttons
        this.find('button.save').removeClass('disabled');
      }
      else {
        // Form Controls
        this.find('.form-controls button').removeClass('disabled');
      }

      this.showErrors(payload.errors);

    }

    this.stop_event(event);

  }




  /**
   * Cancel
   */
  cancel(event, target) {

    let url = this.form.attr('data-url_cancel');

    if(is_empty(url) == true) {
      this.console.warn(this.get_class_name(), 'No `data-url_cancel` defined on form ' + this.get_class_name());
      this.stop_event(event);
      return false;
    }

    // Redirect to cancel url
    if(this.debug_redirect == false) {
      window.location = url;
    }

    this.stop_event(event);

  }




  /**
   * Show Errors
   */
  showErrors(errors) {

    let self = this;

    // Add error highlighting and set error as title
    $.each(errors, function(key, error) {

      self.showError(key, error);

    })

    this.stop_event(event);

  }




  /**
   * Show Error
   */
  showError(key, error) {

    let self = this;

    self.console.debug(self.get_class_name() + '.showErrors', key + ': ' + error);

    if(key == 'save') {

      self.showToast({
        message : 'An unknown error occured while saving. Please check your details are correct.',
      });

    }
    else {
      let targetElement       = self.form.find('#id_' + key);
      const errorForwardClass = targetElement.attr('data-error_forward_class');

      if(is_set(errorForwardClass) == true) {
        targetElement = self.form.find(`.${errorForwardClass}`);
      }

      targetElement.addClass('error').attr('title', error);
    }

  }




  /**
   * Show Changelog Dialog
   */
  showChangelogDialog(callback, changelog_default) {

    // Assign Default Value if set
    if(is_empty(changelog_default) == false) {
      $('.form_changelog_dialog .changelog_text').val(changelog_default);
    }

    let changelog_dialog = $('.form_changelog_dialog');
    if(is_function(callback) == false) {
      this.console.error(this.get_class_name(), 'Required callback function in `showChangelogDialog()`');
      return false;
    }

    Dialog.Build(changelog_dialog, {
      title   : 'Changelog',
      width   : 500,
      buttons : {
        'Cancel': function () {

          callback(false);

        },
        'Save': function () {

          // Make sure to trim value. Users entering a blank space or short text to get around adding a message.
          let changelog = changelog_dialog.find('.changelog_text').val().trim();

          if(is_empty(changelog) == true || changelog.length <= 10) {
            Dialog.OK('Invalid Changelog', 'Please enter a relevant changelog description on what changes were made.');
            return false;
          }
          else {
            callback(changelog);
          }

        }
      }
    });

  }




}





