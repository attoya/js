

/**
 * Attoya JS Logic
 * @copyright (c) 2024-present APSF LLC dba Attoya and contributors
 * @license MIT
 * @version v2.0.0
 */




/**
 * Check if value is empty
 * @param {type} value
 * @returns {Boolean}
 */
is_empty = function(value) {

  if(typeof value === 'undefined' || value === '' || value === null || value === 0) {
    return true;
  }

  return false;

};




/**
 * Check if value is set
 * @param {type} value
 * @returns {Boolean}
 */
is_set = function(value) {

  return !is_empty(value);

};




/**
 * Check if jQuery object is empty
 * @param {type} value
 * @returns {Boolean}
 */
is_empty_jquery = function(value) {

  if(value instanceof jQuery == true) {
    if(value.length == 0) {
      return true;
    }
  }

  return false;

};




/**
 * Check if value is an integer
 * @param {type} value
 * @returns {Boolean}
 */
is_int = function(value) {

  if(isNaN(parseInt(value)) == false) {
    return true;
  }

  return false;

};




/**
 * Check if value is empty integer
 * @param {type} value
 * @returns {Boolean}
 */
is_empty_int = function(value) {

  // If not an integer, consider empty
  if(is_int(value) == false) {
    return true;
  }

  return is_empty(parseInt(value));

};




/**
 * Check if value is a decimal number
 * @param {type} value
 * @returns {Boolean}
 */
is_float = function(value) {

  if(isNaN(parseFloat(value)) == false) {
    return true;
  }

  return false;

};




/**
 * Check if value is empty decimal (float)
 * @param {type} value
 * @returns {Boolean}
 */
is_empty_float = function(value) {

  // If not a float, consider empty
  if(is_float(value) == false) {
    return true;
  }

  return is_empty(parseFloat(value));

};




/**
 * Check if value is an array
 * @param {type} value
 * @returns {Boolean}
 */
is_array = function(array) {

  if(array instanceof Array) {
    return true;
  }

  return false;

};




/**
 * Check if value an empty array
 * @param {type} value
 * @returns {Boolean}
 */
is_empty_array = function(array) {

  // If not a array, consider empty
  if(is_array(array) == false) {
    return true;
  }

  // Check length
  if(array.length == 0) {
    return true;
  }

  return false;

};




/**
 * Push value to array. If array does not exist it will be created
 * @param {array} array
 * @param {string} value
 * @returns {Array|array}
 */
array_push = function(array, value) {

  // Create array if it doesn't exist
  if(is_array(array) == false) {
    array = [];
  }

  array.push(value);

  return array;

};




/**
 * Check if value is a function
 * @param {function} function_name
 * @returns {Boolean}
 */
is_function = function(function_name) {

  if(typeof function_name === 'function') {
    return true;
  }

  return false;

};




/**
 * Execute a Function, if it is a function
 * @param {function} function_name
 * @returns {Boolean}
 */
execute_function = function(function_name /*, args */) {

  if(is_function(function_name) == false) {
    var args = Array.prototype.slice.call(arguments, 2);
    args.splice(0, 1);
    return function_name.apply(null, args);
  }
  else {
    // Leave this notice here for debugging
    AttoyaConsole.debug('execute_function()', function_name + ' is not a function!');
    return false;
  }

};




/**
 * @wip Execute a Function from a String
 * @param {type} function_name
 * @param {type} context
 * @returns {unresolved}
 */
WIPexecute_function_from_string = function(function_name /*, args */) {

  console.log('execute_function_from_string', function_name);

  let args = Array.prototype.slice.call(arguments, 1);
  let func = Function(function_name);

  // Leave this notice here for debugging
  if(is_function(func) == false) {
    AttoyaConsole.debug('execute_function_from_string()', function_name + ' is not a function!');
    return false;
  }

  console.log('execute_function_from_string func', func);

  return func.call();

};
execute_function_from_string = function(function_name, context /*, args */) {

  var args       = Array.prototype.slice.call(arguments, 2);
  var namespaces = function_name.split(".");
  var func       = namespaces.pop();

  for(var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }

  if(is_function(context[func]) == false) {
    // Leave this notice here for debugging
    AttoyaConsole.debug(function_name + ' is NOT a function! Called with execute_function_from_string()');
    return false;
  }

  return context[func].apply(context, args);

};




/**
 * Safe parsing of integer
 * @param {type} value
 * @returns integer | 0 if NaN
 */
parse_int = function(value) {

  // Remove commas
  if(typeof value === 'string') {
    value = value.replace(',', '');
  }

  value = parseInt(value);

  // Return 0 if NaN
  if(isNaN(value) == true) {
    return 0;
  }

  return value;

};




/**
 * Safe parsing of float
 * @param {type} value
 * @returns {float} | 0 if NaN
 */
parse_float = function(value) {

  // Remove commas
  if(typeof value === 'string') {
    value = value.replace(',', '');
  }

  value = parseFloat(value);

  // Return 0 if NaN
  if(isNaN(value) == true) {
    return parseFloat(0);
  }

  return value;

};




/**
 * Safe parsing of decimal
 * @param {type} value
 * @param {int} valuedecimal_place
 * @returns {float} | 0 if NaN
 */
parse_decimal = function(value, decimal_place = 0) {

  return parse_float(value).toFixed(decimal_place);

};




/**
 * Safe parsing of number
 * @param {type} value
 * @param {object} options
 * @returns {float} | 0 if NaN
 */
 parse_number = function(value, decimal_place = 0) {

  // Use parse float first
  value = parse_float(value);

  // Use local string. Intl.NumberFormat never worked.
  value = value.toLocaleString('en-US', {
    maximumFractionDigits : decimal_place,
  });

  return value;

};




/**
 * Safe parsing of boolean
 * @param {type} value
 * @returns {float} | 0 if NaN
 */
parse_bool = function(value) {

  if(typeof value === 'boolean') {
    return value;
  }

  // Convert to lowercase string for checking
  check = ''
  if(typeof value === 'string') {
    check = value.toLowerCase();
  }

  if(check == 'true' || value == 1) {
    return true;
  }
  else if(check == 'false' || value == 0) {
    return false;
  }

  return false; // Default to false

};




/**
 * Safe parsing of string
 * @param {type} value
 * @returns {float} | 0 if NaN
 */
parse_str = function(value) {

  // Convert to lowercase string for checking
  check = ''
  if(typeof value === 'string') {
    check = value.toLowerCase();
  }

  if(check == 'none' || check == 'null' || check == 'nan' || check == 'undefined') {
    return null;
  }
  else if(check == 'true') {
    return 'true';
  }
  else if(check == 'false') {
    return 'false';
  }

  if(typeof value === 'string') {
    return value;
  }


  try {
    return String(value);
  }
  catch(error) {
    AttoyaConsole.exception('parse_str()', error);
    return ''; // Default to empty string
  }

};




/**
 * Parse Javascript - Safe converstion of value to javascript data type
 * @param value
 * @return many datatypes
 */
parse_javascript = function(value) {

  // @note null is an Object in JavaScript. So check literal null first. Also include blank.
  if(value === null || value === '') {
    return null;
  }

  // Check for standard JS datatypes, return if found
  let datatypes = [
    'number',
    'bigint',
    'float',
    'boolean',
    'object',
    'function',
    'symbol',
  ];
  if(datatypes.includes(typeof value) === true) {
    return value;
  }

  // Convert to lowercase string for checking
  let check = ''
  if(typeof value === 'string') {
    check = value.toLowerCase();
  }

  if(check == 'none' || check == 'null' || check == 'undefined') {
    return null;
  }
  else if(check == 'true') {
    return true;
  }
  else if(check == 'false') {
    return false;
  }


  // Check if a float
  try {
    if('.' in String(value)) {
      check = parse_float(value)
      if(check > 0) {
        return check;
      }
    }
  }
  catch(error) {
    AttoyaConsole.exception('parse_javascript() trying parse_float()', error);
  }


  // Check if an integer
  try {
    check = parse_int(value)
    if(check > 0) {
      return check;
    }
  }
  catch(error) {
    AttoyaConsole.exception('parse_javascript() trying parse_int()', error);
  }

  return value;

};




/**
 * For Each Function
 * @param {object|array} values
 * @param {function} callback
 */
for_each = function(values, callback) {

  if(is_empty(values) == true) {
    return;
  }

  if(is_function(callback) == false) {
    return;
  }

  // Array
  if(typeof values === Array) {
    for(var key = 0; key < values.length; key++) {
      callback(key, values[key]);
    }
  }
  // Default to Object
  else {
    for(const [key, value] of Object.entries(values)) {
      callback(key, value);
    }
  }


};




/**
 * Set default value if empty
 * @param {type} value
 * @param {type} default_value
 * @returns {boolean}
 */
default_empty = function(value, default_value) {

  if(is_empty(value)) {
    return default_value;
  }

  return value;

};




/**
 * Set default array if is not an array
 * @param {array|string} array
 * @returns {array}
 */
default_array = function(array) {

  if(is_array(array) == false) {
    return [array];
  }

  return array;

};




/**
 * Set default values on object if empty
 * @param {object} object
 * @param {object} default_object
 * @returns {object}
 */
default_empty_object = function(object, default_object, default_value = {}) {

  // Initialize object if not already
  object = default_empty(object, default_value);

  default_object = default_empty(default_object, default_value);

  // Loop through default values and add if json is empty
  for_each(default_object, function(key, value) {

    if((value !== null) && (value instanceof jQuery == false) && (typeof value === 'object')) {
      if(Array.isArray(value) === true) {
        object[key] = default_empty_object(object[key], value, []);
      }
      else {
        // Perform Recursive Call For Nested Object
        object[key] = default_empty_object(object[key], value);
      }
    }
    else if(is_empty(object[key]) == true) {
      object[key] = value;
    }

  });

  return object;

};




/**
 * Extends and object with added options
 * @param {object} original_object
 * @param {object} added_object
 * @returns {object} extended_object
 * @future to Vanilla JS (Uses jQuery for now)
 */
extend_object = function(original_object, added_object) {

  $.extend(original_object, added_object);

  return original_object;

};




/**
 * Converts Object to Array
 * @param {object} object
 * @returns {Array}
 */
object_to_array = function(original_object) {

  var converted_array = [];

  for_each(original_object, function(key, value) {
    converted_array[key] = value;
  });

  return converted_array;

};


/**
 * Adds multiple attributes on selector with array to jQuery Element.
 * @type type
 */
add_attributes = function(element, attributes = [], prefix = 'data-') {

  if(is_empty(attributes) == true) {
    return;
  }

  for_each(attributes, function(key, value) {

    let key_name = key;
    if(is_empty(prefix) == false) {
      key_name = prefix + key;
    }

    $(element).attr(key_name, value);

  });

},




/**
 * Encode String
 * Use encodeURIComponent to get percent-encoded UTF-8,
 * then we convert the percent encodings into raw bytes which can be fed into btoa.
 * @param {object} object
 * @returns {Array}
 */
encode_string = function(string) {

  return btoa(encodeURIComponent(string).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
    }
  ));

};




/**
 * Decode String
 * @param {object} object
 * @returns {Array}
 * Going backwards: from bytestream, to percent-encoding, to original string.
 */
decode_string = function(string) {

  return decodeURIComponent(atob(string).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

};




/**
 * Set Cookie
 * @param {type} name
 * @param {type} value
 * @param {type} days
 */
set_cookie = function(name, value, days) {

  if(days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toUTCString();
  }
  else {
    var expires = "";
  }

  document.cookie = name + "=" + value + expires + "; samesite=lax; path=/";

};




/**
 * Get Cookie
 * @param {type} name
 * @returns cookie || null
 */
get_cookie = function(name) {

  var nameEQ = name + "=";
  var ca = document.cookie.split(';');

  for(var i = 0; i < ca.length; i++) {

    var c = ca[i];
    while(c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }
    if(c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length, c.length);
    }

  }

  return null;

};




/**
 * Clear Cookie
 * @param {type} name
 * @returns {undefined}
 */
clear_cookie = function(name) {

  set_cookie(name, '', -1);

};




/**
 * Copy to Clipboard (text)
 * @param {element|false} text_element
 * @param {string} text (optional) To use, set text_element = false
 * @deprecated Replace with https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
 */
copy_to_clipboard = function(text_element, text) {

  // Use text vs element
  if(text_element !== false) {
   text = $(text_element).text();
  }

  var $temp = $('<textarea>');  // Create temp "hidden" field
  $('body').append($temp);      // Append temp field to the body
  $temp.val(text).select();     // Set and Highlight temp field's content
  document.execCommand('copy'); // Copy the highlighted text
  $temp.remove();               // Remove temp field from the body

};




/**
 * Get Datetime
 */
get_datetime = function() {

  return new Date().toString();

};




/**
 * Has Datetime Passed
 */
has_datetime_passed = function(check_datetime = null, check_seconds = 0.5) {

  // No check time, so its passed
  if(is_empty(check_datetime) == true) {
    return true;
  }

  let now   = new Date();
  let check = new Date(check_datetime);

  let seconds = Math.round( (now - check) / 1000 ); // In seconds

  if(seconds > check_seconds) {
    return true;
  }

  return false;

};




/**
 * Get a random string
 * @param {int} output_length
 * return {int} random value
 */
get_random_string = function(output_length = 8) {

  let rand1 = (Math.random() + 1).toString(36).substring(2);
  let rand2 = (Math.random() + 1).toString(36).substring(2);

  return (rand1 + rand2).substring(0, output_length);

};




/**
 * Zero Padding
 */
zero_pad = function(value, maxLength) {

  return String('0' . repeat(maxLength) + value).slice(-maxLength);

};




/**
 * Check if the HTTP method is csrfSafe
 * @param {string} method
 * return {Boolean}
 */
check_csrf_safe_method = function(method) {

  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));

};




/**
 * Setup CSRF Header for ajax request
 * @param {string} csrfToken
 */
setup_csrf_header = function(csrfToken) {

  $.ajaxSetup({
    beforeSend: function(xhr, settings) {

      if(!check_csrf_safe_method(settings.type) && !this.crossDomain) {

        // Set up CSRF header
        xhr.setRequestHeader("X-CSRFToken", csrfToken);

      }

    }
  });

};




/**
 * nl2br function
 * @param {string} str
 * @param {boolean} is_xhtml
 */
nl2br = function(str, is_xhtml) {

  if(typeof str === 'undefined' || str === null) {
    return '';
  }

  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';

  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');

};




/**
 * Get Text Width
 * @param {type} text
 * @param {type} font
 * @returns {.context@call;measureText.width}
 */
get_text_width = function(text, font) {

  // re-use canvas object for better performance
  var canvas = get_text_width.canvas || (get_text_width.canvas = document.createElement("canvas"));

  var context = canvas.getContext("2d");
  context.font = font;

  var metrics = context.measureText(text);

  return parse_int(metrics.width);

};




/**
 * Place Caret at End
 * @param {element} element
 */
place_caret_at_end = function(element) {

  element.focus();

  if(typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {

    var range = document.createRange();

    range.selectNodeContents(element);
    range.collapse(false);

    var select = window.getSelection();

    select.removeAllRanges();
    select.addRange(range);

  }
  else if(typeof document.body.createTextRange != 'undefined') {

    var text_range = document.body.createTextRange();

    text_range.moveToElementText(element);
    text_range.collapse(false);
    text_range.select();

  }

};




/**
 * Calc Float
 * @param {Number | string} value_a
 * @param {string} operation
 * @param {Number | string} value_b
 */
calc_float = function(value_a, operation, value_b) {

  // Map string operations to functions
  const operatorMap = {
    '+'  : (a, b) => a + b,
    '-'  : (a, b) => a - b,
    '*'  : (a, b) => a * b,
    '/'  : (a, b) => a / b,
    '//' : (a, b) => Math.floor(a / b), // Floor Division
    '%'  : (a, b) => a % b,             // Modulus (Remainder)
    '^'  : (a, b) => a ** b,            // Power
  };

  let output = 0;

  try {

    value_a = parseFloat(value_a);
    value_b = parseFloat(value_b);

    // Get max length of both values
    let max_length = Math.max(
      value_a.toString().length,
      value_b.toString().length,
    );

    const multiplier = 10 ** max_length;

    // Scale values
    value_a = value_a * multiplier;

    // Only scale value_b if it's not a power
    if(operation !== '^') {
      value_b = value_b * multiplier;
    }

    if(operatorMap.hasOwnProperty(operation)) {

      // Calculate
      output = operatorMap[operation](value_a, value_b)

      // Downscale value
      switch (operation) {
        case '*':
          // For multiplication, we need to downscale the result twice
          output = output / (multiplier ** 2);
          break;

        case '/' || '//':
          // For division, we need to upscale the result
          output = output;
          break;

        case '^':
          // For powers, we need to downscale the result by the power
          output = output / (multiplier ** value_b);
          break;

        default:
          output = output / multiplier;
          break;
      }

      if(isNaN(output) || !isFinite(output)) {
        output = 0;
      }

    }
    else {
      AttoyaConsole.exception(`calc_float() operator ${operation} not recognized`);
    }

  }
  catch {
    AttoyaConsole.exception(`calc_float()`);
  }

  return output;

}



