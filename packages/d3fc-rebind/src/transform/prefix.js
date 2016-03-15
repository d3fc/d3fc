const capitalizeFirstLetter = (str) => str[0].toUpperCase() + str.slice(1);

export default (prefix) => (name) => prefix + capitalizeFirstLetter(name);
