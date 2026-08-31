---
layout: layouts/post.njk
author: Carlos
title: The Sign on the Bike Path
categories:
  - Robotics
tags:
  - electronics
  - control
  - python
---

There's a radar speed sign on the path I ride most weekends. It reads YOUR SPEED across the top, but it never tells you what your speed is: the whole display is a face, green and smiling if you're under the limit, yellow and frowning if you're over. At 15 it's cheerful and at 30 it's disappointed, which is about as much as it can say. Ride at exactly the limit, though, and the sign comes apart: the face strobes between green and yellow several times a second, and what was supposed to be feedback turns into a novelty light show. I have, for research purposes, held that speed for an embarrassing length of time.

{% fig "/img/blog/the-sign-on-the-bike-path/speed_sign.png", "The genre, if not my particular offender." %}

Somewhere inside that sign is a comparison that looks like this:

```python
def face(speed):
    return HAPPY if speed < LIMIT else UNHAPPY
```

There's nothing wrong with the line, except that the radar hands it an estimate. Every reading carries a few tenths of a km/h of noise, so when the true speed sits on the limit, every new reading lands on whichever side the noise picked. At twenty readings a second, that's twenty coin flips a second, and the face follows all of them.

## Two Trip Points Instead of One

The fix is as old as the Schmitt trigger: give the comparison two trip points and a memory of which side it's on. The sign turns yellow when you cross the upper point and doesn't turn green again until you drop below the lower one, which leaves a band in the middle where nothing happens at all.

```python
HI, LO = 21.8, 18.2  # km/h


class Sign:
    def __init__(self):
        self.happy = True

    def update(self, speed):
        if speed > HI:
            self.happy = False
        elif speed < LO:
            self.happy = True
        return self.happy
```

The design rule is that the deadband has to be wider than the noise, and here it isn't close: a few tenths of a km/h of jitter inside a 3.6 km/h band never reaches either edge. I simulated a minute of readings at 20 Hz with the rider pinned at exactly 20 km/h, and the hard threshold changes the face 569 times while the version above changes it zero times. The rider sees a sign that picked a side and stayed there, and the side it picked is the one they earned on the way in.

## Adding a Dwell Time

The band only helps while it stays wider than the noise. A cheaper sensor, a bad mounting angle, or a car drifting through the edge of the beam will swing the readings by more than 3.6 km/h, and at that point the flip-flop comes back: rerun the same minute with 2.5 km/h of noise and the deadband alone gives 293 changes. The band handles noise in amplitude, and what's left over has to be handled in time.

```python
DT, TAU = 0.05, 0.5  # seconds per reading, seconds of smoothing


class Sign:
    def __init__(self, speed=0.0):
        self.filtered = speed
        self.happy = True

    def update(self, speed):
        self.filtered += (speed - self.filtered) * (DT / TAU)
        if self.filtered > HI:
            self.happy = False
        elif self.filtered < LO:
            self.happy = True
        return self.happy
```

The first-order filter means a reading has to persist for roughly a second before the sign believes it, which takes the noisy minute back to zero changes. It's also better feedback: the face now reports how you're riding rather than what one sample happened to say.

## One Bad Reading

A deadband has memory, and memory can be poisoned. Ride at a comfortable 19 km/h and let a car pass through the beam once: the sign reads 60, sails over the upper trip point, latches to the yellow face, and stays there forever, because 19 km/h never drops below the lower one. In simulation, one 60 km/h outlier every two seconds leaves the sign scolding an innocent rider for 94% of the minute. Low-pass filtering makes that worse instead of better, since the outlier drags the average up and the filter holds it up there: 98%.

The remedy is to bound how far any single reading can move the decision. Clamp the input, take a median of the last few samples, or squash the speed through a saturating curve before it reaches the filter, so that 60 km/h and 25 km/h both mean the same thing to the sign and a single spike can only nudge the filter by one step. A clamp, a five-sample median, and a saturating curve all leave the face green for the entire minute.

<!-- TODO: link the sigmoids post here once it's published -->

The whole sign has one bit of output, and getting that one bit to sit still takes two trip points, one bit of memory, a time constant, and a limiter on the input. The rest is remembering that the number arriving from the sensor is a guess at the speed rather than the speed itself.
