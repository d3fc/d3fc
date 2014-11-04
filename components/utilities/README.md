#sl.utilities.dataGenerator

This component will generate some 'fake' data to use when developing charts using these components. 

###Properties:

####mu

Used to specify the ... TBC

###Methods:

###Return Value:

The function returns an array of objects each of which contains the following members:

+ *date*: The date and time of the data point
+ *open*: The open price
+ *close*: The close price
+ *high*: The maximum price reached in this period
+ *low*: The minimum price reached in this period
+ *volume*: The total market volume for this period

###Example Code:

	var data = sl.utilities.dataGenerator()
	  .mu(0.1)
	  .sigma(0.1)
	  .startingPrice(100)
	  .intraDaySteps(50)
	  .fromDate(new Date(2013, 10, 1))
	  .toDate(new Date(2014, 10, 30))
	  .generate();

----

#sl.utilities.weekday

Information and code examples here

----