





class AttoyaMenuSidebar extends PlainComponent {




  /**
   * Constructor
   */
  constructor(options) {

    // Set Options
    options = default_empty_object(options, {
      wrapper      : $('.menu-sidebar'),
      origin       : $('body'),
      init_lock    : false, // We don't want to trigger a lock on the body
      accordionize : true,
      speed        : 300,
      toggle_sign  : "<b class='fas fa-circle'></b>",
    });

    super(options);

  }




  /**
   * Initializes Class
   */
  init() {

    super.init();

    let self = this;


    // Open active level
    self.wrapper.find('li.active').each(function() {

      $(this).find('ul:first').slideDown(self.speed, function() {
        $(this).parent('li').find('h4:first').delay(self.speed).html(self.toggle_sign);
      });

    });


    this.init_app_menus();

  }




  /**
   * Initializes App Menus
   */
  init_app_menus() {

  }




  /**
   * Initializes Events
   */
  init_events() {

    super.init_events();

    this.add_events({

      // General
      'click .menu-item a'      : 'toggleSubmenu',
      'click .submenu-item a'   : 'clickSubmenu',
      'mouseover .submenu-item' : 'toggleSubmenuActions',
      'mouseout .submenu-item'  : 'toggleSubmenuActions',

    });

  }




  /**
   * Toggle Submenu
   */
  toggleSubmenu(event, target) {

    let self = this
    var line = target;

    // Avoid jumping to the top of the page when the href is an #
    if(target.attr('href') == '#') {
      event.preventDefault();
    }


    // Exit if no parent
    if(line.parent().find('ul').size() == 0) {
      return;
    }


    // Close other visible submens that is not the focus
    if(!line.parent().find('ul').is(':visible')) {

      var parents = line.parent().parents('ul');
      var visible = self.wrapper.find('ul:visible');

      visible.each(function(visibleIndex) {

        var close = true;
        parents.each(function(parentIndex) {
          if(parents[parentIndex] == visible[visibleIndex]) {
            close = false;
            return false;
          }
        });

        if(close == true) {
          if(line.parent().find('ul') != visible[visibleIndex]) {
            $(visible[visibleIndex]).slideUp(self.options.speed, function() {
              line.parent('li').find('h4:first').html(self.options.toggle_sign);
            });
          }
        }

      });

    }


    // Toggle submenu in focus
    if(line.parent().find('ul:first').is(':visible')) {

      line.parent().find('ul:first').slideUp(self.options.speed, function() {
        $(this).parent('li').find('h4:first').delay(self.options.speed).html(self.options.toggle_sign);
      });

    }
    else {

      line.parent().find('ul:first').slideDown(self.options.speed, function() {
        $(this).parent('li').find('h4:first').delay(self.options.speed).html(self.options.toggle_sign);
      });

    }

  }




  /**
   * Click Submenu
   */
  clickSubmenu(event, target) {

    // Menu Item is up 3 levels
    let item = target.parent().parent().parent();

    // Exit if menu item is connetion.
    // Handle events in Extended Sidebar
    // if(item.hasClass('example')) {
    //   return;
    // }

    // Avoid jumping to the top of the page when the href is an #
    if(target.attr('href') == '#') {
      event.preventDefault();
    }

  }




  /**
   * Show / hide action icons on hover
   */
  toggleSubmenuActions(event, target) {

    target.find('.noft-action').toggle();

  }




}



