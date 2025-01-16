# Development Guide

This documentation provides a comprehensive guide to the development setup, tools, and best practices used in this project.

## 🛠 Code Quality Tools

### ESLint

ESLint is a static code analysis tool that helps identify and fix problems in JavaScript/TypeScript code. It enforces consistent coding styles and catches potential errors before they occur.

#### Our ESLint Configuration Explained

```javascript
// .eslintrc.cjs key configurations explained
{
  "parser": "@typescript-eslint/parser",     // Enables ESLint to understand TypeScript
  "parserOptions": {
    "project": ["./tsconfig.json"]           // Enables type-aware linting
  }
}
```

#### Key ESLint Rules & Why We Use Them

1. **TypeScript Rules**

   - `@typescript-eslint/no-explicit-any`: Warns against using `any` type
     - Why? Maintains type safety and prevents bypassing TypeScript's type system
   - `@typescript-eslint/no-unused-vars`: Catches unused variables
     - Why? Keeps code clean and prevents memory leaks
   - `@typescript-eslint/no-floating-promises`: Ensures promises are handled
     - Why? Prevents unhandled promise rejections

2. **React Rules**

   - `react-hooks/rules-of-hooks`: Enforces React Hooks rules
     - Why? Ensures hooks are used correctly and prevents subtle bugs
   - `react-hooks/exhaustive-deps`: Checks effect dependencies
     - Why? Prevents stale closures and infinite re-renders

3. **Import Rules**
   - `import/order`: Enforces consistent import ordering
     - Why? Improves code readability and maintainability
   - `import/no-cycle`: Prevents circular dependencies
     - Why? Avoids complex dependencies that can cause issues

### Prettier

Prettier is an opinionated code formatter that ensures consistent code style across the project.

#### Our Prettier Configuration Explained

```javascript
// .prettierrc.cjs key configurations explained
{
  // Basic Formatting
  "printWidth": 80,          // Keeps lines readable
  "tabWidth": 2,            // Industry standard indentation
  "semi": true,             // Always add semicolons for clarity
  "singleQuote": true,      // Preferred quote style
  "trailingComma": "all",   // Cleaner git diffs

  // Special Formatting
  "arrowParens": "always",  // Consistent arrow function formatting
  "bracketSameLine": false, // JSX brackets on new line for readability
}
```

#### File-Specific Formatting

We have special formatting rules for different file types:

- JSON/YAML files: Double quotes and consistent indentation
- Markdown files: Proper line wrapping for readability

## 🔄 Development Workflow

### Code Style Enforcement

1. **Pre-commit Checks**

   ```bash
   pnpm lint      # Run ESLint
   pnpm format    # Run Prettier
   ```

2. **Fixing Issues**
   ```bash
   pnpm lint:fix   # Auto-fix ESLint issues
   pnpm format     # Auto-format with Prettier
   ```

### VS Code Integration

For the best development experience, install these VS Code extensions:

- ESLint
- Prettier
- TypeScript + JavaScript

Our `.vscode/settings.json` is configured to:

- Format on save
- Show ESLint errors in real-time
- Provide TypeScript intelligence

## 📝 Best Practices

### TypeScript

1. **Type Safety**

   - Avoid using `any`
   - Use proper type annotations
   - Leverage TypeScript's type inference

2. **Async Code**
   - Always handle promise rejections
   - Use async/await with proper error handling
   ```typescript
   try {
     const data = await fetchData();
   } catch (error) {
     console.error("Failed to fetch:", error);
   }
   ```

### React

1. **Hooks Usage**

   - Follow hooks naming convention (`use` prefix)
   - Ensure proper dependency arrays in useEffect

   ```typescript
   useEffect(() => {
     // Effect code
   }, [dependency1, dependency2]);
   ```

2. **Component Structure**
   - One component per file
   - Use functional components
   - Proper prop typing

### Import Organization

We follow a strict import ordering:

1. React imports
2. External libraries
3. Internal modules
4. Types
5. Styles

Example:

```typescript
import { useState } from "react";

import { motion } from "framer-motion";

import { Button } from "@/components";
import { useAuth } from "@/hooks";

import type { User } from "@/types";

import "./styles.css";
```

## 🚀 Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run development server:

   ```bash
   pnpm dev
   ```

3. Format and lint code:
   ```bash
   pnpm format && pnpm lint
   ```

## 🤝 Contributing

1. Ensure your code follows our ESLint and Prettier configurations
2. Run all checks before committing:
   ```bash
   pnpm typecheck && pnpm lint && pnpm format
   ```
3. Write meaningful commit messages
4. Update documentation when necessary

## 📚 Additional Resources

- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
