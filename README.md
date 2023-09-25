<h2> <img src="https://user-images.githubusercontent.com/69270611/177051970-8e61d89f-2bb3-4ab7-a75e-24b2ac237dbe.svg" width="24"   />  Serial Analyzer   </h2> 


An app for analyzing serial data.

### Downloads
Visit the dedicated page on curiores.com to download the current and previous versions of the app.
<a href="https://www.curiores.com/serialanalyzer#downloads">curiores.com/serialanalyzer</a>

### Tutorial Video
&nbsp;&nbsp;&nbsp; <a href="https://youtu.be/6LcyG-hUZ2I"> <img src="https://user-images.githubusercontent.com/69270611/177990726-dfcf318a-4f1b-403b-aace-210cf5e41efa.png" width="200px"> </a>

### Working with the source
Start the app:
<br> &nbsp; &nbsp; <code>yarn electron:start</code>

Build the app:
<br> &nbsp; &nbsp; <code>yarn electron:package:win</code>
<br> &nbsp; &nbsp; <code>yarn electron:package:linux</code>
<br> &nbsp; &nbsp; <code>yarn electron:package:mac</code>

### Updates:
<b>V1.1.0</b>
* Added a record option
    * Only records the raw serial data to a text file
    * Usage:
        * Press record (●) and select the folder where you want to store your data
        * Press record again to stop recording
        * Change the folder where data should be stored using the settings drawer
    * Each time recording is stopped and restarted, a new recording file is created in the requested directory

### Notes:
1. On Windows, you must run the build as administrator, or you may receive an error during install of electorn (node install.js). This is due to an Error: EPERM: operation not permitted error for an electron cached file in the user's app data.
