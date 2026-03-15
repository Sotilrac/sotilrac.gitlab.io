---
layout: layouts/post.njk
status: public
title: Auto-fill Timesheet Bookmarklet
date: 2021-09-02T18:14:00-04:00
categories:
- TIL
tags:
- javascript
---
A bookmarklet to fill an entire week with 8-hour days on hourtimesheet.com. Create a new bookmark and paste this as the URL:

```javascript
javascript:(function(){
    let days = ['0', '1', '2', '3', '4'];
    let base_id = 'hoursWorkedEntrySlot0 ';
    let field;
    for (ind in days) {
        field = document.getElementById(base_id + days[ind]);
        field.value = "8.0";
        field.dispatchEvent(new Event('input'));
        field.dispatchEvent(new Event('blur'));
    }
})();
```
