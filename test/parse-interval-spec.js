import test from 'ava';
import 'babel-core/register';
import parseInterval from './../src/utils/parse-date';

test('#parseInterval', t => {
  t.is(10, parseInterval('10m'));
  t.is(70, parseInterval('1h 10m'));
  t.is(60 * 24 * 2, parseInterval('2d'));
});
