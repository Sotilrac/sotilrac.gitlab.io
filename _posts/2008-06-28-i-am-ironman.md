---
layout: layouts/post.njk
status: public
published: true
title: I am Iron Man
author: Carlos
id: 51
wordpress_url: http://carlitoscontraptions.com/?p=56
date: 2008-06-28T17:14:00-04:00
date_gmt: 2008-06-29T00:14:00-04:00
categories:
- My Projects
tags:
- Electronics
- Craft
- Ironman
---
When I saw the new Iron Man movie, I instantly knew I had to build some part of the suit (I like to wear gadgets). Luckily for me, I found an old hard drive that had just the pieces I needed for building a repulsor-like LED flashlight.

{% fig "ironman1.jpg", "" %}

(This picture comes from [IDontLikeYouInThatWay.com](http://www.idontlikeyouinthatway.com/pictures/20080505/iron man premiere/big_ironman1.html))

## Objective

To build a very powerful LED flashlight mounted on my hand palm that would turn on and produce brighter light as I move my hand back (and the angle between my hand and my arm decreases and gets roughly to 90°). Also, the flashlight should be comfortable, allow my hand to move freely, be very sturdy, and of course look as much as possible like the repulsor Tony Starks wears on the picture above.

For those who have not guessed yet, this is what [I was building](http://carlitoscontraptions.blogspot.com/2008/05/what-am-i-building.html).

{% fig "ss851627.jpg", "" %}  
Materials

*   An old (aluminum) heat sink (from a broken computer monitor I believe)
*   A long and thin aluminum piece from a copy machine
*   A street cleaner brush bristle (like the one used to build a [Bogota Rake](http://carlitoscontraptions.com/2006/12/bogot-rake/ "Bogota Rake"))
*   An aluminum disk and a thick aluminum ring (they were the holder and separator for the plates on a very old hard drive)
*   6 [5 mm](http://alan-parekh.vstore.ca/product_info.php/cPath/4_6/products_id/14) and one [10 mm](http://alan-parekh.vstore.ca/product_info.php/cPath/4_9/products_id/36) ultra bright LEDs
*   A linear potentiometer (from an old sound system equalizer)
*   A switch
*   An old laptop battery
*   Some cable, some female and male headers, heat shrink tubing, a paperclip, a plastic cable tie, and lots of love.

## How to do it

Since my materials are pretty specific and it is quite unlikely that some reader may get the exact same set of materials, I won't give a detailed description of how it is built, but rather how I did some of the key parts of this contraption.

Shaping and shining the metal:  
Since the heat sinks and the other piece of metal I found were not flat (they had many 90° bends) I hammered them on a piece of thick steel until they became perfectly flat. Then, they were sanded with a fine sand paper and polisher until they were nice and shiny with some steel wool (the kind used for cleaning). I always sand and rub the metal along the same direction so it gets a consistent brushed look .

{% fig "ss851633.jpg", "" %}

I bent the metal with my hand and worked the bends with a heavy steel rod so they are round and smooth instead of straight edges.

Linking the hand and wrist pieces:  
The wrist and hand pieces are linked together by a street cleaner brush bristle. The bristle is bent in a "Z" shape and goes into a hole at center top of the hand piece. The other end of the bristle is slightly bent upwards (so it doesn't go into my arm when I move my hand) and goes through a wire tie loop on the top of the wrist. A paper clip is soldered into this end and is connected to the linear potentiometer. Then I heated and inserted the clip into the plastic potentiometer tab, this creates a nice and strong link. The paperclip provides flexibility and allows the hand to move beyond the range of motion of the potentiometer.

{% fig "ss851632.jpg", "" %}

I'm very proud of this link since it is flexible, robust, and is rather easy to build.

## Light:

{% fig "ss851626.jpg", "" %}

I used seven LEDs connected in parallel (since they have roughly the same voltage and current needs). They fit nicely into the seven holes in my metal disk. In order to avoid the LED leads to short when in contact with the metal, I applied a thick layer of transparent nail polish to the metal plate previous to inserting the LEDs. The nail polish works very well as an insulator and is, for all practical purposes, invisible.

{% fig "ss851656.jpg", "" %}

The LEDs are connected in series to the potentiometer which in turn is connected to a regular resistor. The regular resistor is used to limit the current and set the appropriate voltage for the LEDs and the potentiometer determines the light intensity. You can determine the appropriate value for the resistor by using this [LED calculator](http://alan-parekh.com/led_resistor_calculator.html).

I hope you enjoyed the information and you like the end result.

{% fig "ss851643.jpg", "" %}

Below is a video of the repulsor beam. I know it lacks the repulsive action but still, I think it looks nice. Enjoy.

http://www.youtube.com/watch?v=g3c_dvuceb8