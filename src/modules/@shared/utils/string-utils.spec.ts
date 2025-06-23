import { StringUtils } from "./string-utils";

describe("StringUtils", () => {
  describe("capitalize", () => {
    it("should capitalize the first letter of a string", () => {
      expect(StringUtils.capitalize("hello")).toBe("Hello");
      expect(StringUtils.capitalize("world")).toBe("World");
    });

    it("should return empty string when input is empty", () => {
      expect(StringUtils.capitalize("")).toBe("");
    });

    it("should handle already capitalized strings", () => {
      expect(StringUtils.capitalize("Hello")).toBe("Hello");
    });

    it("should handle null and undefined", () => {
      expect(StringUtils.capitalize(null as any)).toBe(null);
      expect(StringUtils.capitalize(undefined as any)).toBe(undefined);
    });
  });

  describe("toCamelCase", () => {
    it("should convert kebab-case to camelCase", () => {
      expect(StringUtils.toCamelCase("hello-world")).toBe("helloWorld");
    });

    it("should convert snake_case to camelCase", () => {
      expect(StringUtils.toCamelCase("hello_world")).toBe("helloWorld");
    });

    it("should convert space-separated words to camelCase", () => {
      expect(StringUtils.toCamelCase("hello world")).toBe("helloWorld");
    });

    it("should return empty string when input is empty", () => {
      expect(StringUtils.toCamelCase("")).toBe("");
    });

    it("should handle null and undefined", () => {
      expect(StringUtils.toCamelCase(null as any)).toBe(null);
      expect(StringUtils.toCamelCase(undefined as any)).toBe(undefined);
    });
  });
});