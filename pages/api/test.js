// pages/api/test.js
const nextConnect = require('next-connect').default;

const handler = nextConnect();

handler.get((req, res) => {
  res.json({ message: 'NextConnect is working!' });
});

export default handler;
