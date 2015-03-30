var express = require('express');
var router = express.Router();

/*
 * POST to addteam.
 */
router.post('/addteam', function(req, res) {
    var teamName = req.body.team_name;
    var userEmail = req.body.user_email;
    var db = req.db;

    db.collection('users').findOne({ email: userEmail }, function(err, result) {
        // Ensure that user exists.
        if (err === null && result !== null) {
            db.collection('teams').findOne({ name: teamName }, function(err, result) {
                // Ensure that team name doesn't already exist.
                if (err === null && result === null) {
                    db.collection('teams').insert({ name: teamName }, function(err, result) {
                        if (err === null) {
                            var teamId = result[0]._id;
                            // Set team_id field of user to team id found above.
                            db.collection('users').update({ email: userEmail }, {$set:{team_id:teamId}}, function(err, result) {
                                res.send(
                                    (err === null) ? { msg: '' } : { msg: err }
                                );
                            });
                        } else {
                            res.send({ msg: err });
                            return false;
                        }
                    });
                } else {
                    res.send({ msg: 'a team with that name already exists.' });
                    return false;
                }
            });
        } else {
            res.send({ msg: 'invalid email. You must register in order to create a team.' });
            return false;
        }
    });
});

/*
 * POST to jointeam.
 */
router.post('/jointeam', function(req, res) {
    var teamName = req.body.team_name;
    var userEmail = req.body.user_email;
    var db = req.db;

    // Get team id.
    db.collection('teams').findOne({ name: teamName }, function(err, result) {
        if (err === null && result !== null) {
            var teamId = result._id;

            // Set team_id field of user to team id found above.
            db.collection('users').update({ email: userEmail }, {$set:{team_id:teamId}}, function(err, result) {
                res.send(
                    (err === null && result > 0) ? { msg: '' } : { msg: 'invalid email. You must register in order to join a team.' }
                );
            });
        } else {
            res.send({ msg: 'invalid team name. Make sure the team name matches exactly.' });
            return false;
        }
    });
});

module.exports = router;