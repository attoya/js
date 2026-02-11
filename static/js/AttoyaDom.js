

/**
 * Attoya JS DOM
 * @copyright (c) 2024-present APSF LLC dba Attoya and contributors
 * @license MIT
 * @version v2.0.0
 * @experimental Do not rely on this, its still an experiment
 */
class AttoyaDom {

  /**
   * Selectors
   */
  selectors = null;

  /**
   * Elements
   */
  elements = {};




  /**
   * Constructor
   */
  constructor(selectors) {

    if(is_empty(selectors) == true) {
      return;
    }

    this.selectors = selectors;
    this.elements  = this.get_elements(selectors);

  }




  /**
   * Get Elements
   */
  get_elements(selectors) {

    if(is_empty(selectors) == true) {
      return [];
    }

    // Set document or window
    if(selectors === 'document') {
      return [document];
    }
    else if(selectors === 'window') {
      return [window];
    }


    // Split
    if(selectors.includes(',')) {
      selectors = selectors.split(',');
    }
    else {
      // Convert single entry to array
      selectors = [selectors]
    }


    var collection = null;
    var elements   = {}
    var counter    = 0;


    // Split selectors to get by type
    for_each(selectors, function(key, selector) {

      if(selector.includes('#') == true) {

        // IDs
        selector   = selector.replace('#', '').trim();
        collection = [
          document.getElementById(selector)
        ];

      }
      else if(selector.includes('.') == true) {

        // Classes
        selector   = selector.replace('.', '').trim();
        collection = document.getElementsByClassName(selector);

      }
      else {

        // Tag
        selector   = selector.trim();
        collection = document.getElementsByTagName(selector);

      }

      // Combine elements if collection returned
      if(is_empty(collection) == false) {

        for_each(collection, function(index, element) {

          elements[counter] = element;
          counter += 1;

        });

      }

      // Clear
      collection = null;

    });


    return elements;

  }




  /**
   * Run a callback on each item
   * @param {Function} callback The callback function to run
   */
  for_each(callback) {

    return for_each(this.elements, callback);

  }




  /**
   * Add a class to elements
   * @param {string} class_name The class name
   */
  add_class(class_name) {

    this.each(function(item) {
      item.classList.add(class_name);
    });

    return this;

  }




  /**
   * Remove a class to elements
   * @param {string} class_name The class name
   */
  remove_class(class_name) {

    this.each(function(item) {
      item.classList.remove(class_name);
    });

    return this;

  }




  /**
   * Check if class is set on elements
   * @param {string} class_name The class name
   */
  has_class(class_name) {

    this.each(function(item) {

    });

  }




  /**
   * Set/Get Attributes
   * @param {string} class_name The class name
   */
  attr(key, value) {

    if(typeof value === 'undefined') {

      // Get attributes on first element
      return this.elements[0].getAttribute(key);

    }
    else {

      // Set attributes on all elements
      this.each(function(item) {
        item.setAttribute(key, value);
      })

    }

  }




  /**
   * Bind an event
   * @param {string} event_name The event_name name
   * @param {function} callback
   */
  bind(event_name, callback) {

    // @note Unbind if callback is undefined

  }




  /**
   * Trigger an event
   * @param {string} event_name The event_name name
   */
  trigger(event_name) {

  }




  /**
   * Append HTML
   * @param {string} html
   */
  append(html) {

  }




  /**
   * Prepend HTML
   * @param {string} html
   */
  prepend(html) {

  }




  /**
   * Replace HTML
   * @param {string} html
   */
  set_html(html) {

  }




  /**
   * Serialize
   */
  serialize() {

  }




  /**
   * Hydrate data and map to elements
   * @param {string} value
   */
  hydrate(data) {

  }




  /**
   * Value
   * @param {string} value
   */
  value(value) {

  }




}






/**
 * Initiate new Attoya DOM
 */
var Attoya = (function() {

  'use strict';

  // New Instance
  var instance = function (selector) {
    return new AttoyaDom(selector);
  };

  // Return the constructor instantiation
  return instance;

})();





