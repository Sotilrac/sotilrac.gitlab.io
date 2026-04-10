---
layout: layouts/post.njk
status: public
author: Carlos
title: Auto-fill Timesheet Bookmarklet
date: 2021-09-02T18:14:00-04:00
categories:
  - Software
tags:
  - javascript
---

A bookmarklet to fill an entire week with 8-hour days on [hourtimesheet.com](https://hourtimesheet.com).

This exploits a quirk in how Angular handles form validation. The UI prevents you from entering time for future days, but that restriction lives in the Angular form controls, not in the DOM. By setting the input value directly and dispatching `input` and `blur` events, we bypass Angular's validation layer while still triggering its change detection. Angular sees the events, updates its internal model, and accepts the values as if the user typed them. The server-side validation doesn't re-check the date restriction, so the submission goes through.

Create a new bookmark and paste this as the URL:

```javascript
javascript: (function () {
  let days = ["0", "1", "2", "3", "4"];
  let base_id = "hoursWorkedEntrySlot0 ";
  let field;
  for (ind in days) {
    field = document.getElementById(base_id + days[ind]);
    field.value = "8.0";
    field.dispatchEvent(new Event("input"));
    field.dispatchEvent(new Event("blur"));
  }
})();
```
