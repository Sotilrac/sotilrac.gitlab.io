---
layout: layouts/post.njk
status: draft
author: Carlos
title: "Bump it, Bro: Designing Through Constraint"
date: 2026-04-09T12:00:00-04:00
categories:
  - Info
tags:
  - lore
  - vignette
  - robotics
  - NAO
  - Pepper
  - Aldebaran
  - HRI
---

{% gallery 2, "/img/blog/bump-it-bro/IMG_20141211_161927.jpg", "/img/blog/bump-it-bro/cnne-180666-150622133225-pepper-robot-hugs-girl.webp"%}

From late 2011 through mid-2016, I worked at Aldebaran, the French robotics company behind NAO and Pepper, two of the most widely deployed humanoid robots in history. I started as an external developer in Montreal building autonomous behaviors for NAO, and eventually joined the Boston Studio as a robot software engineer. The company's story since then has been turbulent in ways that may resonate with other people in the industry.

The company has since been acquired, rebranded, sold, and placed into receivership. The name has changed four times and the Paris headquarters emptied out. But roughly 20,000 NAO and 27,000 Pepper units were sold to more than 70 countries, and many of the interaction behaviors I helped develop are still running on them. The robots outlasted the company that made them, which is either a testament to good engineering or a quiet indictment of the business models built around them.

My job in Boston was to make these robots engaging to interact with. NAO and Pepper were capable machines, especially for their time, but, like all robots, constrained by the energy and size limitations that result from needing to move and exist in the physical world. The processor was an Intel Atom, roughly comparable in single-thread performance to what you would find in a budget netbook circa 2013. For context, the phone in your pocket today has perhaps ten times the processing power, dedicated neural accelerators, and multiple high-resolution cameras with hardware-accelerated depth sensing. The robots had a single RGB camera (Pepper later added a depth sensor roughly equivalent to a first-generation Kinect). The tactile sensors in the hands were unreliable on a good day. The motors could not command much torque given thermal and battery limitations. The whole system ran on Gentoo Linux (a very configurable flavour that could be pared down to the bare minimum it needed), with a middleware called NAOqi, and we wrote behaviors in Python 2.7 on top of that stack.

|                        | NAO V5 (2014)                     | Pepper (2015)                                        |
| ---------------------- | --------------------------------- | ---------------------------------------------------- |
| **Height / Weight**    | 58 cm / 5.4 kg                    | 120 cm / 28 kg                                       |
| **CPU**                | Intel Atom Z530, 1 core, 1.6 GHz  | Intel Atom E3845, 4 cores, 1.91 GHz                  |
| **RAM / Storage**      | 1 GB / 2 GB flash + 8 GB SD       | 4 GB / 32 GB eMMC                                    |
| **Battery**            | 21.6 V Li-Ion, ~49 Wh, ~90 min    | 26.5 V Li-Ion, 787 Wh, 7-20 hrs                      |
| **Degrees of freedom** | 25                                | 20 (+ 3 omnidirectional wheels)                      |
| **Cameras**            | 2x 1.3 MP RGB, no autofocus       | 2x 5 MP RGB + stereo pair + depth (structured light) |
| **Depth sensor**       | None                              | ASUS Xtion-based, structured-light IR                |
| **Touch sensors**      | 7 (head, hands, feet)             | 5 (head, hands)                                      |
| **Sonar**              | 2 emitters + 2 receivers, 0.2-3 m | 2 in base, 0-3 m                                     |
| **Microphones**        | 4                                 | 4                                                    |
| **Speakers**           | 2                                 | 2 (+ tablet stereo)                                  |
| **Tablet**             | --                                | 10.1" IPS, 1280x800, capacitive touch                |
| **Laser**              | --                                | 6 (in base, Class 1M)                                |
| **OS**                 | Gentoo Linux / NAOqi 2.1          | NAOqi OS (Linux) / Android 4.0 tablet                |
| **Connectivity**       | WiFi a/b/g/n, Ethernet            | WiFi a/b/g/n, Gigabit Ethernet, BT 4.0 LE            |

The natural instinct is to try to overcome these constraints by building more efficient perception, writing smarter tracking algorithms, and using better sensors. But that path leads to a bloated system that is at best prohibitively expensive and still doesn't come close to human-level capabilities. What I learned instead is that the best interaction design does not fight a robot's limitations; it recruits the human.

## Daps

<blockquote>
  The only way of knowing if a word is a <strong>real word</strong> in English is for it to be in a song.
</blockquote>

One of my main projects was developing a suite of physical social interactions: fist bumps, handshakes, high (and low) fives, and hugs. We called it [_Daps_](https://open.spotify.com/track/3chDozhup5tVqpL2I7yuHA), which turns out to be a real word.

These are gestures so deeply ingrained in human social behaviour that everyone has very specific, very high expectations for how they should feel. A limp handshake from a person is off-putting; likewise for a weak handshake from a robot. Why had I never stopped to think what my body actually does during a fist bump?

Consider: when someone extends a fist toward you, your visual cortex identifies the gesture and its social meaning in a fraction of a second. Your binocular vision triangulates the position of the fist in three-dimensional space. Your proprioceptive system knows where your own hand is without looking at it. Your motor cortex plans a trajectory, your shoulder and elbow and wrist execute it in a smooth coordinated motion, and your somatosensory system provides real-time feedback so you can adjust mid-flight as the target shifts. You modulate force on contact through haptic feedback loops running below your conscious awareness. You do all of this while, simultaneously, maintaining eye contact, reading the other person's expression, and generating an appropriate verbal response. The whole sequence takes about a second.

Now all we need to do is replicate all this on the Intel Atom with a single camera, no depth information, unreliable sensors, and overheating motors... Or, the robot could put out its fist and say, _"Bump it, bro."_

{% youtube "K5KXGszMwMI" %}

The human knows exactly what to do. The person finds the robot's fist, adjusts their own trajectory, and makes contact. From the robot's side, the entire sensing problem reduces to detecting a minor displacement in the end effector. No vision. No trajectory planning. Just good interaction design and a couple of quippy lines that feel genuine.

The robot still has a job to do, though. The moment contact is detected, it has to complete the gesture, and the timing of that completion is what sells the whole interaction. For a fist bump, the robot opens its fist into an explosion. For a high five, it snaps into a follow-through on impact. For a handshake, it grips. For a hug, it presses gently. Too slow and the moment is dead. Too forceful and it feels wrong. Initiate, wait, complete. Every gesture in Daps followed that three-phase structure, and all the compute I saved by not doing vision went into making the third phase feel right.

## On stage

I was backstage at the 2015 Clinton Global Initiative when Pepper ran Daps on stage with Neil deGrasse Tyson. The robot complimented his vest, cracked a pun about his style being "out of this world," and then asked him for a hug. Tyson opened his arms without a second of hesitation. The clip went everywhere. What made it work was that the robot knew how to ask, and knew what to do the instant someone said yes.

I ran most of the high-profile demos in that period. At WSJD Live in Laguna Beach, Pepper performed for Tyra Banks and will.i.am. Buzz Aldrin visited our Boston office once. The man had walked on the moon, and here he was fist-bumping our robot. He seemed delighted.

{% gallery 4, "/img/blog/bump-it-bro/giphy.gif", "/img/blog/bump-it-bro/IMG_20151019_140015.jpg", "/img/blog/bump-it-bro/D41_DSC_2669.jpg", "/img/blog/bump-it-bro/D41_DSC_4815-ANIMATION(1).gif" %}

Working on the hug behavior taught me things about human physical interaction that I had never consciously considered. Are you an over-arm hugger or an under-arm hugger? Do you go crisscross, one arm over and one under? Do you pat or squeeze? When is the hug done? These are choices people make instantaneously and unconsciously, but a robot has to have a very specific opinion about them.

We settled on a wide-open posture that let the human choose their preferred style. The robot presented an invitation, arms wide, and when it sensed the person leaning in, it responded with a gentle press. That was enough. The human filled in the rest with their own muscle memory, their own expectations of what a hug should feel like.

## You already know how

{% youtube "kr05reBxVRs" %}

Daps was about greeting. Would the same trick work for the much harder problem of co-navigation?

Walking alongside another person is something you do without thinking, but the underlying computation is staggering. You continuously estimate the other person's velocity and heading from peripheral vision. You predict their trajectory several steps ahead. You adjust your own gait, pace, and stride length in real time. You negotiate doorways, corners, and crowds through subtle body language cues that neither of you could articulate if asked. Two people walking together are running a real-time distributed control system, and they do it while carrying on a conversation about lunch.

Getting a robot to participate in this is deeply complex, and it is equally hard to design a natural interface for a person to instruct a robot where to go: joysticks feel clinical, voice commands are imprecise, and waypoint systems require too much setup.

But everyone already knows how to guide someone through a space: you hold their hand.

By having the robot extend its hand and inviting the human to take it, I could map the displacement in the robot's extended arm to infer directional intent. The key was reducing the joint torque at the end effector so that the hand could be compliantly pulled, offering gentle resistance rather than rigid opposition. The human leads, the robot follows, and the input mechanism disappears entirely because it does not feel like an input mechanism.

Something even more unexpected happened. When people held the robot's hand, they slowed down, steered around obstacles more carefully, and they looked back to check on it. The dynamic was unmistakable: a parent holding a child's hand. People became considerate of the robot's limitations in ways no algorithm could have enforced, because the physical interface made them feel responsible for something smaller and slower than themselves.

{% gallery 4, "/img/blog/bump-it-bro/IMG_20160119_133852.jpg", "/img/blog/bump-it-bro/IMG_20151020_175811-ANIMATION.gif", "/img/blog/bump-it-bro/IMG_20160424_163540.jpg", "/img/blog/bump-it-bro/IMG_20160425_142400.jpg" %}

I work on exoskeletons now. Different robots, same question: where does the machine end and the person begin?

Aldebaran is gone, at least in the form I knew it. The office in Boston closed. The Paris headquarters changed hands and then changed hands again. The name has been through more owners than some of the robots. But somewhere, in a university lab or a hospital lobby or a classroom in a country I have never visited, a NAO robot is extending its fist and waiting. Don't leave him hanging.

{% fig "/img/blog/bump-it-bro/IMG_20141119_123954.jpg", "NAO, ready for anything" %}

## References

- [Pepper, el robot con emociones, se vende en cuestion de un minuto](https://cnnespanol.cnn.com/2015/06/22/pepper-el-robot-con-emociones-se-vende-en-cuestion-de-un-minuto/)
- [Neil deGrasse Tyson hugs Pepper at the Clinton Global Initiative](https://www.huffpost.com/entry/neil-degrasse-tyson-hug-robot-clinton_n_56099f59e4b0dd850308af82)
- [How Aldebaran Robotics built its friendly humanoid robot, Pepper](https://spectrum.ieee.org/how-aldebaran-robotics-built-its-friendly-humanoid-robot-pepper)
- [Aldebaran placed into receivership](https://www.therobotreport.com/aldebaran-pepper-nao-robots-receivership/)
- [NAOqi developer guide](http://doc.aldebaran.com/2-5/index_dev_guide.html)
- [WSJD Live photos, October 2015](https://www.gettyimages.com/photos/wsjd-live?page=2)
- [Pepper demo video](https://www.youtube.com/watch?v=SchCBiUH1ZI)
