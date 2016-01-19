// JSON stringifies - aids debugging
function register(handlebars) {
    handlebars.registerHelper('json', function(context) {
        return JSON.stringify(context);
    });
}

module.exports = {
    register: register
};
