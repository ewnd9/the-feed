# the-feed

[WIP] the programmable front page of the internet

## Install

```
# clone and cd
$ npm install
```

## Usage

Copy `example.config.yml` to `config.yml`

```
$ npm start

  Usage
  	$ the-feed

  Options
  	-t, --test Interactive tasks testing
```

## Available Tasks

### `scrape-task`

Generic html parsing

```yaml
task: scrape
params:
  url: https://www.reddit.com/r/node/search?q=node.js&sort=new&restrict_sr=on
  selector: .search-result
  titleSelector: .search-title
  urlSelector: .search-title@href
```

### `github-stars-task`

Collects projects which were stargazed by people you follow

```yaml
task: github-stars
params:
  username: <your-username>
  token: <your-api-token>
```

### `reddit-task`

```yaml
task: reddit
params:
  subreddits: [
    node, npm
  ]
```

### `twitter-search-task`

Collects tweets about user

```yaml
task: twitter-search
params:
  user: <user>
  access_token_key: <secret>
  access_token_secret: <secret>
  consumer_key: <secret>
  consumer_secret: <secret>
```

## Development

### Setup deploy to raspberry script

```
$ cp example.deploy.sh deploy.sh # replace user@ip to yours
$ cp example.ecosystem.json ecosystem.json # replace /home/user/media to yours
$ chmod +x deploy.sh
```

## License

MIT © [ewnd9](http://ewnd9.com)
