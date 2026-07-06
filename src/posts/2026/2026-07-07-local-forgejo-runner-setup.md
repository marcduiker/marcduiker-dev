---
title: "Setting up a local Forgejo runner for Codeberg"
description: ""
date: 2026-07-07
draft: true
---

# Forgejo Runner Docker Setup Guide

Complete step-by-step instructions to set up a local Forgejo Runner using Docker and connect it to your Codeberg repository.

---

## 📋 Prerequisites

- Docker installed and running on your machine
- Docker Compose (optional but recommended)
- Codeberg account with access to your repository
- Your repository must have workflows in `.forgejo/workflows/` directory

---

## 🚀 Quick Start

This guide assumes you want to run a Docker-based Forgejo Runner locally to execute workflows from your Codeberg repository `marcduiker/marcduiker-dev`.

**This guide includes instructions for both macOS/Linux and Windows (PowerShell).**

---

## Step 1: Create Project Directory

Create a dedicated directory for your Forgejo Runner. A Forgejo Runner cache directory is required to:
- Store downloaded container images for faster job execution
- Cache action dependencies to avoid re-downloading them for each job
- Store temporary files during workflow execution

### macOS / Linux

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

### Windows (PowerShell)

```powershell
# Create the directory structure
New-Item -ItemType Directory -Force -Path "$HOME\forgejo-runner\data\.cache"

# Change to the project directory
Set-Location -Path "$HOME\forgejo-runner"
```

**Note for Windows:** Docker Desktop on Windows handles file permissions automatically, so no need for `chmod` commands.

## Step 2: Create Docker Compose Configuration

Create a file named `docker-compose.yml` in your project directory and add the following content::

```yaml
services:
  docker-in-docker:
    image: docker:dind
    container_name: 'docker_dind'
    privileged: true
    command: ['dockerd', '-H', 'tcp://0.0.0.0:2375', '--tls=false']
    restart: 'unless-stopped'
    networks:
      - runner-network

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
    networks:
      - runner-network

networks:
  runner-network:
    driver: bridge
```

**What this does:**
- Creates a Docker-in-Docker (DinD) service for container isolation
- Runs the official Forgejo Runner container
- Sets up a dedicated network for communication between containers
- Mounts the local `./data` directory into the container

---

## Step 3: Generate Default Configuration

Ensure the terminal is in the `forgejo-runner` home directory you created in Step 1. 

Generate the default configuration file for the runner:

### macOS / Linux

```bash
cd ~/forgejo-runner
docker run --rm data.forgejo.org/forgejo/runner:12 \
  forgejo-runner generate-config > data/runner-config.yml
```

### Windows (PowerShell)

```powershell
cd "$HOME\forgejo-runner"
docker run --rm data.forgejo.org/forgejo/runner:12 forgejo-runner generate-config | Out-File -FilePath "data\runner-config.yml" -Encoding UTF8
```

This creates a complete configuration `runner-config.yml` file with all available options and their default values. It's about 270 lines long and includes comments explaining each option.

---

## Step 4: Configure the Runner

Edit the generated `data/runner-config.yml` file. If you're using VS Code, you can open it with:

```bash
code data/runner-config.yml
```

Here's a recommended configuration for Codeberg:

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
- `marcduiker-medium` label matches your existing workflow in `publish.yaml`
- `ubuntu-latest` label for compatibility with common workflows
- Cache enabled with 24-hour expiration
- Work directory set to `/data/workdir`

Keep the file open because you'll need to fill in the `uuid` and `token` after registering the runner with Codeberg.

---

## Step 5: Register Runner with Codeberg

### Method A: Interactive Registration via Repository Settings (Recommended)

1. Open your browser and go to:
   
   ```
   https://codeberg.org/<username>/<repository>/settings/actions/runners
   ```
   
  For my personal website repo, it would be:

   ```
   https://codeberg.org/marcduiker/marcduiker-dev/settings/actions/runners
   ```

2. Click the **"Create new runner"** button

3. Enter the runner details:
   - **Name:** `local-docker-runner`
   - **Description:** `Local Docker-based runner for development`

4. Click **"Create"**

5. **Copy the UUID and Token** that appear after creation.

### Method B: Via User Settings

If you want the runner to be available for all your repositories:

1. Go to: `https://codeberg.org/user/settings/actions/runners`
2. Follow the same steps as above

### Method C: Via Organization Settings

If you have an organization and want the runner for all organization repositories:

1. Go to: `https://codeberg.org/{organization}/settings/actions/runners`
2. Follow the same steps as above

---

## Step 6: Update Configuration with Credentials

Edit `data/runner-config.yml` and update the `server.connections.codeberg` section with the UUID and Token you copied from Step 5:

```yaml
server:
  connections:
    forgejo:
      url: https://codeberg.org/
      uuid: ""  # Replace with your actual UUID
      token: ""  # Replace with your actual Token
      insecure: false
```

**⚠️ Important:** Keep this file secure. The token grants access to register runners on your behalf.

---

## Step 7: Start the Runner

Start the runner in detached mode:

### macOS / Linux

```bash
cd ~/forgejo-runner
docker compose up -d
```

### Windows (PowerShell)

```powershell
Set-Location -Path "$HOME\forgejo-runner"
docker compose up -d
```

**Note for Windows:** Ensure Docker Desktop is running before executing these commands.

---

## Step 8: Verify Registration

### Check Container Logs

#### macOS / Linux

```bash
cd ~/forgejo-runner
docker compose logs -f runner
```

#### Windows (PowerShell)

```powershell
Set-Location -Path "$HOME\forgejo-runner"
docker compose logs -f runner
```

Look for success messages like:
```
INFO  Registered runner 'local-docker-runner' with Forgejo
INFO  Runner is ready to accept jobs
```

### Verify on Codeberg

1. Go to: `https://codeberg.org/marcduiker/marcduiker-dev/settings/actions/runners`
2. Your runner should appear in the list with a status of **"Online"** ✅

---

## Step 9: Test the Runner

### Trigger a Workflow

1. Navigate to your repository:
   
   #### macOS / Linux
   ```bash
   cd /Users/marcduiker/dev/pers/marcduiker-dev
   ```
   
   #### Windows (PowerShell)
   ```powershell
   Set-Location -Path "C:\Users\marcduiker\dev\pers\marcduiker-dev"
   ```

2. Create a test branch and make a change:
   
   #### macOS / Linux
   ```bash
   git checkout -b test-runner
   echo "Testing local Forgejo Runner" >> TEST_RUNNER.md
   git add TEST_RUNNER.md
   git commit -m "Test: Verify local runner works"
   git push origin test-runner
   ```
   
   #### Windows (PowerShell)
   ```powershell
   git checkout -b test-runner
   Add-Content -Path "TEST_RUNNER.md" -Value "Testing local Forgejo Runner"
   git add TEST_RUNNER.md
   git commit -m "Test: Verify local runner works"
   git push origin test-runner
   ```

3. Create a **Pull Request** on Codeberg from the `test-runner` branch to your main branch

### Check Workflow Execution

1. Go to your repository on Codeberg
2. Click on the **"Actions"** tab
3. You should see your workflow running
4. Click on the workflow run to see the logs
5. The workflow should execute on your local runner

### Expected Behavior

Your `publish.yaml` workflow uses:
- `runs-on: codeberg-small` → Will match your runner's label
- `actions/checkout@v5` → Will work with the Node.js container
- `actions/setup-node@v4` → Requires Node.js (provided by `node:20-bookworm`)
- `actions/cache@v4` → Cache is configured and enabled
- `actions/git-pages@v2` → Forgejo-compatible action

---

## Step 10: Monitoring and Management

### View Logs

#### macOS / Linux

```bash
# View all logs
docker compose logs -f

# View only runner logs
docker compose logs -f runner

# View last 100 lines
docker compose logs --tail=100 runner
```

#### Windows (PowerShell)

```powershell
# View all logs
docker compose logs -f

# View only runner logs
docker compose logs -f runner

# View last 100 lines
docker compose logs --tail=100 runner
```

### Stop the Runner

#### macOS / Linux

```bash
docker compose down
```

#### Windows (PowerShell)

```powershell
docker compose down
```

### Start the Runner Again

#### macOS / Linux

```bash
docker compose up -d
```

#### Windows (PowerShell)

```powershell
docker compose up -d
```

### Restart the Runner

#### macOS / Linux

```bash
docker compose restart runner
```

#### Windows (PowerShell)

```powershell
docker compose restart runner
```

### Update Configuration

1. Stop the runner:
   
   ##### macOS / Linux
   ```bash
   docker compose down
   ```
   
   ##### Windows (PowerShell)
   ```powershell
   docker compose down
   ```

2. Edit `data/runner-config.yml`

3. Start the runner again:
   
   ##### macOS / Linux
   ```bash
   docker compose up -d
   ```
   
   ##### Windows (PowerShell)
   ```powershell
   docker compose up -d
   ```

---

## Clean Up

### Stop and Remove Containers

#### macOS / Linux

```bash
cd ~/forgejo-runner
docker compose down
```

#### Windows (PowerShell)

```powershell
Set-Location -Path "$HOME\forgejo-runner"
docker compose down
```

### Remove All Data (⚠️ Destructive)

#### macOS / Linux

```bash
rm -rf ~/forgejo-runner
```

#### Windows (PowerShell)

```powershell
Remove-Item -Recurse -Force -Path "$HOME\forgejo-runner"
```

This will remove:
- All container images
- All configuration files
- All cached data
- All work directories

---

## ⚠️ Security Considerations

### Important Security Notes

1. **Docker Socket Access**: The runner has access to your Docker socket, meaning it can run any container with your Docker permissions.

2. **Token Security**: The registration token is sensitive. Anyone with access to it can register runners on your behalf.

3. **Network Isolation**: The Docker-in-Docker container runs in privileged mode, which is required for nested Docker but increases the attack surface.

4. **Ephemeral Runners**: Consider using ephemeral runners for better security. These runners are automatically deleted after running one job.

### Recommended Security Practices

1. **Use specific image versions** instead of floating tags:
   ```yaml
   labels:
     - codeberg-small:docker://node@sha256:91447bc57243b852a21e0ff3553f531f0d4b66257a564b106c79d9e00f3aa14e
   ```

2. **Limit runner scope**: Register the runner at the repository level rather than user or system level if possible.

3. **Regular updates**: Keep your Docker and Forgejo Runner images up to date.

4. **Monitor logs**: Regularly check the runner logs for suspicious activity.

---

## Performance Optimization

### Use Specific Image Tags

For reproducible builds, use specific image digests:

```yaml
runner:
  labels:
    - codeberg-small:docker://node@sha256:91447bc57243b852a21e0ff3553f531f0d4b66257a564b106c79d9e00f3aa14e
    - ubuntu-latest:docker://ubuntu@sha256:1093e95204440502b3e94554545d8d9724e434803291645277223ce504688fcc
```

### Configure Multiple Labels

Add more labels to support different workflow types:

```yaml
runner:
  labels:
    - codeberg-small:docker://node:20-bookworm
    - ubuntu-latest:docker://node:20-bookworm
    - ubuntu-22.04:docker://ubuntu:22.04
    - macos-latest:host
    - windows-latest:docker://mcr.microsoft.com/windows/servercore:ltsc2022
```

### Adjust Cache Settings

```yaml
cache:
  dir: /data/.cache
  enabled: true
  expire: 72h  # Keep cache for 3 days
  max_size: 10gb  # Limit cache size
```

---

## Troubleshooting

### Common Issues and Solutions

#### Runner doesn't appear online

1. **Check logs**: `docker compose logs -f runner`
2. **Verify network connectivity**: Ensure your machine can reach `https://codeberg.org`
3. **Check credentials**: Verify UUID and Token are correct in configuration
4. **Firewall issues**: Ensure outbound connections to Codeberg are allowed

#### Jobs stuck in queue

1. **Check runner status**: Verify runner shows as "Online" in Codeberg
2. **Check labels**: Ensure workflow `runs-on` matches your runner's labels
3. **Check container logs**: Look for errors in the runner container
4. **Verify Docker-in-Docker**: Ensure DinD container is running: `docker ps`

#### Permission errors

1. **Check volume permissions**: Ensure `/data` directory has proper permissions
2. **User mapping**: Verify the user ID (1001:1001) has access to the data directory

#### Docker-in-Docker issues

1. **Verify DinD is running**: `docker compose ps`
2. **Test Docker access**: 
   
   #### macOS / Linux
   ```bash
   docker exec -it runner docker ps
   ```
   
   #### Windows (PowerShell)
   ```powershell
   docker exec -it runner docker ps
   ```
3. **Check DOCKER_HOST**: Verify environment variable is set correctly

### Debug Mode

Enable debug logging by editing the configuration:

```yaml
log:
  level: debug
  format: console
  file: /data/runner.log
```

Then restart the runner:

#### macOS / Linux
```bash
docker compose restart runner
```

#### Windows (PowerShell)
```powershell
docker compose restart runner
```

---

## Advanced Configuration

### Multiple Runners

You can run multiple runners for different purposes:

```yaml
server:
  connections:
    codeberg:
      url: https://codeberg.org/
      uuid: your-uuid-1
      token: your-token-1
    
    # Additional connection for another repository
    another-repo:
      url: https://codeberg.org/
      uuid: your-uuid-2
      token: your-token-2
```

### Custom Network Configuration

```yaml
container:
  network: custom-network
  enable_ipv6: true
  subnet: 172.20.0.0/16
```

### Resource Limits

```yaml
runner:
  max_jobs: 4  # Run up to 4 jobs concurrently
  timeout: 6h  # Job timeout
```

---

## Useful Commands

### Check Runner Version

#### macOS / Linux
```bash
docker run --rm data.forgejo.org/forgejo/runner:12 forgejo-runner --version
```

#### Windows (PowerShell)
```powershell
docker run --rm data.forgejo.org/forgejo/runner:12 forgejo-runner --version
```

### Generate Configuration

#### macOS / Linux
```bash
docker run --rm data.forgejo.org/forgejo/runner:12 forgejo-runner generate-config
```

#### Windows (PowerShell)
```powershell
docker run --rm data.forgejo.org/forgejo/runner:12 forgejo-runner generate-config
```

### List Available Images

#### macOS / Linux
```bash
docker search data.forgejo.org/forgejo/runner
```

#### Windows (PowerShell)
```powershell
docker search data.forgejo.org/forgejo/runner
```

### Clean Docker System

#### macOS / Linux
```bash
# Remove unused containers, networks, images
docker system prune

# Remove all unused images, not just dangling ones
docker system prune -a
```

#### Windows (PowerShell)
```powershell
# Remove unused containers, networks, images
docker system prune

# Remove all unused images, not just dangling ones
docker system prune -a
```

---

## Additional Resources

- [Forgejo Runner Documentation](https://forgejo.org/docs/next/admin/actions/)
- [Codeberg Documentation](https://docs.codeberg.org/)
- [Forgejo Runner Source Code](https://code.forgejo.org/forgejo/runner)
- [Forgejo Actions User Guide](https://forgejo.org/docs/next/user/actions/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker-in-Docker GitHub](https://github.com/docker/docker-dind)

---

## 🪟 Windows-Specific Notes

### Docker Desktop Requirements

- **Docker Desktop for Windows** must be installed and running
- **WSL 2 backend** is recommended for best performance
- Ensure you have **Docker Compose V2** (included with Docker Desktop)

### File System Considerations

- Use **forward slashes** (`/`) in volume mounts in `docker-compose.yml` - they work on both Windows and Unix systems
- Docker Desktop automatically handles path conversions between Windows and container file systems
- Store your project files in your **user profile directory** (`$HOME` or `%USERPROFILE%`) to avoid permission issues

### WSL 2 Recommendations

For best performance with Docker on Windows:

1. **Enable WSL 2**:
   ```powershell
   wsl --install
   wsl --set-default-version 2
   ```

2. **Configure Docker Desktop** to use WSL 2 backend in Settings > General

3. **Use WSL 2 distribution** for better file system performance with Docker containers

### PowerShell vs Command Prompt

- All Docker commands work in both **PowerShell** and **Command Prompt (cmd.exe)**
- This guide uses **PowerShell** as it provides better scripting capabilities
- Commands like `docker compose`, `docker run`, etc. work identically in both shells

### Windows-Specific Troubleshooting

#### "File sharing is not configured" Error

1. Open Docker Desktop Settings
2. Go to **Resources > File Sharing**
3. Add the drive where your project is located (e.g., `C:\`)
4. Click **Apply & Restart**

#### Permission Issues with Volumes

If you encounter permission errors with volume mounts:

- Ensure the directory exists before Docker tries to mount it
- Use PowerShell to create directories with proper permissions
- Avoid using system-protected directories like `C:\Program Files`

#### Docker-in-Docker on Windows

The Docker-in-Docker (DinD) setup in this guide works on Windows, but you may also consider:

- Using **Docker Desktop's built-in Docker API** instead of DinD for simpler setup
- For production, consider using **WSL 2** with native Linux containers

---

## 📝 Notes

- This setup uses the official Forgejo Runner image from `data.forgejo.org`
- The runner version (tag `12`) matches the current stable release
- Your repository already has a workflow in `.forgejo/workflows/publish.yaml` that uses the `codeberg-small` label
- The setup is designed for local development and testing
- For production use, consider additional security measures

---

*Generated for marcduiker/marcduiker-dev repository*
*Forgejo Runner v12 | Docker Compose v3.8*
*Includes macOS/Linux and Windows PowerShell instructions*
