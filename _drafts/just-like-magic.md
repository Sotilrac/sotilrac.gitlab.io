---
title: Just Like Magic
categories:
  - Working Theory
tags:
  - vignette
  - robotics
  - gita
  - Piaggio Fast Forward
  - leadership
  - computer-vision
---

<!-- TODO: one of Greg Lynn's early sketches or renders of the sphere next to a photo of a shipping gita -->

{% gallery 2, "/img/blog/just-like-magic/sketch.jpg", "/img/blog/just-like-magic/gita.jpg" %}

In June 2016, I walked into a mostly empty office to interview with a robotics startup that Piaggio, the company that makes the Vespa, had announced eight months earlier. Piaggio Fast Forward had a CEO, Jeffrey Schnapp, a Chief Creative Officer, Greg Lynn, a couple of people coordinating the effort, and no engineers. What it had instead were architectural sketches: a sleek sphere, about knee height, rolling through a train station, down a sidewalk, into a lobby, coexisting with pedestrians as if it had always been there. I was captivated immediately. It looked like an enormous challenge and I knew I could do it, so I joined as the sixth person and the first electrical and software engineer, and set to work on the question the sketches left open: what would it take to make this real?

<!-- TODO: where was the office in 2016 (Cambridge? Somerville?), and who were the other five -->

## A Sphere Is Not a Shape for Carrying Things

One thing was apparent right away. A sphere is about the least stable shape you can pick for a vehicle, and this one had to carry cargo: groceries, a laptop, a bag of tools, whatever the person walking ahead of it did not want to hold. The cargo had to stay level, stay put, and stay safe when the robot braked, turned, or hit a curb cut at speed. We ended up spending as much engineering on keeping the thing upright as on everything else it did put together.

The constraint that made it hard was also the one that made the robot interesting. The robot had to move on exactly two wheels. A differential drive is wonderfully nimble, it turns in place and reverses on the spot, and a robot whose job is to follow a person through a crowd needs every bit of that agility. The textbook answer is to add a caster, a third wheel that trails behind and keeps the platform from tipping over. Greg wanted the robot to feel magical, and a caster is many things, but it is not magical. So gita (Italian for a short trip) stands on two wheels nearly as tall as itself, with the cargo bin slung between them, and balances like an inverted pendulum while the bin stays level underneath. Two of the company's patents tell the mechanical side of that story: [US 10,173,738](https://patents.google.com/patent/US10173738B2) moves a counterweight (the bin, the batteries) along a track to hold the chassis level, and [US 11,613,325](https://patents.google.com/patent/US11613325B2), with my name on it among ten others, shifts the wheel carriage itself relative to the chassis with a linear actuator. Getting either to work at 40 lb of payload, over a curb, without spilling the eggs, took most of a year of tuning.

<!-- TODO: correct the balancing description (how much was mass shifting vs. wheel torque, what the first prototype used), and the "most of a year" -->

## The Belt

We showed gita to the world on February 2, 2017, in Boston, eight months after I started. The prototype carried 40 lb and topped out at 22 mph, a number that alarmed everyone in the room, and it followed a person through a trick I am still fond of: the person wore a white belt with a stereo camera in it, the belt built a 3D map of the world as its wearer walked, and the robot compared that map with the one its own cameras were building, so it knew where you had gone even after you turned a corner. [CNET](https://www.cnet.com/tech/computing/gita-robot-piaggio-new-york-follow-carry-stuff/) called the belt a Stormtrooper costume accessory and [Wired](https://www.wired.com/2017/02/piaggio-gita-drone/) called it a crazy-looking white toolbelt; both were right, and the Wired piece has a yellow gita following me around the office to prove it.

{% youtube "akPOd3lAePI" %}

That spring the robot went to New York, to the Today Show, and to Vancouver, where Jeffrey demoed it on stage at TED2017 with a few thousand people watching a two-wheeled robot decide, in real time, whether to trust its own map. Every one of those demos was a night of not sleeping for the team, and I would do them all again.

{% youtube "COP9oBP1tTo" %}

<!-- TODO: the TED Archive upload above reports as unplayable through the API; check it in a browser, or swap for a clip you have -->

That summer it worked as a waiter at Café ArtScience in Kendall Square, serving drinks to people who had come to see a robot serve drinks, and the Boston Globe photographed it [following me around the room](https://www.gettyimages.com/detail/news-photo/cafe-gita-a-robot-follows-robot-software-engineer-carlos-news-photo/802624804).

{% youtube "0dKCjwXxXe8" %}

<!-- TODO: your own early demo videos here, gallery or youtube -->

## Three Years

Going from that sketch to a product took three years, and I learned most of what I know about mobile robots because gita needed it by Thursday: computer vision, navigation, odometry, mapping, obstacle avoidance, lidar, RealSense depth cameras, and deep learning that had to run in real time on a Jetson bolted inside a moving robot. The first prototype ran on ROS because ROS was the fastest way to get a robot moving; the product ran on a custom platform we built because ROS was not the fastest way to get one shipping. The electronics went from a stack of dev boards and a visible cooling fan to a production architecture with a real supply chain behind it, and I wrote [a lot of the documentation](/blog/mad-skills/) that let other people build on it.

<!-- TODO: one concrete technical story: the hardest bug, the night before a demo, the sensor that saved or ruined a week -->

The lesson I use every day has no sensors in it. When I joined we were six; when I left in November 2019 we were sixty, and I had hired and led the electrical, software, and robotics teams in between. I learned to build a team, to give each person a problem that was theirs and the room to solve it, and to delegate work I would have enjoyed doing myself because the robot needed ten of me and there was one. It was rough, it took a ton of work and more late nights than I would recommend to anyone, and most of those people are still the ones I would call first.

<!-- TODO: a name or two, a story about someone you hired who surprised you -->

## Still Rolling

gita went on sale on November 18, 2019, at $3,250. The belt was gone, replaced by cameras that follow your legs, and the top speed had come down to 6 mph, which is the speed people actually walk. [The Verge](https://www.theverge.com/2019/10/15/20897348/piaggio-vespa-gita-cargo-robot) wrote that it was not autonomous anymore, and they were right in a way that I think misses the point: it never needed to be autonomous, it needed to keep up with you. A smaller [gitamini](https://piaggiofastforward.com/blog/introducing-gitamini) followed in 2021, a [gitaplus](https://piaggiofastforward.com/blog/meet-the-newest-robot-gitaplus) with radar in 2022, and in 2026 you can still [buy one](https://piaggiofastforward.com/shop), in a Grogu edition if you want, for $2,475. The company I left is still there, Greg runs it now, and the following technology has made its way into Piaggio's motorcycles.

Is it practical? No. It costs as much as a good e-bike, it cannot climb stairs, and it will happily follow you into a room it cannot get out of. But when it stands up on its two wheels, no caster in sight, and rolls out the door behind you with your groceries, it is magical.

<!-- TODO: closing photo -->

## References

- [Piaggio Group announcing Piaggio Fast Forward, October 2015](https://www.piaggiogroup.com/en/archive/press-releases/piaggio-group-announcing-piaggio-fast-forward)
- [Piaggio's Cargo Robot Uses Visual SLAM to Follow You Around, IEEE Spectrum](https://spectrum.ieee.org/piaggio-cargo-robot)
- [The Cute Robot That Follows You Around and Schleps All Your Stuff, Wired](https://www.wired.com/2017/02/piaggio-gita-drone/)
- [It's personal: the talks of Session 9 of TED2017, TED Blog](https://blog.ted.com/its-personal-the-talks-of-session-9-of-ted2017/)
- [Your robot will serve you now, and might make deliveries, too, Boston Globe](https://www.bostonglobe.com/business/2017/06/27/your-robot-will-serve-you-now-and-might-make-deliveries-too/oUrNkBYsh4treDqNLyr4UP/story.html)
- [Piaggio Fast Forward Introduces the All-New gita Robot, October 2019](https://www.globenewswire.com/news-release/2019/10/15/1929794/0/en/Piaggio-Fast-Forward-Introduces-the-All-New-gita-Robot.html)
- [How gita follows you, Piaggio Fast Forward](https://piaggiofastforward.com/blog/how-gita-follows-you)
- [Two-Wheeled Vehicle Having Linear Stabilization System, US 11,613,325](https://patents.google.com/patent/US11613325B2)
