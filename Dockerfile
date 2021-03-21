# Dockerfile for testing Linux env on macos
# docker run --rm -it $(docker build -q .)
# docker build -t dotfiles . && docker run --rm -it -e MIN=1 dotfiles
# Using the homebrew dockerfile means we don't have to install homebrew first
FROM homebrew/ubuntu20.04

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
      build-essential \
      coreutils \
      gnupg2 \
      jq \
      unzip \
      zsh \
      neovim && \
    locale-gen "en_GB.UTF-8" "en_US.UTF-8" && \
    apt-get clean

ENV LANG en_GB.UTF-8 LANGUAGE en_GB:en LC_ALL en_GB.UTF-8

RUN useradd -m -s /bin/zsh -G linuxbrew tester
COPY . /home/tester/.dotfiles
RUN chown -R tester:tester /home/tester && \
    echo 'tester ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/tester && \
    chmod 0440 /etc/sudoers.d/tester
USER tester

ENV HOME /home/tester
ENV GIT_AUTHOR_NAME Colin Seymour
ENV GIT_AUTHOR_EMAIL colin@symr.io

WORKDIR /home/tester
ENTRYPOINT [ ".dotfiles/script/bootstrap" ]
