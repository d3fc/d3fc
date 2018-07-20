import changeCase from 'change-case';

function register(handlebars) {
  handlebars.registerHelper('paramcase', function(string) {
    return changeCase.paramCase(string);
  });
}

module.exports = {
  register: register
};
