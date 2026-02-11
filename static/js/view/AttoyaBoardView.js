





class AttoyaBoardView extends BaseView {




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

    // Set Board
    this.board = this.find('.board');

    // Set Load Selector
    this.load_selector = '.board-item';

  }




  /**
   * Reload Complete
   */
  reloadComplete(event, payload, xhr, target, callback) {

    this.console.ajax(this.get_class_name() + '(AttoyaBoardView).reloadComplete()', payload);

    // Reload Content
    this.find('.board').replaceWith(payload.html);

    // Run callback
    if(is_function(callback) == true) {
      callback();
    }

    componentMenuTopbarAction.loaderHide();

    this.stop_event(event);

  }




}





