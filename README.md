# Hypertube


## Contents

- [Introduction](#introduction)
- [Stack](#stack)
- [Manual](#manual)
- [Preview](#preview)
- [Demo](#demo)
- [General guidelines](#general-guidelines)
- [Bonus](#bonus)
- [Subject](#subject)

# Introduction

This project proposes to create a web application that allows the user to research and
watch videos.

The player will be directly integrated to the site, and the videos will be downloaded
through the BitTorrent protocol.

The research engine will interrogate multiple external sources of your choice, like for
example http://www.legittorrents.info, or even https://archive.org.

Once the element selected, it will be downloaded from the server and streamed on the
web player at the same time. Which means that the player won’t only show the video
once the download is completed, but will be able to stream directly the video feed.

# Stack
- **Back:**

>Node.js express micro-framework, 
>
>MongoDb with mongoose ORM
>Torrent-stream
> 
>FFMPEG
>
>API calls

- **Front:**

>React Js with webpack, react-dom-router
>
>Styled components
>
>Material-UI

# Manual

***1. Prepare DB***

Install MongoDB compass and connect to:
```
mongodb://127.0.0.1:27017/
```

***2. Clone the repo***
```
$> git clone https://github.com/lsoulima/Hypertube.git
$> cd Hypertube
```

***3. Run Server***

- Front-End:
```ps
$> cd client
$> npm i
$> serve -s build -p 3000
```
Then go to ```http://localhost:3000``` in your Browser.

- Back-End:
```ps
$> cd server
$> npm i
$> npm start
```
***Documentation***

In your browser go to : 
```
http://localhost:3001/api/documentation
```

# Preview


<img width="1710" alt="landing" src="https://user-images.githubusercontent.com/47644158/115154002-40d9f180-a068-11eb-8193-b2a2a75f01af.png">
<img width="1497" alt="register" src="https://user-images.githubusercontent.com/47644158/115246293-480b0900-a115-11eb-91a6-eaf0aeacf659.png">
<img width="1700" alt="login" src="https://user-images.githubusercontent.com/47644158/115246845-c667ab00-a115-11eb-9d97-9b13e3c4d18c.png">
<img width="1705" alt="profile" src="https://user-images.githubusercontent.com/47644158/115154065-83033300-a068-11eb-8676-e426ac50e7e7.png">
<img width="1708" alt="edit" src="https://user-images.githubusercontent.com/47644158/115154096-9dd5a780-a068-11eb-8590-9b2f93e5df36.png">
<img width="1693" alt="browse" src="https://user-images.githubusercontent.com/47644158/115153992-33246c00-a068-11eb-970c-dc5960e6f2eb.png">
<img width="1707" alt="search filter" src="https://user-images.githubusercontent.com/47644158/115154086-944c3f80-a068-11eb-8c13-e4b3fed309a7.png">
<img width="1696" alt="stream1" src="https://user-images.githubusercontent.com/47644158/115154089-96160300-a068-11eb-92ce-20d152a0a714.png">
<img width="1693" alt="stream2" src="https://user-images.githubusercontent.com/47644158/115154032-60711a00-a068-11eb-9256-25943efaebb7.png">
<img width="1687" alt="stream3" src="https://user-images.githubusercontent.com/47644158/115154041-6830be80-a068-11eb-8e88-8a0489b9920b.png">
<img width="1685" alt="stream4" src="https://user-images.githubusercontent.com/47644158/115154044-69fa8200-a068-11eb-8e9f-7c6f7e023cc4.png">


# Demo


[Hypertube Demo in Youtube](https://youtu.be/PkGFbFIp0DA)


# General guidelines

All the framework, micro-framework, libraries etc. . . are authorized within the
limits where they are not used to create a video stream from a torrent, thus limiting
the educational purpose of this project. 

:warning:  For example, libraries such as webtorrent,
pulsar and peerflix are forbidden.

:iphone:  Your website must be usable on a mobile phone and keep an acceptable layout on
small resolutions.



# Bonus
- [x] Add additional Omniauth policies.
- [x] Manage different video resolutions.
- [x] API RESTful.
- [x] Delete Comment.

# Subject
[subject.pdf](https://github.com/lsoulima/Hypertube/files/6331781/subject.pdf)
