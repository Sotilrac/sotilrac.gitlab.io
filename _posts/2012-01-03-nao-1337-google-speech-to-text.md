---
layout: layouts/post.njk
status: draft
published: true
title: Nao 1337 uses Google Speech-to-Text Service
author: Carlos
id: 1125
wordpress_url: http://carlitoscontraptions.com/?p=1125
date: 2012-01-03T01:01:13-05:00
date_gmt: 2012-01-03T05:01:13-05:00
categories:
- My Projects
- Robotics
tags:
- Nao
- Aldebaran
- Speech Recognition
---
\[caption id="attachment_1126" align="aligncenter" width="300"\][![Google Chrome Speech-to-Text](http://carlitoscontraptions.com/wp-content/uploads/2012/01/google-chrome-speech-to-text-300x237.png "Google Chrome Speech-to-Text")](http://carlitoscontraptions.com/wp-content/uploads/2012/01/google-chrome-speech-to-text.png) Google Chrome Speech-to-Text\[/caption\]

I created a behaviour for Nao that used the same speech-to-text services found in Android devices and google chrome to translate spoken words into text. It works better than the standard speech recognition engine and can be used for many more things. I'm eager to see what other Nao developers do with it.

See a quick demo of the speech recognition:  

{% youtube "lb2usV4vGWU" %}

Nao developers can find the code [here](http://developer.aldebaran-robotics.com/projects/google-speech-to-text/).

For those who want to try it on their (Linux) computers, here you have a command that will record 5s of sound, encode it in Flac format and send it to google. Then it will right Google's response in a txt file.

```bash
arecord -f cd -t wav -d 5 -r 16000 | flac - -f --best --sample-rate 16000 -o out.flac; wget --post-file out.flac --header="Content-Type: audio/x-flac; rate=16000" -O speech.txt http://www.google.com/speech-api/v1/recognize?lang=en
```

I have to thank [Mike Pultz](http://mikepultz.com/2011/03/accessing-google-speech-api-chrome-11/) to be the inspiration for this.