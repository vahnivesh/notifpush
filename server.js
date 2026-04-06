const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');   // ✅ ADD THIS

const app = express();

// ✅ ADD THIS BLOCK
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.options('*', cors()); // ✅ CRITICAL (preflight fix)

app.use(express.json());

// 🔐 CONFIG
const ONESIGNAL_APP_ID = '394d5efc-c682-4cdb-9c88-bc52d271cc20';
const ONESIGNAL_API_KEY = 'os_v2_app_hfgv57ggqjgnxheixrjne4omed5ooxigukfeasfbmzyebmlrpzmwutdwelhh56u44v2jvg2feywul4q4z43jhkw2gshf3fap7rqsayi'; // ⚠️ change this later

// 🔥 SEND PUSH
app.post('/sendPush', async (req, res) => {
  const { playerId, fromNickname, fromPeerId } = req.body;

  if (!playerId) {
    return res.status(400).json({ error: 'Missing playerId' });
  }

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `basic os_v2_app_hfgv57ggqjgnxheixrjne4omeci2k2vfqiae6kvcixeu5p5qghhqnao2ssz22zqiclsxxd6pvhmv7eu6j3sqmh6ycmjjdjwkg7xgttq`
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        include_subscription_ids: [playerId],
        headings: { en: 'Zync' },
        contents: { en: `${fromNickname} sent you a message` },
        data: { peerId: fromPeerId },
        priority: 10
      })
    });

    const data = await response.json();
    console.log('Push result:', data);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Push failed' });
  }
});

// health check
app.get('/', (req, res) => {
  res.send('Zync Push Server Running');
});

app.listen(3000, () => console.log('Server running on port 3000'));
