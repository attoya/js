





class AttoyaSheetComponent extends BaseComponent {




  /**
   * Constructor
   */
  constructor(options) {

    // Set Options
    options = default_empty_object(options, {
      origin      : '.page-view',
      init_lock   : true,
      init_reload : true,
    });

    super(options);

  }




  /**
   * Initializes Class
   */
  init() {

    super.init();

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
   * Archive Complete from Blowout
   */
  archiveCompleteBlowout(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaSheetComponent).archiveCompleteBlowout()', payload);

    this.reload(event, target);

  }




  /**
   * Discard Complete from Blowout
   */
  discardCompleteBlowout(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaSheetComponent).discardCompleteBlowout()', payload);

    this.reload(event, target);

  }




  /**
   * Save Complete
   */
  saveComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaSheetComponent).saveComplete()', payload);

    // If on an index view, navigate to the new entity
    if($('.page-view').attr('data-view_type') == 'index') {

      // Redirect to show url
      if(is_empty(payload.meta.url_show) == false && this.debug_redirect == false) {
        window.location = payload.meta.url_show;
      }

      this.stop_event(event);

    }
    else {
      this.reload(event, target);
    }


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




}





