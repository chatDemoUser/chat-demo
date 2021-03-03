const passport = require('passport');
const Router = require('express-promise-router');
const db = require('../db');
const router = new Router();
module.exports = router;

router.post(
  '/insert',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const userId = Number(req.user.id);
    const { recipientName, message } = req.query;

    if (userId && recipientName && message) {
      const sql = `insert into public.messages (sender, recipient, message)
                   values ($1, (select id from users where username = $2), $3) returning *`;
      const args = [userId, recipientName, message];
      await db.query(sql, args);
      res.json('success');
    } else {
      res.json('wrong params');
    }
  },
);

router.get(
  '/all-from',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const userId = Number(req.user.id);
    const { senderName } = req.query;

    if (userId && senderName) {
      const sql = `
        select
          sender.username sender,
          recipient.username recipient,
          msg.message,
          msg.created_on
        from public.messages msg
          join public.users sender on (msg.sender = sender.id)
          join public.users recipient on (msg.recipient = recipient.id)
        where msg.sender in ((select id from users where username = $1), $2) and msg.recipient in ((select id from users where username = $1), $2)
        order by msg.created_on
        `;

      const args = [senderName, userId];

      const { rows } = await db.query(sql, args);

      if (rows.length > 0) {
        const { rows } = await db.query(sql, args);
        const jsonList = [];
        rows.forEach((row) => {
          jsonList.push({
            sender: row.sender,
            recipient: row.recipient,
            message: row.message,
            created: row.created_on,
          });
        });
        res.json(jsonList);
      } else {
        res.json([]);
      }
    } else {
      res.json('wrong params');
    }
  },
);
