





class AttoyaMarkdownTextareaFieldForm extends PlainComponent {




  /**
   * Initializes Class
   */
  init() {

    super.init();

    // Use elastic height on textarea
    this.find('.markdown-source').elasticHeight(6);

    // Save a conversion call when the default content is empty
    var content = this.find('.markdown-source').val();
    if(is_empty(content) == true) {
      return;
    }

    // Display Markdown on load
    this.convert(
      this.find('.markdown-display'),
      content
    );

  }




  /**
   * Initializes Events
   */
  init_events() {

    super.init_events();

    this.add_events({

      // Actions
      'focusin  .markdown-display'               : 'edit',
      'change   .markdown-source'                : 'change',
      'keyup    .markdown-source'                : 'change', // Secondary change trigger
      'focusout .markdown-source'                : 'convert',

    });

  }




  /**
   * Handle when editable Content is focused in
   */
  edit(event, target) {

    var source = target.parent().find('.markdown-source');

    // Display editable source textarea
    $(source).show().focus();

    // Hide display
    $(target).hide();

    this.stop_event(event);

  }




  /**
   * Handle when editable Content is focused out, Convert markdown to html
   */
  change(event, target) {

    var source = $(event.currentTarget);

    // Set is dirty to trigger update on convert
    source.parent().attr('data-is_dirty', 'true');

    this.stop_event(event);

  }




  /**
   * Handle when editable Content is focused out, Convert markdown to html
   */
  convert(event, target) {

    let self    = this;
    let source  = $(event.currentTarget);
    let display = source.parent().find('.markdown-display');

    // Check if content has changed before we make a call to convert.
    if(source.parent().attr('data-is_dirty') == 'true') {

      // Convert and display with html
      // @refactor to use AttoyaComponent AJAX
      $.post(
        $('context').attr('url_markdown_to_html'),
        {
          markdown : source.val(),
        },
        function(payload) {

          self.console.ajax(this.get_class_name() + '(AttoyaMarkdownTextareaFieldForm).convert()->post()', payload);

          // Replace html wrapper inner html with payload.html if successfully converted from the markdown view
          $(display).html(payload.html);
          $(display).parent().attr('data-is_dirty', 'false');

        },
        'post'
      ).fail(function(xhr, textStatus, error) {

        self.console.error('MarkdownTextareaField', error);

        // Just render markdown_content if fail to convert to html
        $(display).html(source.val());

      });

    }

    // Toggle Visibility
    $(display).show();
    $(source).hide();

    this.stop_event(event);

  }




}





