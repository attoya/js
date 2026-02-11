

// Global to allow access by any class
var componentAttoyaMenuTopbar = null;






class AttoyaMenuTopbar extends PlainComponent {




  /**
   * Constructor
   */
  constructor(options) {

    // Set Options
    options = default_empty_object(options, {
      wrapper : $('.menu-topbar'),
      origin  : $('.menu-topbar'),
      prefix  : 'topbar_',
    });

    super(options);

  }




}





