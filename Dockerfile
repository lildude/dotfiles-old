# Dockerfile for testing Linux env on macos
# docker run --rm -it $(docker build -q .)
# docker build -t dotfiles . && docker run -it dotfiles
FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y \
      build-essential \
      curl \
      fish \
      git \
      jq \
      zsh \
    && apt-get clean

RUN useradd -s /bin/fish tester
COPY . /home/tester/.dotfiles
RUN chown -R tester:tester /home/tester
USER tester

ENV HOME /home/tester
ENV GIT_AUTHOR_NAME Colin Seymour
ENV GIT_AUTHOR_EMAIL lildood@gmail.com

WORKDIR /home/tester/.dotfiles
RUN ./script/bootstrap
