





class AttoyaIndexView extends AttoyaListView {




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

    this.console.ajax(this.get_class_name() + '(AttoyaListView).saveComplete()', payload);

    // Redirect to show url
    if(is_empty(payload.meta.url_show) == false && this.debug_redirect == false) {
      window.location = payload.meta.url_show;
    }

    this.stop_event(event);

  }





}





