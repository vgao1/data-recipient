## Getting Started
1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Create a MongoDB Atlas instance.
4. Once created, click the **CONNECT** button, select **driver**, and copy the srv connection string. If using username and password, the url should look something like this: `mongodb+srv://<username>:<password>@cluster0.p82ijqd.mongodb.net/?retryWrites=true&w=majority`. Make sure to replace username and password with your actual values.
5. Create `.env` file at the root directory. Add 
    ```
    MONGO_SRV=<connection url>
    ```
    to the `.env` file and replace `<connection url>` with your MongoDB instance's srv connection string from step 4. 

6. Using two seperate, dedicated terminals:  
    Run `npm run dev:server` to start the backend server.  
    Run `npm run dev:client` to start the client server.
