





class AttoyaInlineFieldForm extends PlainComponent {




  /**
   * Init
   */
  init() {

    super.init();

    // Set original value for cancel button to reset
    this.find('.field').attr('data-original', this.find('.field').val() );

  }




  /**
   * Initializes Events
   */
  init_events() {

    super.init_events();

    this.add_events({

      // Toggles
      'mouseover .display'                       : 'showControls',
      'mouseout .display'                        : 'hideControls',
      'dblclick .display'                        : 'toggleForm',
      'click .display .edit'                     : 'toggleForm',

      // Actions
      'keyup .form .field'                       : 'keyup', // Calls save() on Ctrl + Enter and cancel() on Escape
      'click .form .save'                        : 'save',
      'click .form .cancel'                      : 'cancel',
      'change .form .field'                      : 'clearError',

    });

  }




  /**
   * Initializes Requests
   */
  init_requests() {

    super.init_requests();

    this.add_requests({
      'saveSubmit' : 'POST',
    });

  }




  /**
   * Show Controls
   */
  showControls(event, target) {

    target.find('.edit:not(.disabled)').css('opacity', 1);

    this.stop_event(event);

  }




  /**
   * Hide Controls
   */
  hideControls(event, target) {

    target.find('.edit:not(.disabled)').css('opacity', 0);

    this.stop_event(event);

  }




  /**
   * Toggle Form
   */
  toggleForm(event, target) {

    // Exit if readonly
    if(this.attr('data-is_readonly') == 'true') {
      this.stop_event(event);
      return;
    }

    // Select this inline-field
    let element = target.closest('.inline-field');

    // Exit if disabled
    if(element.find('.display').hasClass('disabled') == true) {
      this.stop_event(event);
      return;
    }

    // If display is visible then show form
    if(element.find('.display').is(':visible') == true) {

      // Select this block display & form
      element.find('.display').hide();
      element.find('.form').show();

      // Set focus to input
      element.find('.form input').focus();

    }
    else {

      // Hide form and show display
      element.find('.form').hide();
      element.find('.display').show();

    }

    this.stop_event(event);

  }




  /**
   * Save
   */
  save(event, target) {

    let element = $(event.currentTarget).closest('.inline-field'); // Use currentTarget due to keyup
    let form    = element.find('.form');
    let url     = element.attr('data-url_edit');

    componentAttoyaMenuTopbar.loaderShow();

    this.ajax('saveSubmit', url, {
      'model_id' : this.attr('data-model_id'),
      'value'    : form.find('.field').val(),
    });

    form.find('.field').addClass('disabled');
    form.find('.save').addClass('disabled');
    form.find('.cancel').addClass('disabled');

  }




  /**
   * Save Complete
   */
  saveComplete(event, payload, xhr, target) {

    let element = $(event.currentTarget).closest('.inline-field');
    let form    = element.find('.form');

    componentAttoyaMenuTopbar.loaderHide();

    // If the save was not completed, show error to user
    if(payload.success == false) {
      this.handleError(payload);
    }

    // Enable elements
    form.find('.field').removeClass('disabled');
    form.find('.save').removeClass('disabled');
    form.find('.cancel').removeClass('disabled');

    // Exit form
    if(payload.success == true) {
      element.find('.display').show();
      element.find('.form').hide();
    }
    else {
      // If the save was not completed, show error to user
      this.handleError(event, payload);
    }

    // Update returned value
    element.find('.content').html(payload?.value);
    form.find('.field').val(payload?.value);
    form.find('.field').attr('data-original', payload?.value);

    super.saveComplete(event, payload, xhr, target);

    this.stop_event(event);

  }




  /**
   * Save Error
   */
  saveError(event, payload, xhr, target) {

    componentAttoyaMenuTopbar.loaderHide();

    // If the save was not completed, show error to user
    this.handleError(event, payload);

  }




  /**
   * Cancel
   */
  cancel(event, target) {

    // Select this block
    var element = target.closest('.inline-field');

    element.find('.display').show();
    element.find('.form').hide();

    // Reset to original content
    let field = element.find('.form .field');
    if(is_empty(field.attr('data-original')) == false) {
      field.val(field.attr('data-original'));
    }
    else {
      field.val('');
    }

    this.stop_event(event);

  }




  /**
   * Handle Error
   */
  handleError(event, payload) {

    this.console.ajax(this.get_class_name() + '(AttoyaInlineFieldForm).handleError()', payload);

    let element = $(event.currentTarget).closest('.inline-field');

    if(is_set(payload?.errors) == true) {
      // Show the first error as this is a single field
      element.find('.field').addClass('error').attr('title', payload.errors[0]);
    }
    else {
      element.find('.field').removeClass('error').attr('title', '');
    }

    // Enable elements
    form.find('.field').removeClass('disabled');
    form.find('.save').removeClass('disabled');
    form.find('.cancel').removeClass('disabled');

    this.stop_event(event);

  }




}





