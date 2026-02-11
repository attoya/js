





/**
 * @notice This is different than MarkdownTextareaFieldForm.js, to be used for block for now
 * @future Combine this and MarkdownTextareaField.js when done, make it work with block and form
 */
class AttoyaMarkdown extends AttoyaPlainComponent {




  /**
   * Constructor
   */
  constructor(options) {

    // Set Options
    options = default_empty_object(options, {
      wrapper        : $('.markdown'),
      origin         : $($('.markdown').attr('data-origin')),
      update_time    : 2000, // 2 Seconds
      last_timestamp : null,
      is_editing     : false,
    });

    super(options);

  }




  /**
   * Initializes Class
   */
  init() {

    super.init();

    // Flag to Turn on Copy Button Panel
    this.copy_button_is_visible = false;

  }




  /**
   * Extend / define events and handlers
   */
  init_events() {

    super.init_events();

    this.add_events({

      // Actions
      'dblclick .check-item, .table-input'  : 'stop_event',
      'click .check-item.fa-square'         : 'setCheckable', // Limit toggle to run check icons only
      'click .check-item.fa-check-square'   : 'setCheckable',
      // 'click .table-input'                  : 'editTableInput', // @note disable editable tables to prevent unwanted changes or misformatting
      // 'focusout .table-input'               : 'setTableInput',
      'mouseenter pre'                      : 'showCopyButton',
      'mouseleave pre'                      : 'removeCopyButton', // @note use 'mouseleave' instead of 'mouseout', since the latter will be mis-trigger when the mouse enter the copy button
      'dblclick .progress-fill'             : 'stop_event',       // @note prevent double click on progress bar opening block
      'click .progress-fill'                : 'updateProgress',
      'contextmenu .progress-fill'          : 'updateProgress',

    });

  }




  /**
   * Set Checkable
   */
  setCheckable(event, target) {

    var check_item = target;

    if(is_empty(check_item)) {
      return;
    }

    // Use toggleClass to Check/Uncheck
    check_item.toggleClass('far fa-square');
    check_item.toggleClass('system-core text fas fa-check-square');

    var check_markdown = '[]';

    // Use Checked [X] syntax if item is checked
    if(check_item.hasClass('system-core text fas fa-check-square')) {
      check_markdown = '[X]';
    }

    // Modify Content
    var offset = this.modifyBlockContent(check_item, check_markdown);

    this.updateLineElementOffset(check_item, offset);

    this.triggerBlockList(event, target);

    this.stop_event(event);

  }




  /**
   * Make Table Cell Editable
   */
  editTableInput(event, target) {

    // Exit if already editable
    if($(target).attr('contenteditable') == true) {
      this.stop_event(event);
      return;
    }

    // Set target to be contenteditable
    $(target).attr('contenteditable', true);

    // Flag to turn on table editing
    this.options.is_editing = true;

    // Set cursor to end of text on single click only
    place_caret_at_end($(target)[0]);

    this.stop_event(event);

  }




  /**
   * Set Table
   */
  setTableInput(event, target) {

    var table_cell = target;

    if(is_empty(table_cell)) {
      this.stop_event(event);
      return;
    }

    // Modify table_cell attributes to uneditable
    $(table_cell).attr('contenteditable', false);

    var updated_value = $(table_cell).text();

    // Get Value of start_index and end_index before modifying content
    var start_index = parse_int(table_cell.attr('data-start_index'));
    var end_index   = parse_int(table_cell.attr('data-end_index'));

    // Variable to shift the end_index if markdown content length changes
    var offset = this.modifyBlockContent(table_cell, updated_value);

    // Upate Icon attribute data-end_index to ensure next check/uncheck will not shift
    table_cell.attr('data-end_index', end_index + offset);

    // Set Offset to the sibling <table_cell> elements
    table_cell.nextAll().each(function() {

      var start_index = parse_int($(this).attr('data-start_index'));
      var end_index   = parse_int($(this).attr('data-end_index'));

      $(this).attr('data-start_index', start_index + offset);
      $(this).attr('data-end_index', end_index + offset);

    });

    // Flag to turn off table editing
    this.options.is_editing = false;

    this.triggerBlockList(event, target);

    this.stop_event(event);

  }




  /**
   * Modify Block Content
   */
  modifyBlockContent(target, updated_value) {

    // Extract Line Information from check_item data attribute
    var line_number = $(target).attr('data-line_number');
    var start_index = parse_int($(target).attr('data-start_index'));
    var end_index   = parse_int($(target).attr('data-end_index'));

    var block_element = $(target).closest('.block');
    var content       = block_element.find('.form .content');

    var text  = $(content).val();
    var lines = text.split('\n');
    var line  = lines[line_number - 1];

    // Replace Check Item Markdown depends on Check/Uncheck status
    var modified_line = line.slice(0, start_index) + updated_value + line.slice(end_index);

    // Set updated line to lines array
    lines[line_number - 1] = modified_line;

    // Variable to shift the end_index if markdown content length changes
    var offset = modified_line.length - line.length;

    // Join lines into one text then set the value of markdown content
    var result = lines.join('\n');

    $(content).val(result);

    // Return the offset so that calling function can update data attributes of element
    return offset;

  }




  /**
   * Update Line Element Offset
   */
  updateLineElementOffset(target, offset) {

    const block_element = $(target).closest('.block');
    const start_index = parse_int($(target).attr('data-start_index'));
    const end_index   = parse_int($(target).attr('data-end_index'));
    const line_number = parse_int($(target).attr('data-line_number'));

    // Update end index of target
    $(target).attr('data-end_index', end_index + offset);

    // Get elements with same line number
    const line_elements = block_element.find('[data-line_number="' + line_number + '"]');

    // Filter to elements where start_index is greater
    const greater_elements = line_elements.filter(function() {
      return parse_int($(this).attr('data-start_index')) > start_index;
    });

    // Offset start and end index of greater elements
    greater_elements.each(function() {
      const start_index = parse_int($(this).attr('data-start_index'));
      const end_index   = parse_int($(this).attr('data-end_index'));
      $(this).attr('data-start_index', start_index + offset);
      $(this).attr('data-end_index', end_index + offset);
    });

  }




  /**
   * Trigger Block List
   * @future Make the Trigger on BlockList more general purposed, not limit to check list
   */
  triggerBlockList(event, target) {

    let self = this;

    self.options.last_timestamp = Date.now();

    setTimeout(function () {

      var current_timestamp = Date.now();

      // Do not run trigger if current_timestamp is not more than 5seconds from last_timestamp, means that user still updating
      if((current_timestamp - self.options.last_timestamp) < self.options.update_time || self.options.is_editing == true) {
        return;
      }

      // Only Trigger Save if this.origin is Block
      $(self.origin).trigger('BlockList:setMarkdown', {
        event  : event,
        target : target,
      });

    }, self.options.update_time);

    this.stop_event(event);

  }




  /**
   * Show Copy Button
   */
  showCopyButton(event, target) {

    let self = this;

    // Make sure the button is show once
    if(this.copy_button_is_visible == true) {
      return;
    }

    // @note Edge Case Input For Running Select Node on
    var hidden_text_html = '<textarea class="copy-code-textarea">' + $(target).text() +'</textarea>';
    $(target).append(hidden_text_html);

    // Show copy button Content
    var copy_button_html = '<div class="copy-button">Copy</div>';
    $(target).append(copy_button_html);

    // @refactor to able to addEvents() to dynamically created dom element
    $(target).find('.copy-button').click(function(event) {

      self.stop_event(event);

      // Animation to acknowledge the user button has been clicked
      $(this).fadeTo(200, 0.6, function() {
        $(this).fadeTo(200, 1);
      });

      var code_markdown = $(this).closest('pre');
      var textarea      = code_markdown.find('.copy-code-textarea');

      var range = document.createRange();
      range.selectNodeContents($(textarea)[0]);

      // @refactor to use copy_to_clipboard() in attoya_logic.js if possible
      var selection = window.getSelection();
      selection.removeAllRanges(); // clear current selection
      selection.addRange(range); // to select text
      document.execCommand('copy');
      selection.removeAllRanges();// to deselect

    });

    // Flag to turn on table editing
    this.copy_button_is_visible = true;

    this.stop_event(event);

  }




  /**
   * Remove Copy Button
   */
  removeCopyButton(event, target) {

    // Remove copy-button div from dom
    $(target).find('.copy-button').remove();
    $(target).find('.copy-code-textarea').remove();

    // Make sure the button is hidden once the mouse cursor left
    this.copy_button_is_visible = false;

    this.stop_event(event);

  }




  /**
   * Set Component as Readonly
   */
  readonly(event, target) {

    this.find('.check-item').addClass('disabled');
    this.find('.table-input').addClass('disabled');

    super.readonly(event, target);

  }




  /**
   * Lock Component
   */
  lock(event, target) {

    this.find('.check-item').addClass('disabled');
    this.find('.table-input').addClass('disabled');

    super.lock(event, target);

  }




  /**
   * Update Progress
   */
  updateProgress(event, target) {

    const progress = target;

    if(is_empty(progress)) {
      return;
    }

    // Exit if no type or is code-status as we haven't built the UI edge case for the pipe in the string.
    const class_type = progress.attr('data-class_type');
    if(class_type == 'code-status') {
      return;
    }

    const progressInner = progress.find('.progress-inner');
    let delta           = 10;

    // If right click, decrement
    if(event.which == 3) {
      delta = -10;
    }

    // Get percentage and clamp updated percentage between 0 and 100
    const currentPercentage = parse_int(progress.attr('data-progress'));
    const updatedPercentage = Math.max(0, Math.min(100, currentPercentage + delta));

    // Update progress class
    progressInner.removeClass(`fill-${currentPercentage}`);
    progressInner.addClass(`fill-${updatedPercentage}`);

    // Update progress data attribute
    progress.attr('data-progress', updatedPercentage);
    progress.prop('title', `Progress ${updatedPercentage}%`);

    // Update markdown
    const progressClassSymbolMap = {
      'bar' : '%',
    };

    const progressSymbol   = progressClassSymbolMap[progress.attr('data-class_type')];
    const progressMarkdown = `[${updatedPercentage}${progressSymbol}]`;

    // Modify Content
    const offset = this.modifyBlockContent(progress, progressMarkdown);

    this.updateLineElementOffset(progress, offset);

    this.triggerBlockList(event, target);

    this.stop_event(event);

  }




}



