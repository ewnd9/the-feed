# the-feed

[![Build Status](https://travis-ci.org/ewnd9/the-feed.svg?branch=master)](https://travis-ci.org/ewnd9/the-feed)
[![Coverage Status](https://coveralls.io/repos/ewnd9/the-feed/badge.svg?branch=master&service=github)](https://coveralls.io/github/ewnd9/the-feed?branch=master)

[WIP] the programmable front page of the internet

### Technologies

Backend:

- `express`
- `pouchdb` (only as embedded db for now, without a syncing to browser or anywhere)

Frontend:

- `react`
- `redux`

Transpiled with `babel` (`es2015` + `stage-0` + `react`), frontend bundled with `webpack`

## Development

```sh
$ yarn install
$ yarn start:dev
```

## Provision

```sh
$ ansible-playbook -i <raspberry-ip>, provision/deploy.yml
$ ansible-playbook -i <raspberry-ip>, provision/backup-cron-setup.yml
```

## Deploy

```sh
$ ansible-playbook -i <raspberry-ip>, provision/deploy.yml
```

## License

MIT © [ewnd9](http://ewnd9.com)
