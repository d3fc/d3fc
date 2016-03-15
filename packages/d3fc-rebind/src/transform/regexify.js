export default (strsOrRegexes) =>
    strsOrRegexes.map((strOrRegex) =>
        typeof strOrRegex === 'string' ? new RegExp(`^${strOrRegex}$`) : strOrRegex
    );
