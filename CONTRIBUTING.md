# Contributing to Chrxmee-MP4 Bot Maker

## How to Contribute

### Report Bugs
Open an issue on GitHub with:
- What you were doing
- What you expected to happen
- What actually happened
- Your Node.js version
- Any error output

### Suggest Features
Open an issue tagged `enhancement`. Describe what you want and why it's useful for bot developers.

### Submit Code
1. Fork the repo
2. Create a branch (`feature/my-feature` or `fix/my-fix`)
3. Write your code
4. Make sure existing tests pass (`npm test`)
5. Open a pull request

## Code Style

- Use 4 spaces for indentation
- Semicolons required
- Single quotes for strings
- `camelCase` for variables and methods
- `PascalCase` for classes
- JSDoc comments on public methods

```js
/**
 * Kicks a member from the guild.
 * @param {string} username - The user to kick
 * @returns {Promise<boolean>} Whether the kick succeeded
 */
async kick(username) {
    // ...
}
```

## Adding New Features

If you're adding a new structure or manager:
- Add the class in the correct folder
- Add the manager to `client/ChrxmeeBot.js`
- Add TypeScript definitions in `types/index.d.ts`
- Add documentation in the README API reference section

## Testing

```bash
npm test
```

Currently no test suite exists. Genuinely thank you if you write another one.

## Review Process

Pull requests are reviewed within a week. You might be asked to:
- Add comments
- Add type definitions
- Explain your changes

## Code of Conduct

Don't be toxic. This is a bot framework, not a battleground.
