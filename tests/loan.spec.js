const request = require('supertest');
const app = require("../app");
const globalConstants = require('../utils/constants/globals');
let validCustomerToken;
let validAdminToken;
let loanId;
let repaymentId;
let repaymentAmount;

describe('Loan Apply api test suite', () => {
    it('tests loan apply url with valid auth token', async() => {
        const customerLoginResp = await request(app).post("/api/v1/customer/auth").send({username: 'pankaj88', password: 'abc123'});
        validCustomerToken = customerLoginResp.body.data.token;
        
        const response = await request(app).post("/api/v1/loan").send({amount: '100', term: '6'}).set('Authorization', validCustomerToken);
        expect(response.body.data.success).toEqual(true);
        expect(response.body.data).toHaveProperty('repayments');
        const repayments = response.body.data.repayments;
        expect(repayments[0].status).toBe(globalConstants.REPAYMENT_STATUS.PENDING);
        loanId = repayments[0].loanId;
        repaymentId = repayments[0].id;
        repaymentAmount = repayments[0].amount;
        expect(response.statusCode).toBe(200);
    });
    it('tests loan apply url with invalid auth token', async() => {
        const response = await request(app).post("/api/v1/loan").send({amount: '100', term: '6'}).set('Authorization', `dummy`);
        expect(response.statusCode).toBe(401);
    });
    it('tests loan apply url with invalid inputs', async() => {
        //with term missing in input
        let response = await request(app).post("/api/v1/loan").send({amount: '100'}).set('Authorization', validCustomerToken);
        expect(response.statusCode).toBe(412);
        
        //with 0 amount or term
        response = await request(app).post("/api/v1/loan").send({amount: '0', term: 0}).set('Authorization', validCustomerToken);
        expect(response.statusCode).toBe(412);

        //with -ve amount or term
        response = await request(app).post("/api/v1/loan").send({amount: -20, term: -2}).set('Authorization', validCustomerToken);
        expect(response.statusCode).toBe(412);
    });
});

describe('Loan admin action api test suite', () => {
    it('tests loan admin action url with valid auth token', async() => {
        const adminLoginResp = await request(app).post("/api/v1/admin/auth").send({username: 'pankajAdmin88', password: 'abc123'});
        validAdminToken = adminLoginResp.body.data.token;
        
        const response = await request(app).put("/api/v1/loan/"+loanId).send({status: 'APPROVED'}).set('Authorization', validAdminToken);
        expect(response.body.data.success).toEqual(true);
        expect(response.statusCode).toBe(200);
    });
    it('tests loan admin action api with invalid auth token', async() => {
        const response = await request(app).put("/api/v1/loan/"+loanId).send({status: 'APPROVED'}).set('Authorization', `dummy`);
        expect(response.statusCode).toBe(401);
    });
    it('tests loan admin action api with invalid inputs', async() => {
        let response = await request(app).put("/api/v1/loan/"+loanId).send({status: 'dummy'}).set('Authorization', validAdminToken);
        expect(response.statusCode).toBe(412);

        response = await request(app).put("/api/v1/loan/"+loanId).set('Authorization', validAdminToken);
        expect(response.statusCode).toBe(412);
    });
});

describe('Loan details api test suite', () => {
    it('tests get loan details api with valid auth token', async() => {
        const response = await request(app).get("/api/v1/loan/"+loanId).set('Authorization', validCustomerToken);
        expect(response.body.data.success).toEqual(true);
        expect(response.body.data).toHaveProperty('loan');
        expect(response.statusCode).toBe(200);
    });
    it('tests get loan details api with invalid auth token', async() => {
        const response = await request(app).get("/api/v1/loan/"+loanId).set('Authorization', `dummy`);
        expect(response.statusCode).toBe(401);
    });
    it('tests get loan details api with invalid inputs', async() => {
        const response = await request(app).get("/api/v1/loan/dummy").set('Authorization', validCustomerToken);
        expect(response.body.data.success).toEqual(false);
        expect(response.statusCode).toBe(200);
    });
    it('tests get loan details api with different customer token', async() => {
        const customerLoginResp = await request(app).post("/api/v1/customer/auth").send({username: 'pankaj882', password: 'abc123'});
        const otherCustomerToken = customerLoginResp.body.data.token;

        const response = await request(app).get("/api/v1/loan/"+loanId).set('Authorization', otherCustomerToken);
        expect(response.body.data.success).toEqual(false);
        expect(response.statusCode).toBe(200);
    });
});

describe('Loan payment against a repayment api test suite', () => {
    it('tests loan payment api with valid auth token', async() => {
        
        const response = await request(app).post("/api/v1/repayment/pay/"+repaymentId).send({amount: repaymentAmount}).set('Authorization', validCustomerToken);
        expect(response.body.data.success).toEqual(true);
        expect(response.statusCode).toBe(200);
    });
    it('tests loan payment api with invalid auth token', async() => {
        const response = await request(app).post("/api/v1/repayment/pay/"+repaymentId).send({amount: repaymentAmount}).set('Authorization', `dummy`);
        expect(response.statusCode).toBe(401);
    });
    it('tests loan payment api with invalid inputs', async() => {
        let response = await request(app).post("/api/v1/repayment/pay/"+repaymentId).send({amount: 0}).set('Authorization', validCustomerToken);
        expect(response.statusCode).toBe(412);

        response = await request(app).post("/api/v1/repayment/pay/"+repaymentId).send({amount: -10}).set('Authorization', validCustomerToken);
        expect(response.statusCode).toBe(412);
    });

    it('tests loan payment api with different customer token', async() => {
        const customerLoginResp = await request(app).post("/api/v1/customer/auth").send({username: 'pankaj882', password: 'abc123'});
        const otherCustomerToken = customerLoginResp.body.data.token;

        const response = await request(app).post("/api/v1/repayment/pay/"+repaymentId).send({amount: 10}).set('Authorization', otherCustomerToken);
        expect(response.body.data.success).toEqual(false);
        expect(response.statusCode).toBe(200);
    });

    it('tests loan payment api with lesser amount', async() => {
        const response = await request(app).post("/api/v1/repayment/pay/"+repaymentId).send({amount: 2}).set('Authorization', validCustomerToken);
        expect(response.body.data.success).toEqual(false);
        expect(response.statusCode).toBe(200);
    });
});