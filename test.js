const request = require('supertest');
const app = require('./index');

describe('Conversation Flow REST API', () => {
    it('Should execute the conversation flow via REST API', async () => {
        const conversationFlow = [
            "async function step1() { \
                const question = \"Do you want to continue?\"; \
                const options = [\"Yes\", \"No\"]; \
                return { question, options }; \
            }",
            "async function step2(response) { \
                if (response === \"Yes\") { \
                    return \"next\"; \
                } else if (response === \"No\") { \
                    return 4; \
                } else { \
                    return \"Invalid response. Please select \\\"Yes\\\" or \\\"No\\\".\"; \
                } \
            }",
            "async function step3() { \
                return \"next\"; \
            }",
            "async function step4() { \
                return \"No selected\"; \
            }"
        ];

        const response = await request(app)
            .post('/conversation')
            .send(conversationFlow);
        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.reply).toBe('No selected'); // Adjust the expected reply based on your flow
    });
});