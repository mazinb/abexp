const request = require('supertest');
const app = require('./index');

describe('Conversation Flow REST API', () => {
    it('Should execute the conversation flow via REST API', async () => {
        const conversationFlow = require('./test_flow');

        const response = await request(app)
            //.post('/conversation')
            .post('/conversation2')
            .send(conversationFlow);
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.reply).toBe('You chose to stop.'); // Adjust the expected reply based on your flow
    });
});