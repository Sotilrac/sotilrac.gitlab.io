---
layout: layouts/post.njk
status: public
published: true
title: Making Panoramas
author: Carlos
id: 77
wordpress_url: http://carlitoscontraptions.com/?p=169
date: 2009-05-09T20:34:06-04:00
date_gmt: 2009-05-10T00:34:06-04:00
categories:
  - My Projects
  - Work in progress
  - Software
  - Info
tags:
  - Photography
---

{% include "archive-banner.njk" %}

In my trip to San Francisco, I had the chance to see many beautiful things. And I wanted to be able to remember them and show them to my friends and family.

{% fig "/img/blog/making-panoramas/sf_from_twin_peak1.jpg", "San Francisco Seen From Twin Peaks Park" %}

Besides taking simple photos, sometimes you need a wider view- angle to really capture the scenery. The obvious solution to this is making a panorama. This means you take many pictures of different sections of your subject and then align them and stitch them together so to form a bigger picture.

Many people believe this is a very difficult procedure and that the results are never as good as expected, and they are partially correct. In order to get a nice looking panoramic picture that will align and stitch together correctly you need to follow some rules:

- Make sure that contiguous pictures have a good 30% overlap between them.
- Make sure the overlapping areas contain some hard object, like a building. If they overlap only over the sky or some water, then the stitching together will be more difficult.
- Make sure you follow a simple pattern when shooting the photos. Follow a horizontal line, for instance, and shoot the pictures in order. Also, if you're making a taller panorama, I suggest you shoot many horizontal lines that will stack up together. This will make things easier when recognizing which photos to stitch together.
- Make sure all the pictures have a similar exposure. This should be no problem if you are shooting your pictures all at once.
- Make sure your subject is always on the same focal plane. You can have many focal planes but it will make the stitching more difficult.

Once you have shot all the pictures you can start the stitching. In order to do so, you can use an excellent software package called [Hugin](http://hugin.sourceforge.net/ "Hugin - Panorama photo stitcher"). Of course since I'm using it, Hugin is open source and (thus) cross-platform. It is a very intuitive program to use and since there are many [good tutorials](http://hugin.sourceforge.net/tutorials/index.shtml "Hugin tutorials") about it, I won't be outlining the instructions on how to use it.

Once you stitched your images together (which can be done in the three steps the wizard takes you through) you will end up with a big TIFF or JPG file. Now you are basically done. Now you just need to crop it and make any desired adjustments with a picture editing program like Gimp.

The only problem is that if you want to share this picture it can be hard since it may be too big for sending by email and will take a long time to (upload and) download if you put it on a website.

Now you can use the [Google Maps Image Cutter](http://www.casa.ucl.ac.uk/software/googlemapimagecutter.asp "Google Maps Image Cutter"). This little Java program developed by [UCL](http://www.ucl.ac.uk/ "University College London") enables you to use the Google Maps engine as a picture viewing system. It creates many copies of your image at various resolutions and chops those images into small square pieces. Then when you view the image through the Google Maps engine, you are only loading the small squares at which you are currently looking at the resolution corresponding to your zoom level.

Here you can enjoy a few examples I made (click on the title to view them in full screen).

\[pageview http://files.carlitoscontraptions.com/panorama/sf\_downtown\_from\_twin\_peak.html "Downtown San Francisco" A panorama shot from the Twin Peaks Park.\]

\[pageview http://files.carlitoscontraptions.com/panorama/SF\_from\_twin_peak.html "Downtown and East San Francisco" A larger panorama shot from the Twin Peaks Park.\]

\[pageview http://files.carlitoscontraptions.com/panorama/SF\_from\_peak_2.html "South San Francisco" Another panorama shot from the Twin Peaks Park.\]

Keep in mind that Hugin is very powerful and can do much more than simply stitching a few images together. Also, there might be a few issues with the file writing routine when trying to run the Google Maps Image Cutter in Linux.
