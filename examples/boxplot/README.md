# Boxplot

This charts renders the fork-to-star ratio for 7,000 GitHub repositories, with the results grouped by language.

For each language a box plot is used to summarise the underlying distribution of the data. Each repository is also rendered using a point series. Typically an ordinal scale would be used to represent language, however, in this case we want to add some 'jitter' to each point in the series, as a result, a linear scale is used instead. The decorate pattern is used to rotate the labels on the x axis.