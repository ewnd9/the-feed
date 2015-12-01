var fs = require('fs');                                                                                                                                                                                                                  [0/33]
var expect = require('chai').expect;

describe('get github stars', function() {

	var task = require('./../src/tasks/github-stars').default;

  it('follow specification', function() {
		expect(task.task).to.exist;
  });

  it('get github stars', function(done) {
		this.timeout(10000);
		
		task.task().then((items) => {
			expect(items.length).to.be.above(1);
			expect(items[0].id).to.exist;
			expect(items[0].user_url).to.exist;
			expect(items[0].title).to.exist;
			expect(items[0].url).to.exist;
			done();
		}, (err) => done(err));
  });

})
