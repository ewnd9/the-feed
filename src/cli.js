import meow from 'meow';

const cli = meow(`
  Usage
    $ the-feed

  Options
    -t, --test Interactive tasks testing
`, {
  pkg: './../package.json',
  alias: {
    t: 'test',
    s: 'server'
  }
});

if (cli.flags.test) {
  require('./test-tasks-cli').default(cli.flags);
} else {
  require('./server');
}
