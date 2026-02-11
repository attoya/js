





class AttoyaShowView extends BaseView {




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

    // Initial load called as a reload. Use jQuery object to check length vs empty.
    if(this.find('.tabs-content .list').length > 0 && this.options.init_reload == true) {
      this.find('.tabs-content .list').trigger('reload');
    }

  }




  /**
   * Initializes Events
   */
  init_events() {

    super.init_events();

    this.add_events({

      // Triggers
      'reloadDetail'                              : 'reloadDetail',
      'reloadDetailInfo'                          : 'reloadDetailInfo',

      // Ajax Requests
      'reloadDetailSubmit.done'                   : 'reloadDetailComplete',
      'reloadDetailInfoSubmit.done'               : 'reloadDetailInfoComplete',

    });

  }



  /**
   * Initializes Requests
   */
  init_requests() {

    this.add_requests({
      'reloadDetailSubmit'                        : 'RELOAD',
      'reloadDetailInfoSubmit'                    : 'RELOAD',
    });

  }




  /**
   * Bind Menu Topbar Crud
   */
  bindMenuTopbarCrud() {

    let self = this;

    // Add Crud Menu Events
    componentAttoyaMenuTopbar.append_events({
      'click .new'     : function(event, target) {
        self.loadBlowoutNew(event, target);
      },
      'click .clone'   : function(event, target) {
        self.loadBlowoutClone(event, target);
      },
      'click .edit'    : function(event, target) {
        self.loadBlowoutEdit(event, target);
      },
      'click .archive' : function(event, target) {
        self.archive(event, target);
      },
      'click .discard' : function(event, target) {
        self.discard(event, target);
      },
    });

  }




  /**
   * Reload
   */
  reload(event, target) {

    // Reload Details
    this.trigger('reloadDetail');
    this.trigger('reloadDetailInfo');

    this.stop_event(event);

  }




  /**
   * Reload Details
   */
  reloadDetail(event, target) {

    let url = this.attr('data-url_detail');
    if(is_empty(url) == true) {
      this.console.warn(this.get_class_name(), 'No `data-url_detail` defined');
      this.stop_event(event);
      return;
    }

    let check_datetime = this.find('wrapper.detail').attr('check_datetime');
    if(has_datetime_passed(check_datetime) == false) {
      this.console.warn(this.get_class_name(), 'Reload stopped as `check_datetime` has not passed');
      return;
    }

    // Load options from details
    let options = this.find('wrapper.detail').attr('data-options');
    if(is_empty(options) == false) {
      options = JSON.parse(options);
    }

    this.find('wrapper.detail').addClass('ajax-loader');
    componentMenuTopbarAction.loaderShow();

    // Post Reload
    this.ajax('reloadDetailSubmit', url, {
      'options' : options,
    });

    this.stop_event(event);

  }




  /**
   * Reload Detail Complete
   */
  reloadDetailComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaShowView).reloadDetailComplete()', payload);

    this.find('wrapper.detail').replaceWith(payload.html);
    this.find('wrapper.detail').removeClass('ajax-loader');
    this.find('wrapper.detail').attr('check_datetime', get_datetime()); // Set timestamp for checking
    componentMenuTopbarAction.loaderHide();

    this.stop_event(event);

  }




  /**
   * Reload Detail Info Complete
   */
  reloadDetailInfo(event, target) {

    let url = this.attr('data-url_detail_info');
    if(is_empty(url) == true) {
      this.console.warn(this.get_class_name(), 'No `data-url_detail_info` defined');
      this.stop_event(event);
      return;
    }

    let check_datetime = this.find('wrapper.detail').attr('check_datetime');
    if(has_datetime_passed(check_datetime) == false) {
      this.console.warn(this.get_class_name(), 'Reload stopped as `check_datetime` has not passed');
      return;
    }

    // Load options from details table
    let options = this.find('wrapper.detail-info').attr('data-options');
    if(is_empty(options) == false) {
      options = JSON.parse(options);
    }

    this.find('wrapper.detail-info').addClass('ajax-loader');
    componentMenuTopbarAction.loaderShow();

    // Post Reload
    this.ajax('reloadDetailInfoSubmit', url, {
      'options' : options,
    });

    this.stop_event(event);

  }




  /**
   * Reload Tab Details Complete
   */
  reloadDetailInfoComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaShowView).reloadDetailInfoComplete()', payload);

    this.find('wrapper.detail-info').html(payload.html);
    this.find('wrapper.detail-info').removeClass('ajax-loader');
    this.find('wrapper.detail-info').attr('check_datetime', get_datetime()); // Set timestamp for checking
    componentMenuTopbarAction.loaderHide();

    this.stop_event(event);

  }




  /**
   * Save Complete from Blowout
   */
  saveComplete(event, payload, xhr, target) {

    this.console.ajax(this.get_class_name() + '(AttoyaShowView).saveComplete()', payload);

    // Redirect to show url
    if(is_empty(payload.meta.url_show) == false) {
      // Only redirect if not set url from set update blowout
      if(payload.meta.url_show.includes('item') != true && this.debug_redirect == false) {
        window.location = payload.meta.url_show;
      }
    }

    this.stop_event(event);

  }




}





