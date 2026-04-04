---
layout: layouts/post.njk
status: public
author: Carlos
title: Docker Build and Push to DockerHub
date: 2021-05-16T17:16:00-04:00
categories:
  - TIL
tags:
  - docker
---

Building a Docker image from a Dockerfile and pushing it to DockerHub:

```bash
docker build -t IMAGE_NAME . -f PATH_TO.Dockerfile
docker image tag IMAGE_NAME:TAG TARGET_NAME
docker login
docker push TARGET_NAME
```
