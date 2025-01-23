const admin = require('../config/firebase-admin');

const topicName = "test-topic";

const sendnotification = async (req, res) => {
    const message = {
        notification: {
            title: 'Test Notification',
            body: 'This is a test notification for topics',
        },
        topic: topicName,
    };
    admin
        .messaging()
        .send(message)
        .then((response) => {
            console.log("Successfully sent message:", response);
            return res.status(200).json({ msg: 'Notification sent to topic' });
        })
        .catch((error) => {
            console.error('Error sending message:', error);
            return res.status(400).json({ error });
        });
};
const submitToken = (req, res) => {
    const { deviceToken } = req.body;

    if (!deviceToken) {
        return res.status(400).json({ error: 'Device token is required.' });
    }

    return res.json({ msg: 'Device token received.', deviceToken });
};

module.exports = {
   sendnotification,
   submitToken,
  };
  