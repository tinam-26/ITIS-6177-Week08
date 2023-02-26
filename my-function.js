 app.get('/say', (req, res) => {

            res.send(sayStuff(req));
});

function sayStuff(req){
  return ("Christina says " + req.query.keyword)
}
