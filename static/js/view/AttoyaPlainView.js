





class AttoyaPlainView extends BaseView {




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




}





