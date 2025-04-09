---
title: "Speaking at KubeCon Europe 2025"
description: ""
date: 2025-04-04
---

{% image "./src/assets/images/blog/2025/144.1.kubecon.jpeg", "Dapr project kiosk", "Mike, Oli, and Marc at the Dapr project kiosk (Picture by CNCF)" %}

From April 1st to April 4th, I was at [KubeCon Europe](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/) in London. It was a very busy conference for me since I was wearing multiple (Dapr 😉) hats that week; doing booth duty (at two locations) and giving two Dapr sessions!

From April 2-4, I was managing the Dapr OSS kiosk, which is part of the project pavilion with other CNCF projects. I had tremendous help from Oli Tomlinson (Dapr STC member) and Mike Nguyen (Dapr maintainer) to run the kiosk. We had many people coming over to the booth and Oli and Mike did a great job explaining the Dapr concepts and showing code from the [Dapr Quickstarts repo](https://github.com/dapr/quickstarts/). A special shoutout goes out to Manuel Zapf, who came over to the kiosk just in time to help answer a question about cross cluster communication with Dapr and Cilium 💪.

{% image "./src/assets/images/blog/2025/144.2.kubecon.jpeg", "Diagrid booth", "Diagrid booth" %}

[Diagrid](https://diagrid.io) had a commercial booth at KubeCon, and I was also helping out there from time to time. Unfortunately, the Dapr kiosk and Diagrid booth were quite far apart; my feet still hurt from all the walking I did that week! 😅 My colleagues did an amazing job there, not just at the booth, but also delivering a couple of Dapr sessions, and taking part in panel discussions.

I was very lucky to give two sessions at the conference! The first one was a project lightning talk on Tuesday, where I highlighted that Dapr is now a graduated project, the workflow API has become stable with Dapr version 1.15, and Dapr now has AI capabilities with the [LLM Conversation API](https://docs.dapr.io/developing-applications/building-blocks/conversation/conversation-overview/) and [Dapr Agents](https://github.com/dapr/dapr-agents). 

{% image "./src/assets/images/blog/2025/144.3.kubecon.jpeg", "Marc Duiker KubeCon session", "Marc Duiker giving the Failure is Not an Option session (picture by Manuel Zapf)" %}

My second session was a regular breakout session on Friday. The session was titled *'Failure is not an option: Durable Execution + Dapr = 🚀'* and covered the concepts of durable execution, the Dapr workflow engine, workflow patterns, and demoing a Dapr workflow app. I was pleasantly surprised to see the room for 80% full for a Friday afternoon session! Thanks to everyone who attended my session, and especially the people who dropped by afterward for questions.

For my session, I used [DemoTime](https://marketplace.visualstudio.com/items?itemName=eliostruyf.vscode-demo-time) again, a VSCode extension created by [Elio Struyf](https://bsky.app/profile/eliostruyf.com), to navigate through my slides (Markdown), code, and also execute the `dapr run` commands for running the Dapr demos. 

This is the [repo with the demos](https://github.com/diagrid-labs/dapr-resiliency-and-durable-execution). It comes with a devcontainer configuration so you can run it yourself easily, either on GitHub Codespaces or locally. And you can use DemoTime to run through the slides and demos yourself.

Thanks again to everyone for making KubeCon a success! It was great meeting up with my cloud native friends again!

---
Do you like Dapr and want to show your support? Claim this [community supporter Holopin badge](https://bit.ly/dapr-supporter)!

<a href="https://bit.ly/dapr-supporter">{% image "./src/assets/images/blog/common/dapr-community-supporter.png", "Dapr community supporter badge" %}</a>
