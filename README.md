# Emotional Video Research From SSNL at Stanford University
#### Project Description
###### This website is designed specifically for psychology study. It contains experiment, in which it will ask participants to rate the emotion expressed by the people the participants see in their videos. The rating is recording by a continuous slider that will appear below the video. After the experiment is finished, some extra questions will be shown to help researchers better understand the participants. This website is developed using React in Javascript. It can be bundled and deployed on any server. Please refer to the demo pdf for a demo layout. Any questions regarding the code, please contact `wuzhengx 'at' stanford 'dot' edu.`
#
#### Project Demo
###### https://web.stanford.edu/~wuzhengx/SSNL/EmotionalTest/build/
#### Project Side Widgets
###### This project can be connected with MTurk. The part that communicates with the MTurk is referenced from https://github.com/longouyang/mmturkey
###### For detailed Mturk side set-up, please refer to http://cocolab.stanford.edu
#
#### Develope Set-up
##### Step -1: install npm, git before you do anything
##### Step 0: go to your development directory in your local machine
##### Step 1: mkdir SSNL_workspace
##### Step 2: cd SSNL_workspace
##### Step 3: git clone https://github.com/frankaging/SSNL_Emotional_Video_Test.git
##### Step 4: cd SSNL_Emotional_Video_Test
##### Step 5: `npm install`
##### Step 6: `yarn`
##### Step 7: `npm start`
##### Step 8: Once success, the browser will automatically open a tab with url: localhost:3000
#
#### Develope Guide
##### Taking React Tutorial
###### reactjs.org/tutorial/tutorial.html
##### Highly modularized
###### All the componenets are currently living inside <App.js>. You can separate out components into different sub-files if necessary. After you separate the file, please make sure you import them correctly into <App.js>.
##### Front-end Server
###### React comes with fully-fledged nodejs server. As you run the website using npm start, it will run the server automatically.
##### Routing is missing here
###### This project specifically does not require routing. Everything will be on a single page. No going back here.
