import identity from './discontinuity/identity';
import skipWeekends from './discontinuity/skipWeekends';
import dateTime from './dateTime';

export default {
    discontinuity: {
        identity: identity,
        skipWeekends: skipWeekends
    },
    dateTime: dateTime
};
