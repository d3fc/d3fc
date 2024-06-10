module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [(message) => /Signed-off-by: dependabot\[bot]\s+<support@github\.com>$/m.test(message)],
}