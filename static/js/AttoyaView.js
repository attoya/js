

/**
 * Attoya JS View
 * @copyright (c) 2024-present APSF LLC dba Attoya and contributors
 * @license MIT
 * @version v2.0.0
 */
class AttoyaView extends AttoyaComponent {




  /**
   * Constructor
   * @note The following is the defaults that must be set in be View Type JS Class
   */
  // constructor(options) {
  //
  //   // Set Options
  //   options = default_empty_object(options, {
  //     wrapper     : $('.page-view'),
  //     init_reload : true,
  //   });
  //
  //   super(options);
  //
  // }




  /**
   * Initializes Class
   */
  init() {

    super.init();

    // Set Filter
    this.filter = this.find('filter');

    // Initial load called as a reset. Use jQuery object to check length vs empty.
    if(this.find('filter').length > 0 && this.options.init_reload == true) {
      this.filterReset();
    }
    else {
      // Set defaults without reload
      this.filterDefault();
    }

    // Bind Menu Topbar
    this.bindMenuTopbarCrud();
    this.bindMenuTopbarAction();
    this.bindMenuTopbarRef();

  }




  /**
   * Initializes Private Events
   */
  _init_events() {

    super._init_events();

    // @note Make sure general events are unique and to not trigger events from other classes
    this.add_events({

      // Toggles

      // Actions
      'click filter .apply' : 'filterApply',
      'click filter .reset' : 'filterReset',

      // Triggers

      // Ajax Requests

    });

  }




  /**
   * Filter Apply
   */
  filterApply(event, target) {

    // @notice Need to override with a custom use case
    this.console.error('BaseView', 'Need to override filterApply() with a custom use case for ' + this.get_class_name());

  }




  /**
   * Filter Default
   */
  filterDefault() {

    this.filter.find('.search').val('');
    this.filter.find('.status-step-facet').val('1'); // On Hold
    this.filter.find('.subscriber-owner-facet').val( $('context').attr('user_id') );
    this.filter.find('.is-archived').val( this.filter.find('.is-archived').attr('default') );

  }




  /**
   * Filter Reset
   */
  filterReset(event, target) {

    this.filterDefault();
    this.filterApply();

  }




  /**
   * Bind Menu Topbar Crud
   */
  bindMenuTopbarCrud() {

  }




  /**
   * Bind Menu Topbar Action
   */
  bindMenuTopbarAction() {

  }




  /**
   * Bind Menu Topbar Ref
   */
  bindMenuTopbarRef() {

  }




  /**
   * Reload
   */
  reload(event, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaView).reload()', payload);

    componentMenuTopbarAction.loaderShow();

    this.stop_event(event);

  }




  /**
   * Reload Complete
   */
  reloadComplete(event, payload, xhr, target, callback) {

    this.console.ajax(this.get_class_name() + '(AttoyaView).reloadComplete()', payload);

    // Run callback
    if(is_function(callback) == true) {

      // Wait a before callback. This is to make sure the new content is loaded.
      setTimeout(function() {
        callback();
      }, 500);

    }

    componentMenuTopbarAction.loaderHide();

    this.stop_event(event);

  }




  /**
   * Lock View
   */
  lock(event, target) {

    // @notice we want archive to be a toggle. Don't disable for lock.
    super.lock(event, target);

    // @wip Add component propagation for when not an init trigger

    this.stop_event(event);

  }




  /**
   * Unlock View
   */
  unlock(event, target) {

    super.unlock(event, target);

    this.stop_event(event);

  }




}





