const path = require("path");
const fsExtra = require("fs-extra");

exports.onCreateNode = ({ node }, pluginOptions) => {
  const dirname = process.cwd();
  const { desiredFilenames } = pluginOptions;
  const source = path.join(dirname, '..', '..', 'examples');

  const sourceNormalized = path.normalize(source);
  if (node.internal.type === "File") {
    const dir = path.normalize(node.dir);
    if (
      dir.includes(sourceNormalized) &&
      !dir.includes("__tests__") &&
      desiredFilenames.includes(node.base)
      ) {
      const relativeToDest = dir.replace(sourceNormalized, "");
      const newPath = path.join(dirname, "public", relativeToDest, node.base);

      fsExtra.copy(node.absolutePath, newPath, err => {
        if (err) {
          console.error("Error copying file", err);
        }
      });
    }
  }
};
