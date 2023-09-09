# ⚡ Zapper
A polling/clicker app that can be used in classrooms with canvas

## Background:
This app is a challenge originating from two wants of mine:
- To use my recently created "Portal" library (used in [Vidlium](https://github.com/Andrew-Gallimore/vidlium_director)) in another context to flesh it out and understand its needs.
- To make a better polling/clicker app for the classroom, its needed because the one I am using in class is both costly and proprietary.

I want to complete this project within a week, so that I don't waffle on about different design decisions and can get a Minimum Viable Product out for use.

## Goal:
Have an app (in both an application and web-based form) where students can join a session, the teacher can post questions to the students, and for the answers to be consolidated on the teachers side with some graphic representation of the answers.

Features the Zapper app will have that meet or surpass the current alternative include:
- Markdown support for formating the questions
- Simple joining functionality, **without a paywall**
- A desktop & web version (and possibly an app...?)
- Output of responses to Canvas

## Devlogs:

<details open>
<summary>
Day 1 Log
</summary> <br />
Created the repo!
  
###
  

Added
- `Host.html` and `Guest.html` files, with their own scripts for their different functionalities
- The `Portal.js` library, and forked it so that I could make it for only 1 creator, and change things from 'rooms' to 'questions' and 'answers'.
- The markdown library, which creates a ready-built markdown editor. Still need to configure, style, and generally finish integrating it into the sytem though.

Deleted
- Nothing yet


<details open>
<summary>
Day 2 Log
</summary> <br />
Didn't do much.
  
###
  

Added
- Nothing, but I did plan out how to possibly do authentication of people, so random people don't put random/bad names

Deleted
- Nothing yet

