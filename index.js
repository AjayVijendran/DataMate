const express = require('express');
const app = express();
const port = 3000

const sql = require('mssql');

const config = {
    user: 'CloudSA36803168', // better stored in an app setting such as process.env.DB_USER
    password: 'Ajay@123', // better stored in an app setting such as process.env.DB_PASSWORD
    server: 'datamate.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
    port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: 'MyDB', // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}


console.log("Starting...");

async function connectAndQuery(q) {
    try {
        var poolConnection = await sql.connect(config);

        console.log("Reading rows from the Table...");
        var resultSet = await poolConnection.request().query(q);

        console.log(`${resultSet.recordset.length} rows returned.`);

        // output column headers
        var columns = "";
        for (var column in resultSet.recordset.columns) {
            columns += column + ", ";
        }
        console.log("%s\t", columns.substring(0, columns.length - 2));

        // ouput row contents from default record set

        // close connection only when we're certain application is finished
        poolConnection.close();
        console.log(resultSet);
        return resultSet.recordset
    } catch (err) {
        console.error(err.message);
    }
}
app.get('/', (req, res) => {
  const data = connectAndQuery(req);
  res.send(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})