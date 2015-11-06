import financial from './financial';
import walk from './walk';
import {skipWeekends} from './filter/skipWeekends';

export default {
    filter: {
        skipWeekends: skipWeekends
    },
    financial: financial,
    walk: walk
};
