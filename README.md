Configuration Management Panel is a web application providing a panel and backend servers. The application managers can sign in to the application and configuration details are displayed on the panel. In my application, configuration details include parameter key, value, description and create date fields since they are given in the provided example images. Application managers can add a new configuration, edit any field of the configuration or delete a configuration. For the implementation of the project, React.js is used for the client-side, Node.js and Express are used for the server-side of the application. Firebase auth is used for the authentication. Firestore database service is used to store the configurations of the application.

To run the application:
- You should run "npm start" in the project directory,
- In a new terminal, you should change the directory to server and run "npm run dev".

Also, some packages need to be installed. Make sure you have already installed firebase-admin, react-firebase-hooks, nodemon, express, react-router-dom, firebase, axios and react-icons

To test the application throughout my implementation process, I added a user to Firebase Authentication. Only the users who have been added there can sign in to the application. If you want to sign in to the application, I'd be glad to add a new user to Firebase Authentication. Also, by simply configuring the firebase configuration json in the index.js file and adding a ServiceAccountKey.json file into the base directory, you should be able to login and use the application.
