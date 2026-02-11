





class AttoyaSheetView extends BaseView {




  /**
   * Constructor
   */
  constructor(options) {

    // Set Options
    options = default_empty_object(options, {
      wrapper     : $('.page-view'),
      init_reload : true,
    });

    super(options);

  }




  /**
   * Initializes Class
   */
  init() {

    super.init();

    // Set Sheet
    this.sheet = this.find('.sheet');

    // Set Load Selector
    this.load_selector = '.sheet-item';

  }




  /**
   * Initializes Private Events
   */
  _init_events() {

    super._init_events();

    // @note Make sure general events are unique and to not trigger events from other classes
    this.add_events({

      // Toggles
      'mouseover tbody tr'                        : 'showControls',
      'mouseout tbody tr'                         : 'hideControls',

      // Actions

      // Triggers

      // Ajax Requests

    });

  }




  /**
   * Show Controls
   */
  showControls(event, target) {

    target.find('.control.edit:not(.disabled)').css('opacity', 1);
    target.find('.control.detail-info:not(.disabled)').css('opacity', 1);

    this.stop_event(event);

  }




  /**
   * Hide Controls
   */
  hideControls(event, target) {

    target.find('.control.edit:not(.disabled)').css('opacity', 0);
    target.find('.control.detail-info:not(.disabled)').css('opacity', 0);

    this.stop_event(event);

  }




  /**
   * Load Blowout New
   */
  loadBlowoutNew(event, target) {

    this.loadBlowout(null, {
      url      : this.sheet.attr('data-url_blowout_new'),
      url_attr : 'data-url_blowout_new',
      event    : event,
    });

    this.stop_event(event);

  }




  /**
   * Save Complete
   */
  saveComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaSheetView).saveComplete()', payload);

    this.reload();
    this.stop_event(event);

  }




  /**
   * Archived
   */
  archiveComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaSheetView).archiveComplete()', payload);

    componentMenuTopbarAction.loaderHide();

    this.reload();
    this.stop_event(event);

  }




  /**
   * Discarded
   */
  discardComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaSheetView).discardComplete()', payload);

    componentMenuTopbarAction.loaderHide();

    this.reload();
    this.stop_event(event);

  }




  /**
   * Reload
   */
  reload(event, target) {

    let url = this.attr('data-url_sheet');

    if(is_empty(url) == true) {
      this.console.warn(this.get_class_name(), 'No `data-url_sheet` defined.');
      this.stop_event(event);
      return;
    }

    let options = this.options;

    // Check if filter div is set, if not let options be used
    if(is_empty_jquery(this.filter) == false) {
      options.filter = this.getFilter();
    }

    this.add_class('ajax-loader');
    componentMenuTopbarAction.loaderShow();

    // Post Reload
    this.ajax('reloadSubmit', url, {
      'model_id' : this.attr('data-model_id'),
      'options'  : options,
    });

    this.stop_event(event);

  }




  /**
   * Reload Complete
   */
  reloadComplete(event, payload, xhr, target, callback) {

    this.console.ajax(this.get_class_name() + '(AttoyaSheetView).reloadComplete()', payload);

    // Reload Content
    this.sheet.replaceWith(payload.html);

    // Run callback
    if(is_function(callback) == true) {
      callback();
    }

    this.remove_class('ajax-loader');
    componentMenuTopbarAction.loaderHide();

    // Reinit sheet
    this.sheet = this.find('.sheet');

    this.stop_event(event);

  }




}





