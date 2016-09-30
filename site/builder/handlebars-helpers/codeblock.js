// used for including example code into the website. If the code has '//START' and '//END' comments
// only the code within those comments is included.
function register(handlebars) {
  handlebars.registerHelper('codeblock', function(text) {
    var matches = text.match(/\/\/START[\r\n]*((.|[\r\n])*)\/\/END/);
    return matches ? matches[1] : text;
  });
}

module.exports = {
  register: register
};
