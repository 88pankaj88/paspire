const request = require('supertest');
const app = require("../app");

let validToken;

describe('Customer test suite', () => {
    it('tests /customer/auth with valid creds', async() => {
        const response = await request(app).post("/api/v1/customer/auth").send({username: 'pankaj88', password: 'abc123'});
        expect(response.body.data.success).toEqual(true);
        expect(response.body.data).toHaveProperty('token');
        expect(response.statusCode).toBe(200);

        validToken = response.body.data.token;
    });
    it('tests /customer/auth with invalid creds', async() => {
        const response = await request(app).post("/api/v1/customer/auth").send({username: 'dummy', password: 'dummy'});
        expect(response.body.data.success).toEqual(false);
        expect(response.statusCode).toBe(200);
    });
    it('tests /customer/logout with valid auth token', async() => {
        const logoutResp = await request(app).post("/api/v1/customer/logout").set('Authorization', validToken);
        expect(logoutResp.body.data.success).toEqual(true);
        expect(logoutResp.statusCode).toBe(200);
    });
    it('tests /customer/logout with invalid auth token', async() => {
        const logoutResp = await request(app).post("/api/v1/customer/logout").set('Authorization', `dummy`);
        expect(logoutResp.statusCode).toBe(401);
    });
});