function init(app) {
	app.get('/success', (req, res) => {
		return res.render('test/success');
	});
	app.get('/reject', (req, res) => {
		return res.render('test/reject');
	});
}

module.exports = init;