---
title: "Setting up a local Forgejo runner for Codeberg"
description: "Complete step-by-step instructions to set up a local Forgejo Runner using Docker and connect it to your Codeberg repository."
date: 2026-07-10
---

**TLDR:** Complete step-by-step instructions to set up a local Forgejo Runner using Docker and connect it to your Codeberg repository.

---

## CI/CD for your projects on Codeberg

In my [previous post](/articles/getting-started-with-codeberg/), I introduced [Codeberg](https://codeberg.org) and described how I moved my [personal website code](https://codeberg.org/marcduiker/marcduiker-dev) from GitHub to Codeberg. Moving the source code is only one part of the story, though. There needs to be a CI/CD pipeline to build and deploy the website and a place to host the website since I won't be using GitHub Pages anymore. In this post, I will describe how to set up a local Forgejo Runner to run CI/CD pipelines for your Codeberg repository.

## Forgejo Actions

Every GitHub user is familiar with GitHub Actions, GitHub's built-in CI/CD platform. The Codeberg equivalent is called [Forgejo Actions](https://forgejo.org/docs/next/user/actions/). It's named like that because Codeberg is a hosted version of [Forgejo](https://forgejo.org/), so anything you can do with Forgejo you can also do with Codeberg.

[Forgejo Actions](https://forgejo.org/docs/latest/user/actions/overview/) look very similar to GitHub Actions; the workflows are defined in the same way; it's all yaml-based.

### Codeberg Hosted Runners

One major difference compared to GitHub is that Codeberg offers a limited set [of hosted Actions runners](https://codeberg.org/actions/meta#available-runners). There are only three runners available:

| Type | CPU | Memory | Run Time Limit |
|------|-----|--------|-----|
| tiny | 2 cores | 2 GB | 2 min |
| small | 4 cores | 4 GB | 5 min |
| medium | 8 cores | 8 GB | 10 min |

As you can see, the run time limit for these hosted runners is very short, so if you have a workflow that takes longer than 10 minutes to run, you will need to set up your own self-hosted runner. And even if your workflow execution is quick, the workflow jobs are queued with other workflow jobs on these three Codeberg runners, so you need to be very patient and sometimes have to wait for hours. The default usage for most people would be to use self-hosted runners so workflows are executed quickly and can take any amount of time.

I've checked the GitHub Actions workflow duration for my personal website build & deployment, and that workflow takes about 10 minutes and 30 seconds to run, so I definitely have to set up a self-hosted Forgejo Runner.

### Self-hosted Forgejo Runner

There are two ways to set up a local [self-hosted Forgejo Runner](https://forgejo.org/docs/latest/admin/actions/): installing a binary or using a Docker container. Since I'm working with containers daily, I prefer to run the Forgejo Runner as a Docker container. The next steps will guide you through the process of setting up a local Forgejo Runner using Docker and connecting it to your Codeberg repository.

#### Prerequisites

Before you start, make sure you have the following prerequisites:

- [Docker Desktop](https://docs.docker.com/desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Codeberg account with a repository
- The Codeberg repository must have a workflow in the `.forgejo/workflows/` directory

If you don't have a workflow yet, you can create a simple test workflow for your repo in `.forgejo/workflows/test-runner.yaml`:

```yaml
on: 
  workflow_dispatch:
  push:
jobs:
  test:
    runs-on: <runner-label> # Replace with your runner label (see Step 4 in this post)
    steps:
      - run: echo All good!
```

I'll be using my personal website repository `marcduiker/marcduiker-dev` for this post, which already has a workflow in `.forgejo/workflows/publish.yaml`.

#### Step 1: Create Project Directory

Create a dedicated directory for your local Forgejo Runner. I suggest creating a directory named `forgejo-runner` in your home directory and not inside a repository since the runner can be reused across multiple projects. This location is used for the Forgejo Runner cache:

- Store downloaded container images for faster job execution
- Cache action dependencies to avoid re-downloading them for each job
- Store temporary files during workflow execution

Create the `forgejo-runner` directory and move into it:

*macOS / Linux*

```bash
mkdir -p ~/forgejo-runner/data/.cache
chmod 775 ~/forgejo-runner/data/.cache
chmod g+s ~/forgejo-runner/data/.cache
cd ~/forgejo-runner
```

The specific permissions (775 + g+s) ensure:
- The runner process (running as user 1001:1001 in the container) can write to the cache
- Files created by the runner maintain consistent group ownership
- Multiple processes/users can share the cache directory without permission issues

*Windows (PowerShell)*

```powershell
# Create the directory structure
New-Item -ItemType Directory -Force -Path "$HOME\forgejo-runner\data\.cache"

# Change to the project directory
Set-Location -Path "$HOME\forgejo-runner"
```

**Note for Windows:** Docker Desktop on Windows handles file permissions automatically, so no need for `chmod` commands.

#### Step 2: Create Docker Compose Configuration

Create a file named `docker-compose.yml` in the runner directory and add the following content::

```yaml
services:
  docker-in-docker:
    image: docker:dind
    container_name: 'docker_dind'
    privileged: true
    command: ['dockerd', '-H', 'tcp://0.0.0.0:2375', '--tls=false']
    restart: 'unless-stopped'

  runner:
    image: 'data.forgejo.org/forgejo/runner:12'
    container_name: 'forgejo-runner'
    links:
      - docker-in-docker
    depends_on:
      docker-in-docker:
        condition: service_started
    environment:
      DOCKER_HOST: tcp://docker-in-docker:2375
    user: "1001:1001"
    volumes:
      - ./data:/data
    restart: 'unless-stopped'
    command: 'forgejo-runner daemon --config /data/runner-config.yml'
```

**What this does:**
- Creates a Docker-in-Docker (DinD) service for container isolation
- Runs the official Forgejo Runner container
- Sets up a dedicated network for communication between containers
- Mounts the local `./data` directory into the container

#### Step 3: Generate Default Configuration

Ensure the terminal is in the `forgejo-runner` home directory you created in Step 1. 

Generate the default configuration file for the runner:

*macOS / Linux*

```bash
docker run --rm data.forgejo.org/forgejo/runner:12 \
  forgejo-runner generate-config > data/runner-config.yml
```

*Windows (PowerShell)*

```powershell
docker run --rm data.forgejo.org/forgejo/runner:12 forgejo-runner generate-config | Out-File -FilePath "data\runner-config.yml" -Encoding UTF8
```

This creates a complete configuration `runner-config.yml` file with all available options and their default values. It's about 270 lines long and includes comments explaining each option.

#### Step 4: Configure the Runner

Edit the generated `data/runner-config.yml` file. If you're using VS Code, you can open it with:

```bash
code data/runner-config.yml
```

Here's the configuration that I'm using for the runner that will build and deploy my personal website:

```yaml
# Forgejo Runner Configuration
log:
  level: info
  format: console
  file: /data/runner.log

host:
  workdir_parent: /data/workdir

server:
  connections:
    forgejo:
      url: https://codeberg.org/
      uuid: ""  # Will be filled during registration
      token: "" # Will be filled during registration
      insecure: false

runner:
  labels:
    - marcduiker-medium:docker://node:22-bookworm
    - ubuntu-latest:docker://node:22-bookworm
  env: []
  workdir: /data/workdir
  cleanup: true
  disable_docker: false

container:
  network: forgejo-runner-network
  privileged: false
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
  enable_ipv6: false
  devices: []

cache:
  dir: /data/.cache
  enabled: true
  expire: 24h

docker:
  allowed_registries: []
  privileged: false
  disable_entrypoint: false
  disable_workdir: false
```

**Key configuration points:**
- `marcduiker-medium` label matches the label in your workflow file (`runs-on` property)
- `ubuntu-latest` label for compatibility with common workflows
- Cache enabled with 24-hour expiration
- Work directory set to `/data/workdir`

Keep the file open because you'll need to fill in the `uuid` and `token` after registering the runner with Codeberg.

#### Step 5: Register Runner with Codeberg

The runner can be registered at three levels: repository, user, or organization. I used the repository level for my website.

##### Method A: Registration via Repository Settings

1. Open a browser and go to:
   
   ```
   https://codeberg.org/<username>/<repository>/settings/actions/runners
   ```
   
  For my personal website repo, I navigated to:

   ```
   https://codeberg.org/marcduiker/marcduiker-dev/settings/actions/runners
   ```

2. Click the **"Create new runner"** button

3. Enter the runner details; I used:
   - **Name:** `local-docker-runner`
   - **Description:** `Local Docker-based runner for development`

4. Click **"Create"**

5. Copy the `UUID` and `Token` that appear after creation and continue to Step 6.

##### Method B: Registration via User Settings

If you want the runner to be available for all your repositories:

1. Go to: `https://codeberg.org/user/settings/actions/runners`
2. Follow the same steps as above

##### Method C: Registration via Organization Settings

If you have an organization and want the runner for all organization repositories:

1. Go to: `https://codeberg.org/{organization}/settings/actions/runners`
2. Follow the same steps as above

#### Step 6: Update Configuration with Credentials

Edit `data/runner-config.yml` and update the `server.connections.codeberg` section with the `UUID` and `Token` you copied from Step 5:

```yaml
server:
  connections:
    forgejo:
      url: https://codeberg.org/
      uuid: ""  # Replace with your actual UUID
      token: ""  # Replace with your actual Token
      insecure: false
```

> **⚠️ Important:** Keep this file secure. The token grants access to register runners on your behalf.


#### Step 7: Start the Runner

Start the runner in detached mode; ensure you're in the `forgejo-runner` directory:

```bash
docker compose up -d
```

#### Step 8: Verify Registration

Check the container logs:

```bash
docker compose logs -f runner
```

You'll first see some log entries that the Docker daemon can't be pinged:

```
forgejo-runner  | Error: cannot ping the docker daemon
```

Soon after that, you'll see the following logs indicating successful registration:

```
forgejo-runner  | time="2026-07-06T21:27:31Z"  level=info msg="runner: marcduiker-website-runner, with version: v12.12.0, with labels: [marcduiker-medium ubuntu-latest], ephemeral: false, declared successfully"
forgejo-runner  | time="2026-07-06T21:27:31Z" level=info msg="[poller] launched"
```

**Verify on Codeberg**

1. Go to: `https://codeberg.org/<username>/<repository>/settings/actions/runners`

    In my case, this is:
    `https://codeberg.org/marcduiker/marcduiker-dev/settings/actions/runners`

2. The runner should appear in the list with a status of **`Idle`** 


#### Step 9: Test the Runner

Time to test the runner with a real workflow!

1. Using your editor of choice, make a code change and push it to your repository. 
2. Go to the repository on Codeberg.
3. Click on the **"Actions"** tab.
4. You should see your workflow running.
5. Click on the workflow run to see the logs.
6. The workflow should execute on the local runner.

#### Step 10: Stop the Runner

Once the workflow is finished and you don't plan to use the runner for a while, you can stop the runner to free up system resources. To stop it, run the following command in the `forgejo-runner` directory:

```bash
docker compose down
```

## Next Steps

It definitely is a bit more work to set up a local Forgejo Runner, but it gives you full control over your CI/CD environment. You can customize the runner, install additional tools, and manage caching strategies to optimize your workflows.

Now that I have the local Forgejo Runner set up, I will continue with the next steps in my CI/CD pipeline to set up Codeberg Pages for my personal website. More on that in my next post!