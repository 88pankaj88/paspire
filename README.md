## Assumptions

Since no db & cache usage is specified, I am keeping following data models and related cache data, in-memory only.

    -Auth tokens
    -Loans
    -Repayments
    -Customers (with sample credentials)
    -Admins (with sample credentials)

    Hence no ORM being used
    Not using await async keywords as all operations are in-memory.

    Not maintaing history of dates on which loan & repayment status were changed
    Not storing which admin approved/rejected loan as its of no use in current scope
    Not building loan listing api for customer as its of no use in current scope
    Customer repayment amount is not allwed to be less than scheduled repayment amount
    Customer excess repayment amount is not adjusted against next scheduled repayment.
    Multiple auth tokens can co-exist for customer & admin both

# Steps to run

Option 1:
Install nodejs & npm
cd paspire/
Run `npm start`

To change port, edit .env file

Option 2:

#docker build . -t {imageName}
#docker run -p 8080:2001 -d {imageName}

## Important.

To run the project, create a new file .env in root of project and add below contents to it.

    NODE_ENV=development
    APP_NAME=Paspire
    APP_REST_PROTOCOL=http
    APP_HOST=localhost
    APP_PORT=2001
    APP_STATIC_PATH=public/build

# Steps to run Unit Tests

    npm test
