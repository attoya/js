





class AttoyaBoardComponent extends BaseComponent {




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
    this.load_selector = '.board-item';

  }




  /**
   * Initializes Private Events
   */
  _init_events() {

    super._init_events();

    // @note Make sure general events are unique and to not trigger events from other classes
    this.add_events({

      // Toggles
      'mouseover .board-item'                     : 'showControls',
      'mouseout .board-item'                      : 'hideControls',

      // Actions

      // Triggers

      // Ajax Requests

    });

  }




  /**
   * Show Controls
   */
  showControls(event, target) {

    target.find('.control:not(.disabled)').css('opacity', 1);

    this.stop_event(event);

  }




  /**
   * Hide Controls
   */
  hideControls(event, target) {

    target.find('.control:not(.disabled)').css('opacity', 0);

    this.stop_event(event);

  }




  /**
   * Archive Complete from Blowout
   */
  archiveCompleteBlowout(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaBoardComponent).archiveCompleteBlowout()', payload);

    this.reload(event, target);

  }




  /**
   * Discard Complete from Blowout
   */
  discardCompleteBlowout(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaBoardComponent).discardCompleteBlowout()', payload);

    this.reload(event, target);

  }




  /**
   * Save Complete
   */
  saveComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaBoardComponent).saveComplete()', payload);

    // If on an index view, navigate to the new entity
    if($('.page-view').attr('data-view_type') == 'index') {

      // Redirect to url_show for only new entities not edits for index views.
      // We want to remain on the same index page if we are editing multiple entities.
      if(payload.meta.is_new == true && is_empty(payload.meta.url_show) == false && this.debug_redirect == false) {
        window.location = payload.meta.url_show;
      }
      else {
        // If not new then reload list
        this.reload(event, target);
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

    let url = this.attr('data-url_board');
    if(is_empty(url) == true) {
      this.console.warn(this.get_class_name(), 'No `data-url_board` defined.');
      this.stop_event(event);



class BoardComponent extends BaseComponent {




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
    this.load_selector = '.board-item';

  }




  /**
   * Initializes Private Events
   */
  _init_events() {

    super._init_events();

    // @note Make sure general events are unique and to not trigger events from other classes
    this.add_events({

      // Toggles
      'mouseover .board-item'                     : 'showControls',
      'mouseout .board-item'                      : 'hideControls',

      // Actions

      // Triggers

      // Ajax Requests

    });

  }




  /**
   * Show Controls
   */
  showControls(event, target) {

    target.find('.control:not(.disabled)').css('opacity', 1);

    this.stop_event(event);

  }




  /**
   * Hide Controls
   */
  hideControls(event, target) {

    target.find('.control:not(.disabled)').css('opacity', 0);

    this.stop_event(event);

  }




  /**
   * Archive Complete from Blowout
   */
  archiveCompleteBlowout(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaBoardComponent).archiveCompleteBlowout()', payload);

    this.reload(event, target);

  }




  /**
   * Discard Complete from Blowout
   */
  discardCompleteBlowout(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaBoardComponent).discardCompleteBlowout()', payload);

    this.reload(event, target);

  }




  /**
   * Save Complete
   */
  saveComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaBoardComponent).saveComplete()', payload);

    // If on an index view, navigate to the new entity
    if($('.page-view').attr('data-view_type') == 'index') {

      // Redirect to url_show for only new entities not edits for index views.
      // We want to remain on the same index page if we are editing multiple entities.
      if(payload.meta.is_new == true && is_empty(payload.meta.url_show) == false && this.debug_redirect == false) {
        window.location = payload.meta.url_show;
      }
      else {
        // If not new then reload list
        this.reload(event, target);
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

    let url = this.attr('data-url_board');
    if(is_empty(url) == true) {
      this.console.warn(this.get_class_name(), 'No `data-url_board` defined.');
      this.stop_event(event);
      return;
    }

    let options = this.options;

    // Check if filter div is set, if not let options be used
    if(is_empty_jquery(this.filter) == false) {
      options.filter = this.getFilter();
    }

    // Mark as reloaded
    options.is_reload = true;

    this.add_class('ajax-loader');
    componentAttoyaMenuTopbar.loaderShow();

    // Post Reload
    this.ajax('reloadSubmit', url, {
      'model_id' : this.attr('data-model_id'),
      'options'  : options,
    });

    this.stop_event(event);

  }




}






      return;
    }

    let options = this.options;

    // Check if filter div is set, if not let options be used
    if(is_empty_jquery(this.filter) == false) {
      options.filter = this.getFilter();
    }

    // Mark as reloaded
    options.is_reload = true;

    this.add_class('ajax-loader');
    componentAttoyaMenuTopbar.loaderShow();

    // Post Reload
    this.ajax('reloadSubmit', url, {
      'model_id' : this.attr('data-model_id'),
      'options'  : options,
    });

    this.stop_event(event);

  }




}





