/**
 * @name polyfill
 * @description
 * Polyfill methods for support in IE
 *
 */

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
        position = position || this.length;
        return this.substr(0, position).lastIndexOf(searchString) === (position - searchString.length);
    };
}
