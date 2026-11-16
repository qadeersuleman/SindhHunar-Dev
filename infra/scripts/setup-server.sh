#!/bin/bash
# ==============================================================
# SindhHunar Production Server Setup & Hardening Script
# (Run this once on a fresh Ubuntu/Debian Cloud VPS)
# ==============================================================

set -e

echo "🚀 [1/5] Updating System Packages..."
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl git ufw ca-certificates gnupg lsb-release

echo "🐳 [2/5] Installing Docker Engine & Docker Compose Plugin..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "👤 [3/5] Adding current user to Docker group..."
sudo usermod -aG docker "$USER"

echo "🛡️ [4/5] Configuring Firewall (UFW Security)..."
# Block all incoming traffic by default
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow only essential ports
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP (Nginx)'
sudo ufw allow 443/tcp comment 'HTTPS (SSL)'

# Enable firewall without prompting
sudo ufw --force enable

echo "✅ [5/5] Server Hardening Completed!"
echo "Server IP: $(curl -s ifconfig.me)"
echo "Please log out and log back in (or run 'newgrp docker') to activate docker permissions."
