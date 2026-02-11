





class AttoyaShowItemView extends AttoyaShowView {




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
   * Save Complete from Blowout
   */
  saveComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaShowItemView).saveComplete()', payload);

    // Redirect to show url
    if(is_empty(payload.meta.url_show) == false) {
      // Only redirect if not set url from set update blowout
      if(payload.meta.url_show.includes('item') == true && this.debug_redirect == false) {
        window.location = payload.meta.url_show;
      }
    }

    this.stop_event(event);

  }




}





