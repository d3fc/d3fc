const capitalizeFirstLetter = (str) => str[0].toUpperCase() + str.slice(1);

export default (str) => (name) => str + capitalizeFirstLetter(name);
