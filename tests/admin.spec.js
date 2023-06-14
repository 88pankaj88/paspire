const request = require('supertest');
const app = require("../app");

let validToken;

describe('Admin test suite', () => {
    it('tests /admin/auth with valid creds', async() => {
        const response = await request(app).post("/api/v1/admin/auth").send({username: 'pankajAdmin88', password: 'abc123'});
        expect(response.body.data.success).toEqual(true);
        expect(response.body.data).toHaveProperty('token');
        expect(response.statusCode).toBe(200);

        validToken = response.body.data.token;
    });
    it('tests /admin/auth with invalid creds', async() => {
        const response = await request(app).post("/api/v1/admin/auth").send({username: 'dummy', password: 'dummy'});
        expect(response.body.data.success).toEqual(false);
        expect(response.statusCode).toBe(200);
    });
    it('tests /admin/logout with valid auth token', async() => {
        const logoutResp = await request(app).post("/api/v1/admin/logout").set('Authorization', validToken);
        expect(logoutResp.body.data.success).toEqual(true);
        expect(logoutResp.statusCode).toBe(200);
    });
    it('tests /admin/logout with invalid auth token', async() => {
        const logoutResp = await request(app).post("/api/v1/admin/logout").set('Authorization', `dummy`);
        expect(logoutResp.statusCode).toBe(401);
    });
});