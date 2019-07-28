# Description #
This tool works for both testing server and live release server.
# Usage #
## Starting Server ##
Below command will start a internal server and open an application page in the browser.  
```md
npm run start -- [port(required)]
```
## Making a Request ##
### Instruction ###
Logging in the CSCA page first to get cookie.  
Copy the the session field of the cookie and paste it into the 'Session Cookie' field.  
Congigure the detail of testing request.  
Click send button to fetch response.  

# Live Server #
This project has deployed to heroku: https://nctu-csca-testing-tool.herokuapp.com/
