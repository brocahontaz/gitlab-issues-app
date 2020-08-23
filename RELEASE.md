# Release

In this file, you indicate the status of your assignment by checking the checkboxes below. No unchecked checkboxes are allowed in the document when your hand in for the assessment.

## Release status

_To make a release that will be assessed by the examiner you need to make sure all checkboxes below are checked. You check a checkbox by adding a "x" within the brackets._

- [x] I have started working on the assignment.
- [x] `npm install` is being used to install all dependencies.
- [x] `npm start` is being used to start the application.
- [x] All functional requirements are fulfilled.
- [x] All Production requirements are fulfilled.
- [x] All non-functional requirements are fulfilled.
- [x] I have completed the assignment report (see below).

---

- [x] I intend to submit the assignment and at the same time I guarantee that I am the one who created the code that is submitted. In cases where I use external libraries or borrowed code from other sources, the source is clearly stated.
(_Jag avser göra en inlämning av uppgiften och jag garanterar samtidigt att jag är den som skapat koden som lämnas in. I de fall jag använder externa bibliotek eller har lånat kod från andra källor så är källan tydligt angiven._)

---

## Assignment report

### URL to your application

https://cscloud6-97.lnu.se/

### Security

The gitlab webhook is controlled by checking the header on received POSTS, checking that the secret token is the same that I specified in my .env file. The application is also only reachable through https, redirecting any regular http-requests to https. Everything that is secret (tokens etc) are stored in the .env file and not hardcoded in the source code.

### Description of entities

- Reversed proxy
I used the nginx reversed proxy to direct traffic to the application. I configured it to direct any traffic on port 80 (http) to port 443 (https), then the traffic is directed to the port the app is running on, port 3000. The nginx server is also handling the TLS certificate.
- Process manager
I am using pm2 to deploy the app on the server, making sure that the application restarts if crashing and is (hopefully) always running.
- TLS certificates
I used certbot to create a proper TLS certificate with the help of letsencrypt, using this certificate in my nginx server, to make the traffic properly encrypted. 
- Environment variables
I am using the .env file to store environment variables, to be able to not write them in plain text (secret tokens etc). On the server I use NODE_ENV=production in the pm2 script to start the application in production mode.
_

### Development vs. Production

The main, and probably only, difference when running this application in the production mode is that Express in running in production mode. When Express is in production mode, the view templates and css files are cached, and it generates less verbose error messages. Overall it is supposed to increase the app performance. But when in development, it would be obnoxious to have this caching enabled.

Another difference is that all the devDependencies, such as the linting tools, nodemon etc are not installed/run in production mode.

### Use of external dependencies

I used the following external dependencies:
- dotenv
To handle the .env file easier.
- moment.js
To get nicely formatted dates.
- morgan
For logging.
- node-fetch
To grab data from the gitlab api.
- socket.io
To create a websocket between the server and client for transfering of data in realtime.

All of the above are well-known and secure frameworks.

### Overall Reflection

Just like the previous assignment in this course, assignment 2, I really really enjoyed this one. As I already had some experience with Express now due to the previous assignment it was more straightforward getting to work with it. I haven't really worked with websockets like this before, but "only" on the client side. So it was really fun setting it up on the server side and learning how it works.

Fetching the data via the api felt pretty straightforward, and also then displaying it. It only took some time to structure everything nicely with the layout etc. The same can be said about getting the webhook to work, altough I had to read up a bit about how it worked.

I think the "hardest" part was realizing how to send the data from the webhook further via the socket to the client. Then I figured out how to do it with a middleware, using the next() functionality in express, and then emitting the event when catching it with the middleware. That felt satisfying to finally figure out. Then it took some time to look through all the data available, figuring out how to "filter it" properly and just emit the data that I wanted to the client, as well as making sure I had checks for the different types of notifications.

Overall it was super fun working with both Express, the frontend, API calls and realtime updates with websockets, creating a pretty cool (albeit still simple) site.

Another note is that learning how to use git to update the code on the server was also very educative, as I have never done that before. I had some issues before I got it to work, but that just meant doing a bit more research about it and I learned a lot.

### Further improvments

I would have liked to expand the application further, by using OAuth, allowing users to login and dynamically choose repositories to watch. And also adding the functionality to control the issues through this webapp.

### Extras

Not much extra. I made sure to sort the issues in the list by latest updated, and also update this sorting in realtime when receiving data through the socket.
And I also think the layout/design of the app turned out pretty good. I added links to the users, and issues, and getting/displaying avatars for the users.

### Feedback

Like already mentioned, it is a really fun and educative assignment. I enjoy that it incorporates different techniques that makes for a cool whole project. I feel like I will definitively have use for what I have learned in both this and the previous assignment, and it makes me excited to try building some own projects with these techniques in the future (I have had some ideas for a while where express, websockets etc would really fit well).
