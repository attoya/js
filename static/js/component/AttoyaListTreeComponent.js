





class AttoyaListTreeComponent extends AttoyaListComponent {




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

  }




  /**
   * Initializes Private Events
   */
  _init_events() {

    super._init_events();

    // @note Make sure general events are unique and to not trigger events from other classes
    this.add_events({

      // Toggles
      'click .collapser' : 'collapseTreeNode',

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
    target.find('.control.detail-tree:not(.disabled)').css('opacity', 1);

    this.stop_event(event);

  }




  /**
   * Hide Controls
   */
  hideControls(event, target) {

    target.find('.control.edit:not(.disabled)').css('opacity', 0);
    target.find('.control.detail-info:not(.disabled)').css('opacity', 0);
    target.find('.control.detail-tree:not(.disabled)').css('opacity', 0);

    this.stop_event(event);

  }



  /**
   * Collapse Tree Node
   */
  collapseTreeNode(event, target) {

    const tree_node    = $(target).closest('.trigger-point-map-item');
    const node_level   = parseInt(tree_node.attr('data-level'));
    const child_index  = tree_node.parent().children().index(tree_node);
    const is_collapsed = tree_node.hasClass('collapsed');

    tree_node.toggleClass('collapsed');

    const siblings = tree_node.parent().children();

    for(let i = child_index + 1 ; i < siblings.length ; i++) {
      const sibling      = $(siblings[i]);
      const siblingLevel = parseInt(sibling.attr('data-level'));

      if(siblingLevel <= node_level) {
        return;
      }

      if(is_collapsed == true) {
        sibling.css('visibility', '');
      }
      else {
        sibling.css('visibility', 'collapse');
      }
    }

  }




}





