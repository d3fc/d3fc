const key = '__d3fc-elements__';

export const get = (element) => element[key] || {};

export const set = (element, data) => void (element[key] = data);

export const clear = (element) => delete element[key];
