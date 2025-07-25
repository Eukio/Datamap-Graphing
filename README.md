# Performance Chart (Test App)
## Using React with TypeScript, graph display of thermostats performance metrics overtime for the Daikin One Dealer Admin Portal
The purpose of this project is to aid support team users by creating a performance chart display for a thermostat within the Daikin One Dealer Admin Portal.


https://github.com/user-attachments/assets/70207419-1b2c-4925-b289-758492a09368


## Graph
- X- axis is time (with second resolution)
- Allow for two Y-axis based on values graphed on the axis
- Allow for zoom/pan
- Allow to reset to the default settings
- Tooltip with label and value for all lines on graph, including timestamp
- Uses Apache Echarts library to render data onto graph
- Each data point has a different line color corresponding to legend 
- Legend allows for selecting/deselecting data variables to display on the graph
## List 
-  Each item displays name and tooltip description of the datamap variable
- Tooltip for description of variables 
- Selects up to 10 variables at a time
- Uses React Window library to improve rendering 
- List designed from components in Material UI library 
## Data Filtering
- Filters and searches over 19000+ datamap timestamp datapoints from csv file with D3.js  
- Reads from a xlsx to parse over 5000+ variables name and description of datamap variables with Sheet.js
