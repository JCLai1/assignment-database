const MongoClient = require("mongodb").MongoClient;
const User = require("./user");
const jwt = require("jsonwebtoken");
function generateAccessToken(payload) {
	return jwt.sign(payload, "my-super-secret", {expiresIn: "1y"});
}

MongoClient.connect(
	"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.3owbc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
})
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const option = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Gym management system API',
			version: '1.0.0',
		},
		components:
		{
			securitySchemes:{
				jwt:{
					type: 'http',
					scheme: 'bearer',
					in: 'header',
					bearerFormat: 'JWT'
					},
			},
		security: [{"jwt": []}]
		},
	},
	apis: ['./main.js'],
	
};
const swaggerSpec = swaggerJsdoc(option);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

function authenticate(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) return res.sendStatus(401);
	jwt.verify(token, "my-super-secret", (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	}
	)
}

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     description: User Details
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Username of user
 *     responses:
 *       '200':
 *         description: User details
 *       401:
 *         description: User does not exist
 */

app.get('/user/:id', async (req, res) => {
	const {id} = req.params;
	const user = await User.getUser(id);
	if (user != "User does not exist") {
		res.status(200).json([{
			username: user[0].username,
			role: user[0].role,
			Membership_start: user[0].Membership_start
		}]);
	}
	else {
		res.status(401).send("User does not exist");
	}
   
})

app.get('/hello', (req, res) => {
	res.send('Hello BENR2423')
    console.log("Hello BENR2423")
})

/**
 * @swagger
 * /loginuser:
 *   post:
 *     description: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successful login
 *       401:
 *         description: Invalid username or password
 */
app.post('/loginuser', async (req, res) => {
	console.log(req.body);
	
	const user = await User.loginuser(req.body.username, req.body.password);
	
    if (user !="false") {
        const token = generateAccessToken({ username: user[0].username ,role: user[0].role});
		//res.json(user);
		res.status(200).json([{
			_id: user[0]._id,
			username: user[0].username,
			Membership_start: user[0].Membership_start,
			token: token,
			role: user[0].role
		}])
		
	}
    else
        res.status(401).send("Invalid username or password");

	// res.json({
	// 	_id: '123456',
	// 	name: 'test',
	// 	age: 18,
	// })
})

/**
 * @swagger
 * /loginadmin:
 *   post:
 *     description: Login admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: admin successful login
 *       401:
 *         description: Invalid username or password
 */
app.post('/loginadmin', async (req, res) => {
	console.log(req.body);
	
	const user = await User.loginadmin(req.body.username, req.body.password);
	
    if (user !="false") {
        const token = generateAccessToken({ username: user[0].username ,role: user[0].role});
		//res.json(user);
		res.status(200).json([{
			_id: user[0]._id,
			username: user[0].username,
			token: token,
			role: user[0].role
		}])
		
	}
    else
        res.status(401).send("Invalid username or password");

	// res.json({
	// 	_id: '123456',
	// 	name: 'test',
	// 	age: 18,
	// })
})

/**
 * @swagger
 * /loginworker:
 *   post:
 *     description: Login worker
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Worker successful login
 *       401:
 *         description: Invalid username or password
 */
app.post('/loginworker', async (req, res) => {
	console.log(req.body);
	
	const user = await User.loginworker(req.body.username, req.body.password);
	
    if (user !="false") {
        const token = generateAccessToken({ username: user[0].username ,role: user[0].role});
		//res.json(user);
		res.status(200).json([{
			_id: user[0]._id,
			username: user[0].username,
			token: token,
			role: user[0].role
		}])
		
	}
    else
        res.status(401).send("Invalid username or password");

	// res.json({
	// 	_id: '123456',
	// 	name: 'test',
	// 	age: 18,
	// })
})

/**
 * @swagger
 * /registeradmin:
 *   post:
 *     description: Register admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       200:
 *         description: admin successful register
 *       401:
 *         description: User name already exists
 */
app.post('/registeradmin', async (req, res) => {
	//console.log(req.body);
	
	
	var user = await User.registeradmin(req.body.username, req.body.password,req.body.phone,req.body.gender);
		if(user != "false"){
			res.status(200).json(user);
			console.log(user);
		}
		else
			res.status(401).send("User name already exists")
	
	
	// res.json({
	// 	_id: '123456',
	// 	name: 'test',
	// 	age: 18,
	// })
	
})

/**
 * @swagger
 * /registeruser:
 *   post:
 *     description: Register user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *               Membership_start:
 *                 type: string
 *     responses:
 *       200:
 *         description: user successful register
 *       401:
 *         description: User name already exists
 */
app.post('/registeruser', async (req, res) => {
	console.log(req.body);
	
	
		var user = await User.registeruser(req.body.username, req.body.password,req.body.Membership_start,req.body.phone,req.body.gender);
		if(user != "false")
			res.status(200).json(user);
		else
			res.status(401).send("User name already exists")
	
	
	// res.json({
	// 	_id: '123456',
	// 	name: 'test',
	// 	age: 18,
	// })
	
})

/**
 * @swagger
 * /registerworker:
 *   post:
 *     description: Register worker
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       200:
 *         description: worker successful register
 *       401:
 *         description: User name already exists
 */

app.post('/registerworker', async (req, res) => {
	console.log(req.body);
	
	
		var user = await User.registerworker(req.body.username, req.body.password,req.body.phone,req.body.gender);
		if(user != "false")
			res.status(200).json(user);
		else
			res.status(401).send("User name already exists")
	
	// res.json({
	// 	_id: '123456',
	// 	name: 'test',
	// 	age: 18,
	// })
	
})

/**
 * @swagger
 * /update:
 *   patch:
 *     security:
 *       - jwt: []
 *     description: Update User Membership
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Membership updated
 *       401:
 *         description: User name not found
 *       403:
 *         description: Unauthorised
 */
app.patch('/update',authenticate, async (req, res) => {
	console.log(req.body);
	if(req.user.role == "admin" || req.user.role == "worker"){

	var user = await User.update(req.body.username, req.body.date);
	if(user != "User does not exist")
		res.send("Membership date updated")
	else
		res.status(401).send("User name does not exist");
	}
	else{
		res.status(403).send("Unauthorised")
	// res.json({
	// 	_id: '123456',
	// 	name: 'test',
	// 	age: 18,
	// })
}
})

/**
 * @swagger
 * /deleteuser:
 *   delete:
 *     security:
 *       - jwt: []
 *     description: Delete User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *              
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: User name not found
 *       403:
 *         description: Unauthorised
 */
app.delete('/deleteuser',authenticate, async (req, res) => {
	console.log(req.body);
	if(req.user.role == "admin"){
		var user = await User.deleteuser(req.body.username);
		if(user!= "User does not exist")
			res.send("User deleted")
		else
			res.status(401).send("User name does not exist");
	// res.json({
	// 	_id: '123456',
	// 	name: 'test',
	// 	age: 18,
	// })
	}
	else{
		res.status(403).send("Unauthorised")
	}
})

/**
 * @swagger
 * /deleteworker:
 *   delete:
 *     security:
 *       - jwt: []
 *     description: Delete worker
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *              
 *     responses:
 *       200:
 *         description: Worker deleted
 *       401:
 *         description: User name not found
 *       403:
 *         description: Unauthorised
 */
app.delete('/deleteworker',authenticate, async (req, res) => {
	console.log(req.body);
	if(req.user.role == "admin"){
		var user = await User.deleteworker(req.body.username);
		if(user!= "Worker does not exist")
			res.send("Worker deleted")
		else
			res.status(401).send("User name does not exist");
	// res.json({
	// 	_id: '123456',
	// 	name: 'test',
	// 	age: 18,
	// })
	}
	else{
		res.status(403).send("Unauthorised")
	}
})

/**
 * @swagger
 * /deleteadmin:
 *   delete:
 *     security:
 *       - jwt: []
 *     description: Delete Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *              
 *     responses:
 *       200:
 *         description: Admin deleted
 *       401:
 *         description: User name not found
 *       403:
 *         description: Unauthorised
 */
app.delete('/deleteadmin',authenticate, async (req, res) => {
	console.log(req.body);
	if(req.user.role == "admin"){
		var user = await User.deleteadmin(req.body.username);
		if(user!= "Admin does not exist")
			res.send("Admin deleted")
		else
			res.status(401).send("User name does not exist");
	// res.json({
	// 	_id: '123456',
	// 	name: 'test',
	// 	age: 18,
	// })
	}
	else{
		res.status(403).send("Unauthorised")
	}
})

/**
 * @swagger
 * /analyzeday:
 *   post:
 *     security:
 *       - jwt: []
 *     description: Analyze customer amount per day
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *              
 *     responses:
 *       200:
 *         description: Customer amount per day
 *       401:
 *         description: User enter day in wrong format
 *       403:
 *         description: User is not admin
 */
app.post('/analyzeday',authenticate, async (req, res) => {
	console.log(req.body);
	if(req.user.role == "admin"){
		var user = await User.analysis(req.body.day);
		if(user == "Day does not exist")
			res.status(401).send("please enter the day with capital letter for 1st alphabetical letter(Friday)")
		else
			res.status(200).send("Customer amount: " + user);
	// res.json({
	// 	_id: '123456',
	// 	name: 'test',
	// 	age: 18,
	// })
	 }
	else{
		res.status(403).send("Unauthorised")
	}
}

)

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
