FROM mariadb:10.4.6

RUN apt-get update

RUN apt-get install locales -y

RUN localedef -i ja_JP -c -f UTF-8 -A /usr/share/locale/locale.alias ja_JP.UTF-8

ENV LANG ja_JP.utf8

ADD ./my.cnf /etc/mysql/my.cnf

RUN chmod 644 /etc/mysql/my.cnf
