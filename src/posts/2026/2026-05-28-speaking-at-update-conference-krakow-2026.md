---
title: "Speaking at Update Conference Krakow 2026"
description: ""
date: 2026-05-28
---

{% image "./src/assets/images/blog/2026/156.1.updateconf.jpg", "Speaking at Update Conference Krakow 2026", "Speaking at Update Conference Krakow 2026", [960] %}

**TLDR:** <a href="https://github.com/diagrid-labs/dapr-reliable-agentic-systems" target="_blank">Slides & code demos on GitHub</a>

---
On May 27 and 28, I was at [Update Conference Krakow](https://krakow.updateconference.net/) to give my session, *'Reliable Agentic Systems need Durable Execution'*. It was my first time in Krakow and I really enjoyed this visit!

Everybody seems to be building agentic AI systems these days. But can these systems be put in production easily and work reliably under a heavy load? Agentic systems are essentially distributed applications, involving communication across LLM providers, services, and data stores. And luckily, we (the IT industry) have been building distributed systems for decades.

In my session I showed how [Dapr](https://dapr.io/), the Distributed Application Runtime, a graduated CNCF project, helps to build and run these agentic systems reliably using the durable execution principle that is provided by Dapr Workflow. I demonstrated various patterns in .NET for building effective agents such as Prompt Chaining, Routing, Parallelization, Orchestrator-Workers, and Evaluator-Optimizer. I also used the new LLM Conversation API in Dapr to interact with different LLM providers.

This is the [repo with the demos](https://github.com/diagrid-labs/dapr-reliable-agentic-systems). It comes with a devcontainer configuration so you can run it yourself easily, either on GitHub Codespaces or locally. And you can use DemoTime to run through the slides and all the demos.

A big thank you to the Update Conference organizers and sponsors for making this event happen, and thanks to the attendees for joining my session!

---
Do you like Dapr and want to show your support? Claim this [community supporter Holopin badge](https://bit.ly/dapr-supporter)!

<a href="https://bit.ly/dapr-supporter">{% image "./src/assets/images/blog/common/dapr-community-supporter.png", "Dapr community supporter badge" %}</a>
