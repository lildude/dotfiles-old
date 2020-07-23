# Dockerfile for testing Linux env on macos
# docker run --rm -it $(docker build -q .)
# docker build -t dotfiles . && docker run --rm -it -e MIN=1 dotfiles
FROM ubuntu:19.10

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
      build-essential \
      coreutils \
      curl \
      fish \
      git \
      gnupg2 \
      jq \
      locales \
      sudo \
      unzip \
      neovim && \
    locale-gen "en_GB.UTF-8" "en_US.UTF-8" && \
    apt-get clean

ENV LANG en_GB.UTF-8 \
    LANGUAGE en_GB:en \
    LC_ALL en_GB.UTF-8

RUN useradd -s /bin/fish tester
COPY . /home/tester/.dotfiles
RUN chown -R tester:tester /home/tester && \
    echo 'tester ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/tester && \
    chmod 0440 /etc/sudoers.d/tester
USER tester

ENV HOME /home/tester
ENV GIT_AUTHOR_NAME Colin Seymour
ENV GIT_AUTHOR_EMAIL lildood@gmail.com

WORKDIR /home/tester
ENTRYPOINT [ ".dotfiles/script/bootstrap" ]
