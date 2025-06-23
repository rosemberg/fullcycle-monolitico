# Development Guidelines for Fullcycle Monolith Project

This document provides essential information for developers working on this project. It covers build instructions, testing procedures, and development guidelines.

## Build and Configuration Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Build Process
The project uses TypeScript which is compiled to JavaScript. To build the project:

```bash
npm run tsc
```

This will compile TypeScript files from the `src` directory to JavaScript in the `dist` directory according to the configuration in `tsconfig.json`.

### Project Structure
The project follows a modular monolithic architecture:
- `src/modules/@shared`: Contains shared utilities, domain objects, and interfaces
- `src/modules/[module-name]`: Contains domain-specific modules like product-adm, client-adm, etc.

Each module typically contains:
- `domain`: Domain entities and value objects
- `facade`: Interface adapters that provide a simplified API for the module
- `repository`: Data access implementations
- `usecase`: Application use cases implementing business logic
- `factory`: Factory classes for creating complex objects

## Testing Information

### Running Tests
To run all tests:

```bash
npm test
```

To run tests for a specific file:

```bash
npm test -- path/to/test/file.spec.ts
```

Or using Jest directly:

```bash
npx jest path/to/test/file.spec.ts
```

### Test Structure
Tests are written using Jest and follow this structure:

1. **Unit Tests**: Test individual components in isolation
   - Located alongside the implementation files with `.spec.ts` extension
   - Use mocks for dependencies

2. **Integration Tests**: Test interactions between components
   - Usually test repositories with actual database connections
   - May use in-memory SQLite for testing

### Writing Tests
When adding new features, follow these testing guidelines:

1. Create test files with the `.spec.ts` extension next to the implementation file
2. Use descriptive test names that explain what is being tested
3. Follow the AAA pattern (Arrange, Act, Assert)
4. Mock external dependencies using Jest's mocking capabilities

### Example Test

Here's an example of a simple test for a utility class:

```typescript
// string-utils.spec.ts
import { StringUtils } from "./string-utils";

describe("StringUtils", () => {
  describe("capitalize", () => {
    it("should capitalize the first letter of a string", () => {
      expect(StringUtils.capitalize("hello")).toBe("Hello");
    });

    it("should return empty string when input is empty", () => {
      expect(StringUtils.capitalize("")).toBe("");
    });
  });
});
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow clean architecture principles with clear separation of concerns
- Use dependency injection for better testability
- Document public APIs with JSDoc comments

### Domain-Driven Design
This project follows DDD principles:
- Entities have identity and lifecycle
- Value Objects are immutable and have no identity
- Aggregates enforce consistency boundaries
- Repositories provide data access abstraction
- Facades simplify module interaction

### Error Handling
- Use custom error classes for domain-specific errors
- Provide meaningful error messages
- Handle errors at appropriate levels of abstraction

### Adding New Features
1. Identify the module where the feature belongs
2. Create or update domain entities as needed
3. Implement use cases that encapsulate business logic
4. Create or update repositories for data access
5. Update the facade to expose the new functionality
6. Write comprehensive tests for all components

### Debugging
- Use TypeScript source maps for better debugging
- Jest tests can be debugged using the Node.js debugger
- For VS Code users, launch configurations are available for debugging tests

## Continuous Integration
- All tests must pass before merging code
- TypeScript compilation with `--noEmit` is used to verify type correctness
- Follow the existing patterns for module organization and testing