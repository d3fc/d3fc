function register(handlebars) {
  handlebars.registerHelper('first', function(array, data) {
    return data.fn(array[0]);
  });
}

module.exports = {
  register: register
};
