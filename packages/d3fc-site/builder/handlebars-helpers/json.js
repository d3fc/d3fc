// JSON stringifies - aids debugging
function register(handlebars) {
  handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context, null, 2);
  });
}

module.exports = {
  register: register
};
