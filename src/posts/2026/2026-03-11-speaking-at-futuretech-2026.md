---
title: "Speaking at FutureTech 2026"
description: "Recap of FutureTech 2026, orchestrating microservices with Dapr Workflow to sequence live synthesizer music via Web MIDI in a durable execution demo."
date: 2026-03-11
---

{% imageKeys { src: "./src/assets/images/blog/2026/154.1.futuretech.jpg", alt: "Speaking at FutureTech 2026", caption: "Speaking at FutureTech 2026", widths: [960] } %}

**TLDR:** <a href="https://github.com/diagrid-labs/dapr-workflow-concerto" target="_blank">Slides & code demos on GitHub</a>

---
On March 11, I was at [FutureTech](https://futuretech.nl/) to give my session, *'Turning microservice chaos into a beautiful concerto'*.

Building reliable distributed applications can feel like conducting a sloppy orchestra, where musicians play too loud or can't keep the tempo. As the conductor, you need to set the pace and give instructions to deliver a beautiful performance. When you build microservices and need to coordinate multistep processes, you have to think about the order of execution, time-outs, cascading failures, inconsistent state, and you have very little control to manage the process once it's started.

Dapr Workflow provides a solution through durable execution, a programming model that treats distributed processes like a musical score. Just as a conductor coordinates multiple musicians to play a symphony, Dapr Workflow orchestrates microservices with built-in state persistence, workflow patterns to control the processes in great detail, and workflow management APIs to operate workflows reliably.

{% imageKeys { src: "./src/assets/images/blog/2026/154.2.futuretech.jpg", alt: "My setup at FutureTech 2026", caption: "My setup at FutureTech 2026", widths: [420] } %}

In my session I ran several Dapr workflows, written in .NET, to sequence music notes, where each workflow step communicates with a microservice that sends a note event to a front-end that uses Web MIDI to play my Behringer Grind synthesizer in real-time. The audience could listen how workflows were progressing! This was the first time I presented this session and performed with one of my synthesizers, and I absolutely loved it. I'm looking forward to give this session more frequently!

A big thank you to the FutureTech organizers and sponsors for making this event happen, and thanks to the attendees for attending my session and the enthusiastic response!

---
Do you like Dapr and want to show your support? Claim this [community supporter Holopin badge](https://bit.ly/dapr-supporter)!

<a href="https://bit.ly/dapr-supporter">{% image "./src/assets/images/blog/common/dapr-community-supporter.png", "Dapr community supporter badge" %}</a>
