export class StringUtils {
  /**
   * Capitalizes the first letter of a string
   * @param str The string to capitalize
   * @returns The capitalized string
   */
  static capitalize(str: string): string {
    if (!str || str.length === 0) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Converts a string to camelCase
   * @param str The string to convert
   * @returns The camelCase string
   */
  static toCamelCase(str: string): string {
    if (!str || str.length === 0) {
      return str;
    }
    
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, (c) => c.toLowerCase());
  }
}