





class AttoyaRelatedFieldForm extends PlainComponent {




  /**
   * Initializes Class
   */
  init() {

    super.init();

    this.form = this.closest('.form');

    let self = this;

    // Init IDs fields
    this.ids_store_field  = this.form.find('#id_' + this.attr('data-ids_store_field'));
    this.ids_delete_field = this.form.find('#id_' + this.attr('data-ids_delete_field'));

    this.ids_original_list = [];

    // Load original IDs
    var ids_original = this.attr('data-ids_original');
    if(is_empty(ids_original) == false) {
      // Split as numbers
      this.ids_original_list = $.map(ids_original.split(','), Number);
    }

    // Load limit IDs (Keep as CSV string)
    this.ids_limit = this.attr('data-ids_limit');

    // Make a copy of original values (use splice to clone otherwise will be connected in memory)
    this.ids_store_list  = this.ids_original_list.slice();
    this.ids_delete_list = [];

    // Set fields at init
    this.setStoreField();
    this.setDeleteField();

    // Operation Part (for top level BOM we don't include searches for assigned BOM)
    this.bindAutocomplete({
      field   : self.find('.related-autocomplete'),
      url     : self.attr('data-url_autocomplete'),
      blowout : true,
      select  : function(element, event, ui) {

        // Store selected item
        self.store(ui.item);

        // Clear search
        $(element).val('');

      },
      filterResponse : function(payload) {

        return payload.filter(
          function(item) {
            return self.ids_store_list.includes(item.id) == false;
          }
        )

      },
    });

  }




  /**
   * Initializes Events
   */
  init_events() {

    super.init_events();

    this.add_events({

      // Actions
      'click .delete'    : 'delete',
      'dblclick .delete' : 'stop_event', // Prevent double click

    });

  }




  /**
   * Store
   */
  store(item = null) {

    var model_id = parse_int(item.value);
    var name     = item.label;

    // Exit if no ID
    if(is_empty_int(model_id) == true) {
      return;
    }

    // Check if already stored
    if(this.ids_store_list.includes(model_id) == true) {
      return;
    }

    // Add ID
    this.ids_store_list.push(model_id);
    this.setStoreField();


    // Remove from delete if in original list and deleted (aka actually delete)
    var original_index = this.ids_original_list.indexOf(model_id);
    var delete_index   = this.ids_delete_list.indexOf(model_id);
    if(original_index > -1 && delete_index > -1) {

      // Remove from delete
      this.ids_delete_list.splice(delete_index, 1);
      this.setDeleteField();

    }

    // Base on blank item
    var element = this.find('.related-item-blank').clone(); // Don't pass true here. We need clean clone

    // Modify for tracking new item
    element.attr('data-model_id', model_id)
           .addClass('related-item-' + model_id)
           .removeClass('related-item-blank');

    // Set Name
    element.find('.name').html(name);

    this.find('.related-item-blank').before(element);

    // Show element
    element.show();

    // Mark form as dirty
    this.closest('.form').attr('data-is_dirty', 'true');

  }




  /**
   * Delete
   */
  delete(event, target) {

    var item     = target.closest('.related-item');
    var model_id = parse_int(item.attr('data-model_id'));

    // Exit if no ID
    if(is_empty_int(model_id) == true) {
      return;
    }

    // Remove from store list
    var store_index = this.ids_store_list.indexOf(model_id);
    if(store_index > -1) {

      // Remove from store
      this.ids_store_list.splice(store_index, 1);
      this.setStoreField();

    }

    // Add to delete if in original list (aka actually delete)
    var original_index = this.ids_original_list.indexOf(model_id);
    if(original_index > -1) {
      this.ids_delete_list.push(model_id);
    }

    this.setDeleteField();

    // Remove from display
    this.find('.related-item-' + model_id).remove();

    // Mark form as dirty
    this.closest('.form').attr('data-is_dirty', 'true');

    this.stop_event(event);

  }




  /**
   * Set Store Field
   */
  setStoreField() {

    // Update store field with IDs
    if(is_empty(this.ids_store_list) == false) {
      this.ids_store_field.val(this.ids_store_list.join(','));
    }
    else {
      this.ids_store_field.val('');
    }

  }




  /**
   * Set Delete Field
   */
  setDeleteField() {

    // Update delete field with IDs
    if(is_empty(this.ids_delete_list) == false) {
      this.ids_delete_field.val(this.ids_delete_list.join(','));
    }
    else {
      this.ids_delete_field.val('');
    }

  }




}





