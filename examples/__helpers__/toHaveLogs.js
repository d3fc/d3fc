const messages = [];

page.on('console', async msg => {
    const args = await Promise.all(msg.args().map(arg => arg.jsonValue()));
    messages.push({
        type: msg._type,
        args
    });
});

exports.toHaveLogs = function(received) {
    expect(page).toEqual(received);
    return {
        pass: messages.length !== 0,
        message: () => {
            if (messages.length === 0) {
                return `There were no messages logged.`;
            }
            const formattedMessages = messages.map(
                ({ type, args }) => `${type}: ${args.join(',')}`
            );
            return `The following messages were logged - \n${formattedMessages.join(
                '\n'
            )}`;
        }
    };
};
