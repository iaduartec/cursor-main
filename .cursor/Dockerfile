# Use Ubuntu as base image
FROM ubuntu:22.04

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update package list and install essential development tools
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    vim \
    nano \
    build-essential \
    python3 \
    python3-pip \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -s /bin/bash ubuntu

# Set working directory to user's home
WORKDIR /home/ubuntu

# Switch to the ubuntu user
USER ubuntu

# Set environment variables
ENV PATH="/home/ubuntu/.local/bin:$PATH"

# Install common Python packages
RUN pip3 install --user \
    requests \
    numpy \
    pandas \
    matplotlib

# Install common Node.js packages
RUN npm install -g \
    typescript \
    @types/node

# Keep container running
CMD ["/bin/bash"]
