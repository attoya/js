





class AttoyaTimelineComponent extends BaseComponent {




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

    let self = this;

    let options = this.attr('data-options');
    if(is_empty(options) == false) {
      this.options = JSON.parse(options);
    }

    // Add testing class for environment banner padding to be added
    if($('context').attr('environment') != 'prod') {
      self.add_class('testing');
    }

    let scale = this.attr('data-scale');
    if(is_empty(scale) == false) {

      this.scale = JSON.parse(scale);

      this.scale.range_start    = parse_int(this.scale.range_start);
      this.scale.range_end      = parse_int(this.scale.range_end);
      this.scale.range_current  = parse_int(this.scale.range_current);
      this.scale.range_width    = parse_int(this.scale.range_width);

      this.scale.period_start   = parse_int(this.scale.period_start);
      this.scale.period_end     = parse_int(this.scale.period_end);
      this.scale.period_current = parse_int(this.scale.period_current);

      this.scale.point_start    = parse_int(this.scale.point_start);
      this.scale.point_end      = parse_int(this.scale.point_end);
      this.scale.point_current  = parse_int(this.scale.point_current);
      this.scale.point_width    = parse_int(this.scale.point_width);
      this.scale.point_height   = parse_int(this.scale.point_height);

    }

    self.drawContent();
    self.drawRowHeights();
    self.drawRulers();
    self.stickyScale();

  }




  /**
   * Extend / define events and handlers
   */
  init_events() {

    super.init_events();

    this.add_events({

      // @future Blowout
      'Blowout:handleRowUpdate'                      : 'reload',
      'Blowout:handleRowArchive'                     : 'reload',
      'Blowout:handleRowDiscard'                     : 'reload',
      'Blowout:handlePointUpdate'                    : 'reload',
      'Blowout:handlePointArchive'                   : 'reload',
      'Blowout:handlePointDiscard'                   : 'reload',

      // Controls
      'click labels controls .screen-toggle'         : 'toggleScreenSize',
      'click labels controls .reload'                : 'reload',

      // Scale
      // 'click content scale period'                   : 'loadScaleBlowoutShow',

      // Labels
      // 'click labels rows row'                        : 'loadBlowoutShow',
      // 'click labels rows row.add'                    : 'loadLabelBlowoutNew',
      // 'click labels rows row.edit'                   : 'loadLabelBlowoutEdit',

      // Content
      // 'click content rows period point'              : 'loadBlowoutShow',
      'click content rows period point.add'          : 'loadPointBlowoutNew',
      'click content rows period point.edit'         : 'loadPointBlowoutEdit',

    });

  }




  /**
   * Initializes Requests
   * @returns {undefined}
   */
  init_requests() {

    super.init_requests();

    this.add_requests({
      'reloadSubmit' : 'RELOAD',
    });

  }




  /**
   * Sticky Scale
   */
  stickyScale() {

    let self = this;

    let top_offset = 0;
    if(self.has_class('testing') == true) {
      top_offset = 30;
    }

    // Bind sticky to window scroll
    window.document.body.onscroll = function() {

      // Only run if full display is disabled
      if(self.has_class('fulldisplay')) {
        return;
      }

      let scroll_top  = $(this).scrollTop();
      let content_top = self.find('content').offset().top;
      let scale_top   = 0;

      // Once we scroll past the date section, calc offset
      if(scroll_top > content_top) {
        scale_top = scroll_top - content_top + top_offset;
      }

      self.find('content scale').css('top', scale_top);

    };

  }




  /**
   * Draw Content
   */
  drawContent() {

    let self = this;

    // Create blank points
    self.find('content point').each(function() {

      let point_element = $(this);
      let create_blank  = false;

      for(let range_i = self.scale.range_start; range_i <= self.scale.range_end; range_i++) {
        for(let period_i = self.scale.period_start; period_i <= self.scale.period_end; period_i++) {

          // Flag creation once passed the current period
          if(range_i == self.scale.range_current && period_i == self.scale.period_current) {
            create_blank = true;
          }

          // Only allow adding before next period
          if(create_blank == true) {

            let period_class = 'period_' + range_i + '_' + (period_i >= 10 ? '' : '0') + period_i;

            // Add blank period if doesn't exist in this point row
            if(point_element.find('.' + period_class).length == 0) {
              point_element.append('<period class="' + period_class + ' blank add" data-range="' + range_i + '" data-period="' + period_i + '"></period>');
            }

          }

        }
      }
    });


    // Put periods in correct position
    for(let range_i = self.scale.range_start; range_i <= self.scale.range_end; range_i++) {
      for(let period_i = self.scale.period_start; period_i <= self.scale.period_end; period_i++) {

        // Calc left of period items based on range offset
        let range_offset = parse_int((range_i - self.scale.range_start) * self.scale.period_end);
        let left         = parse_int((range_offset + period_i) * self.scale.point_width) - self.scale.point_width;

        let period_class = 'period_' + range_i + '_' + (period_i >= 10 ? '' : '0') + period_i;
        self.find('.' + period_class).css('left', left);

        if(period_i == 1) {
          let range_class = '.range_' + range_i;

          if(range_i == self.scale.range_start) {
            // Remove width so first range is on far left.
            self.find(range_class).css('left', '0').css('width', '0');
          }
          else {
            let range_left = left - (self.scale.point_width / 2);
            self.find(range_class).css('left', range_left);
          }
        }

        // Calc width ending
        let right = left + self.scale.point_width;
        if(right > self.scale.range_width) {
          self.scale.range_width = right;
        }

      }
    }

    // Draw Full Width
    self.find('content scale, content total, content rows').css('width', self.scale.range_width);


    // Overscroll start position
    let overscroll = self.find('content overscroll');

    // Load scroll offset from data send in reload ajax
    if(is_empty_int(overscroll.attr('data-iscroll_start_x')) == true) {

      // Scroll to current period
      let scroll_offset = parse_int((((self.scale.range_current - self.scale.range_start) * self.scale.period_end) + self.scale.period_current) * self.scale.point_width) - (self.scale.point_width * 2.7);

      // Set offset to overscroll attr
      overscroll.attr('data-iscroll_start_x', -scroll_offset);

    }

    // Manually bind overscroll to set scroll offset
    overscroll.mouseover();

  }




  /**
   * Draw Row Heights
   */
  drawRowHeights() {

    let self = this;
    let total_height = 40; // Initial buffer for scale

    self.find('content rows row').each(function() {

      let row        = $(this);
      let row_height = 0;
      let row_class  = '.row_' + row.attr('data-model_id');

      row.find('period').each(function() {

        let period = $(this);
        let count  = (period.children().length > 0 ? period.children().length : 1);

        // Calc height by points in a period with additional count for 1px point padding and plus 20px padding
        let height = (count * self.scale.point_height) + (count * 2) + 20;
        if(height > row_height) {
          row_height = height;
        }

      });

      // Set row height
      self.find(row_class).css('height', row_height + 'px');

      // Get total height of timeline
      total_height += row_height;

    });

    self.height = total_height;
    self.wrapper.css('height', total_height + 'px');

  }




  /**
   * Draw Rulers
   * Must be done after drawing points
   */
  drawRulers() {

    let self = this;

    for(let range = self.scale.range_start; range <= self.scale.range_end; range++) {
      for(let period = self.scale.period_start; period <= self.scale.period_end; period++) {

        let width_class = 'normal';

        // Mark for thick lines
        if(typeof self.scale.period_thick == 'object') {
          if(self.scale.period_thick.includes(period)) {
            width_class = 'thick';
          }
        }

        // Calc Range Offset
        let range_offset = ((range - self.scale.range_start) * self.scale.period_end);
        if(is_empty_int(range_offset)) {
          range_offset = 0;
        }

        // Calc left of period items based on range offset
        let left = parse_int((range_offset + period) * self.scale.point_width) - self.scale.point_width;

        // Clone last ruler as next
        $('ruler.vertical:last').clone()
            .css('left', left)
            .removeClass('normal')
            .removeClass('thick')
            .addClass(width_class)
            .insertAfter('ruler.vertical:last');

        // Show current period line
        if(range == self.scale.range_current && period == self.scale.period_current) {
          $('ruler.current')
              .css('left', left + parse_int((self.scale.point_width / self.scale.point_end) * self.scale.point_current));
        }

      }
    }

  }




  /**
   * Toggle Screen Size
   */
  toggleScreenSize(event) {

    let self = this;
    let toggle = self.find('.screen-toggle');

    if(self.has_class('fulldisplay')) {

      self.remove_class('fulldisplay');
      toggle.removeClass('fa-compress').addClass('fa-expand');
      toggle.prop('title', 'Expand');

      // Reset to calculated height
      self.wrapper.css('height', self.height + 'px');

      // Enable scrolling when modal is closed
      $('body').removeClass('modal-open');

    }
    else {

      self.add_class('fulldisplay');
      toggle.removeClass('fa-expand').addClass('fa-compress');
      toggle.prop('title', 'Compress');

      // Adjust for testing top bar
      let top_offset = 0;
      if(self.has_class('testing') == true) {
        top_offset = 30;
      }

      // Set to window height so inner scroll bar is functional
      self.wrapper.css('height', (window.innerHeight - top_offset) + 'px');

      // Disable scrolling when modal is open
      $('body').addClass('modal-open');

    }

    this.stop_event(event);

  }




  /**
   * Load Label Blowout New
   */
  loadLabelBlowoutNew(event, target) {

    if(this.attr('data-can_add_label') == 'false') {
      return;
    }

    this.loadBlowoutNew(event, target);

  }




  /**
   * Load Label Blowout Edit
   */
  loadLabelBlowoutEdit(event, target) {

    if(this.attr('data-can_edit_label') == 'false') {
      return;
    }

    this.loadBlowoutEdit(event, target);

  }




  /**
   * Load Point Blowout New
   */
  loadPointBlowoutNew(event, target) {

    if(this.attr('data-can_add_point') == 'false') {
      return;
    }

    this.loadBlowoutNew(event, target);

  }




  /**
   * Load Point Blowout Edit
   */
  loadPointBlowoutEdit(event, target) {

    if(this.attr('data-can_edit_point') == 'false') {
      return;
    }

    this.loadBlowoutEdit(event, target);

  }




  /**
   * Load Blowout Show
   */
  loadBlowoutShow(event, target) {

    this.loadBlowout(null, {
      url      : target.attr('data-url_blowout_show'),
      url_attr : 'data-url_blowout_show',
      event    : event,
      data_attr : {
        model_id : target.parent('row').attr('data-model_id'),
      },
    });

    this.stop_event(event);

  }




  /**
   * Load Blowout New
   */
  loadBlowoutNew(event, target) {

    this.loadBlowout(null, {
      url       : this.attr('data-url_blowout_new'),
      url_attr  : 'data-url_blowout_new',
      event     : event,
      data_attr : {
        model_id : target.parent('row').attr('data-model_id'),
        range    : target.attr('data-range'),
        period   : target.attr('data-period'),
      },
    });

    this.stop_event(event);

  }




  /**
   * Load Blowout Edit
   */
  loadBlowoutEdit(event, target) {

    this.loadBlowout(null, {
      url       : target.attr('data-url_blowout_edit'),
      url_attr  : 'data-url_blowout_edit',
      event     : event,
      data_attr : {
        model_id : target.attr('data-model_id'),
        range    : target.attr('data-range'),
        period   : target.attr('data-period'),
      },
    });

    this.stop_event(event);

  }




}





