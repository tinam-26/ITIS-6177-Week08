const express = require('express');
const app = express();
const port = 3000;

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const mariadb = require('mariadb');
const pool = mariadb.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'sample',
	port: 3306,
	connectionLimit: 5
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
	host: 'localhost:3000',
	basePath: '/',
  },
  apis: ['./server.js'], // files containing annotations as above
};

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

/**
* @swagger
* /names: 
*    get:
*      tags:
*        - api
*      summary: get agent
*      operationId: names
*      description: |
*        gets the names of the agents
*      responses:
*        '200': 
*          description: ok
*/
app.get('/names', (req, res) => {
        pool.getConnection()
        .then(conn => {
                conn.query('SELECT AGENT_NAME FROM agents')
                        .then((rows) => {
                            res.json(rows);
				console.log('names');
                                                })
        })
});

/**
* @swagger
* /contact_info:
*    get:
*      tags:
*        - api
*      summary: get agent's phone number
*      operationId: contact_info
*      description: |
*        gets the phone number of the agents
*      responses:
*        '200': 
*          description: ok
*/
app.get('/contact_info', (req, res) => {
        pool.getConnection()
        .then(conn => {
                conn.query('SELECT AGENT_NAME, PHONE_NO  FROM agents')
                        .then((rows) => {
                            res.json(rows);
                                                })
        })
});


/**
* @swagger
* /countries:
*    get:
*      tags:
*        - api
*      summary: get all distinct countries
*      operationId: countries
*      responses:
*        '200': 
*          description: ok
*/
app.get('/countries', (req, res) => {
    pool.getConnection()
    .then(conn => {
            conn.query('SELECT DISTINCT COUNTRY from agents ORDER BY COUNTRY')
                    .then((rows) => {
                        res.json(rows);
                    })
    })
});

console.log('Server running at http://localhost:3000');
app.listen(port,() =>{
	console.log('listening!!')
})

/**
*
* @swagger
* /newAgent: 
*    post:
*      tags:
*        - api
*      summary: adds new agent
*      operationId: newAgent
*      description: |
*        By passing in the appropriate options, you can create a new agent
*      parameters:
*        - in: query
*          name: AGENT_CODE
*          description: pass the agent's code (up to 9 characters)
*          required: true
*          schema:
*            type: string
*        - in: query
*          name: AGENT_NAME
*          description: agent's name
*          required: true
*          schema:
*            type: string
*
*      responses:
*        '200':
*          description: new agent sucessfully added
*        '400':
*          description: bad input parameter
*/

app.post('/newAgent', (req, res) => {
	console.log(req.query);   
 pool.getConnection()
    .then(conn => {
            conn.query('INSERT INTO agents (`AGENT_CODE`, `AGENT_NAME`) VALUES (?, ?)', [req.query.AGENT_CODE, req.query.AGENT_NAME])
		.then((rows) => {
			res.sendStatus(200);
		})
    })
});


/**
*
* @swagger
* /updateAgent:
*    put:
*      tags:
*        - api
*      summary: updates agent
*      operationId: updateAgent
*      description: |
*        By passing in the appropriate options, you can update an agent
*      parameters:
*        - in: query
*          name: AGENT_NAME
*          description: agent's name
*          required: true
*          schema:
*            type: string
*        - in: query
*          name: WORKING_AREA
*          description: agent's working area
*          required: true
*          schema:
*            type: string
*        - in: query
*          name: COMMISSION
*          description: pass the agent's commission
*          required: true
*          schema:
*            type: number
*        - in: query
*          name: PHONE_NO
*          description: agent's phone number
*          required: true
*          schema:
*            type: number
*        - in: query
*          name: COUNTRY
*          description: agent's country
*          required: true
*          schema:
*            type: string
*        - in: query
*          name: AGENT_CODE
*          description: pass the agent's code (up to 6 characters)
*          required: true
*          schema:
*            type: string
*
*      responses:
*        '200':
*          description: new agent sucessfully updated
*        '400':
*          description: bad input parameter
 */
app.patch('/updateAgentName', (req, res) => {
    pool.getConnection()
    .then(conn => {
            conn.query('UPDATE agents SET AGENT_NAME = ? WHERE AGENT_CODE = ?', [req.query.AGENT_NAME, req.query.AGENT_CODE])
                    .then((rows) => {
                        res.sendStatus(200);
                    })
    })
});

/**
*
* @swagger
* /updateAgentName:
*    patch:
*      tags:
*        - api
*      summary: updates agent name
*      operationId: updateAgentName
*      description: |
*        By passing in the appropriate options, you can update the agent's name
*      parameters:
*        - in: query
*          name: AGENT_NAME
*          description: agent's name
*          required: true
*          schema:
*            type: string
*        - in: query
*          name: AGENT_CODE
*          description: pass the agent's code (up to 6 characters)
*          required: true
*          schema:
*            type: string
*
*      responses:
*        '200':
*          description: new agent sucessfully added
*        '400':
*          description: bad input parameter
*/

    app.put('/updateAgent', (req, res) => {
        pool.getConnection()
        .then(conn => {
                conn.query('UPDATE agents SET AGENT_NAME = ?, WORKING_AREA = ?, COMMISSION = ?, PHONE_NO = ?, COUNTRY = ? WHERE AGENT_CODE = ?', [req.query.AGENT_NAME, req.query.WORKING_AREA, req.query.COMMISSION, req.query.PHONE_NO, req.query.COUNTRY, req.query.AGENT_CODE])
                        .then((rows) => {
                            res.sendStatus(200);
                        })
        })
    });
/**
*
* @swagger
* /deleteAgent:
*    delete:
*      tags:
*        - api
*      summary: updates agent name
*      operationId: updateAgentName
*      description: |
*        By passing in the appropriate options, you can delete the agent     
*      parameters:
*        - in: query
*          name: AGENT_CODE
*          description: pass the agent's code (up to 6 characters)
*          required: true
*          schema:
*            type: string
*
*      responses:
*        '200':
*          description: new agent sucessfully added
*        '400':
*          description: bad input parameter
*/  
  app.delete('/deleteAgent', (req, res) => {
        pool.getConnection()
        .then(conn => {
                conn.query('DELETE FROM agents WHERE AGENT_CODE = ?', [req.query.AGENT_CODE])
                        .then((rows) => {
                            res.sendStatus(200);
                        })
        })
    });
