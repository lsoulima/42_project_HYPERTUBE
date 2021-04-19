/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: 'http'
 *       scheme: 'bearer'
 *       bearerFormat: 'JWT'
 *
 * tags:
 *   name: Users
 *   description: All about /api/users
 */

const UserController = require('../controllers/user.controller');
const UserMiddlewares = require('../middlewares/user.middlewares');

module.exports = ( passport ) => {
	const AuthMiddlewares = require('../middlewares/auth.middlewares')(passport);
	const routes = require('express').Router();

	return routes
	.post("/register", UserMiddlewares.register, UserController.register)
	.post("/login", UserMiddlewares.login, UserController.login)
	.post("/logout", AuthMiddlewares.isAuth, UserController.logout)
	.post("/resetpassword", UserMiddlewares.resetPassword, UserController.resetPassword)
	.post("/verify/token", UserController.verifyToken)
	.patch("/verify/account", UserMiddlewares.verifyAccount, UserController.verifyAccount)
	.patch("/newpassword", UserMiddlewares.newpassword, UserController.newpassword)
	.patch("/edit/informations", AuthMiddlewares.isAuth, UserMiddlewares.editInfos, UserController.editInfos)
	.patch("/edit/password", AuthMiddlewares.isAuth, UserMiddlewares.changepassword, UserController.changepassword)
	.put("/upload/profile", AuthMiddlewares.isAuth, UserController.uploadProfile)
	// OAuth with INTRA strategy
	.get("/auth/42", passport.authenticate('42'))
	.get("/auth/42/callback", (req, res, next) => {
		passport.authenticate( '42', { session: false }, ( err, data ) => {
			const JSONdata = JSON.parse( JSON.stringify( data ) );

			if ( !err && !data ) res.status( 400 ).redirect(`${ process.env.URL_CLIENT }/login?error=access-denied`);
			else if ( JSONdata.error ) res.status( 400 ).redirect(`${ process.env.URL_CLIENT }/login?error=${JSONdata.error.split(" ").join("-")}`);
			else res.status( 200 ).cookie("token", JSONdata.token, { httpOnly: false }).redirect(`${ process.env.URL_CLIENT }/library`);
		})(req, res, next)
	})
	// OAuth with GOOGLE strategy
	.get("/auth/google", passport.authenticate('google', { scope: [ 'email', 'profile' ] }))
	.get("/auth/google/callback", (req, res, next) => {
		passport.authenticate( 'google', { session: false }, ( err, data ) => {
			const JSONdata = JSON.parse( JSON.stringify( data ) );

			if ( !err && !data ) res.status( 400 ).redirect(`${ process.env.URL_CLIENT }/login?error=access-denied`);
			else if ( JSONdata.error ) res.status( 400 ).redirect(`${ process.env.URL_CLIENT }/login?error=${JSONdata.error.split(" ").join("-")}`);
			else res.status( 200 ).cookie("token", JSONdata.token, { httpOnly: false }).redirect(`${ process.env.URL_CLIENT }/library`);
		})(req, res, next)
	})
	// OAuth with LINKEDIN strategy
	.get("/auth/linkedin", passport.authenticate('linkedin'))
	.get('/auth/linkedin/callback', (req, res, next) => {
		passport.authenticate( 'linkedin', { session: false }, ( err, data ) => {
			const JSONdata = JSON.parse( JSON.stringify( data ) );

			if ( !err && !data ) res.status( 400 ).redirect(`${ process.env.URL_CLIENT }/login?error=access-denied`);
			else if ( JSONdata.error ) res.status( 400 ).redirect(`${ process.env.URL_CLIENT }/login?error=${JSONdata.error.split(" ").join("-")}`);
			else res.status( 200 ).cookie("token", JSONdata.token, { httpOnly: false }).redirect(`${ process.env.URL_CLIENT }/library`);
		})(req, res, next)
	})
	.get("/profile", AuthMiddlewares.isAuth, UserController.profile)
	.get("/find/id/:id", UserMiddlewares.findById, UserController.findById)
	.get("/find/username/:username", UserMiddlewares.findByUsername, UserController.findByUsername)
}

/**
 * @swagger
 *
 * /api/users/register:
 *   post:
 *     summary: Register
 *     description: Create a new account
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: User's firstname
 *                 required: true
 *               lastname:
 *                 type: string
 *                 description: User's lastname
 *                 required: true
 *               username:
 *                 type: string
 *                 description: User's usersname
 *                 required: true
 *                 unique: true
 *               email:
 *                 type: string
 *                 description: User's email
 *                 required: true
 *                 unique: true
 *               password:
 *                 type: string
 *                 description: User's password
 *                 required: true
 *               confirmpassword:
 *                 type: string
 *                 description: password confirmation 
 *                 required: true
 *             example:
 *               firstname: "hassan"
 *               lastname: "alami"
 *               username: "testUser06"
 *               email: "testUser06@gmail.ma"
 *               password: "test_User06"
 *               confirmpassword: "test_User06"
 *
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Created, Successufull operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 message:
 *                   type: string
 *                   description: response message
 *               example:
 *                 success: true
 *                 message: "Your account has been created successfully !"
 *       400:
 *         description: Bad request, registration failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to register !"
 *
 */

/**
 * @swagger
 *
 * /api/users/resetpassword:
 *   post:
 *     summary: Reset password
 *     description: User can reset his password account
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email
 *                 required: true
 *                 unique: true
 *             example:
 *               email: "testUser06@gmail.ma"
 *
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 message:
 *                   type: string
 *                   description: Message of success
 *               example:
 *                 success: true
 *                 message: "Your password account has been reset !"
 *       400:
 *         description: Bad request, reset password failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to reset your password account !"
 *
 */

/**
 * @swagger
 *
 * /api/users/login:
 *   post:
 *     summary: Login
 *     description: User can login with his username and password
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *                 required: true
 *                 unique: true
 *             example:
 *               username: "testUser06"
 *               password: "test_User06"
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or failure
 *                 message:
 *                   type: string
 *                   description: Message of success
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: User's username
 *                     username:
 *                        type: string
 *                        description: User's username
 *                 token:
 *                   type: string
 *                   description: JWT token
 *               example:
 *                 success: true
 *                 message: "Logged successfully"
 *                 user:
 *                   _id: "6069b686b067200b23dc789f"
 *                   username: "aguismi"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDY5YjY4NmIwNjcyMDBiMjNkYzc4OWYiLCJ1c2VybmFtZSI6ImFndWlzbWkiLCJpYXQiOjE2MTc2MzMzMjN9.kcdd5C-cOowUg4SSGxG41L4XbF0vSJ55-sqNTIyfG54"
 *       400:
 *         description: Bad request, failed to sign in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to login !"
 */

/**
 * @swagger
 *
 * /api/users/logout:
 *   post:
 *     summary: Logout
 *     description: User can logout
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or failure
 *                 message:
 *                   type: string
 *                   description: Message of success
 *               example:
 *                 success: true
 *                 message: "Logout successfully !"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Your are not authorized !"
 *
 */

/**
 * @swagger
 *
 * /api/users/newpassword:
 *   patch:
 *     summary: New password after reset account
 *     description: User can change his password
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Reset token
 *                 required: true
 *               newpassword:
 *                 type: string
 *                 description: User's new password
 *                 required: true
 *               confirmpassword:
 *                 type: string
 *                 description: password confirmation
 *                 required: true
 *                 unique: true
 *             example:
 *               token: "5ed522876dd5a8d899ccef96df1c871068abcb4293bc64b02e5ecba3da3e491d479d6c858d429ef5c4491caa643690ca2ba615b524f9e1c5d408c4a893b7a6b0"
 *               newpassword: "test_User00"
 *               confirmpassword: "test_User00"
 *
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 message:
 *                   type: string
 *                   description: Message of success
 *               example:
 *                 success: true
 *                 message: "Your password has been changed !"
 *       400:
 *         description: Bad request, change password failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to change your password !"
 *
 */

/**
 * @swagger
 *
 * /api/users/verify/account:
 *   patch:
 *     summary: Verify account
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: activation token
 *                 required: true
 *             example:
 *               token: "5ed522876dd5a8d899ccef96df1c871068abcb4293bc64b02e5ecba3da3e491d479d6c858d429ef5c4491caa643690ca2ba615b524f9e1c5d408c4a893b7a6b0"
 *
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 message:
 *                   type: string
 *                   description: Message of success
 *               example:
 *                 success: true
 *                 message: "Your account has been activated !"
 *       400:
 *         description: Bad request, activation account failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to activate your account !"
 *
 */

/**
 * @swagger
 *
 * /edit/informations:
 *   patch:
 *     summary: Edit user informations
 *     description: A user can change his informations
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: User's firstname
 *               lastname:
 *                 type: string
 *                 description: User's lastname
 *               username:
 *                 type: string
 *                 description: User's usersname
 *               email:
 *                 type: string
 *                 description: User's email
 *             example:
 *               firstname: "hassan"
 *               lastname: "alami"
 *               username: "testUser06"
 *               email: "testUser06@gmail.ma"
 *
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 message:
 *                   type: string
 *                   description: response message
 *               example:
 *                 success: true
 *                 message: "Your informations has been changed successfully !"
 *       400:
 *         description: Bad request, Edit informations failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to change your informations !"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Your are not authorized !"
 *
 */

/**
 * @swagger
 *
 * /api/users/edit/password:
 *   patch:
 *     summary: Edit user password
 *     description: A user can change his password
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldpassword:
 *                 type: string
 *                 description: User's old password
 *               newpassword:
 *                 type: string
 *                 description: User's new password
 *               confirmpassword:
 *                 type: string
 *                 description: Confirmation password
 *             example:
 *               oldpassword: "test_User00"
 *               newpassword: "test_User22"
 *               confirmpassword: "test_User22"
 *
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 message:
 *                   type: string
 *                   description: response message
 *               example:
 *                 success: true
 *                 message: "Your password has been changed successfully !"
 *       400:
 *         description: Bad request, Edit password failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to change your password !"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Your are not authorized !"
 *
 */

/**
 * @swagger
 *
 * /api/users/upload/profile:
 *   put:
 *     summary: Upload profile picture
 *     description: A user can upload a profile picture
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 type: file
 *                 description: profile picture
 *             example:
 *               profile: "test.png"
 *
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 message:
 *                   type: string
 *                   description: response message
 *                 data:
 *                   type: string
 *                   description: path of new profile picture that has been uploaded
 *               example:
 *                 success: true
 *                 message: "Your profile picture has been uploaded successfully !"
 *                 data: "http://localhost:3001/api/public/users-pictures/profile-ayoub-guismi-1617963901369.png"
 *       400:
 *         description: Bad request, Edit password failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to upload your profile picture !"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Your are not authorized !"
 *
 */

/**
 * @swagger
 *
 * /api/users/profile:
 *   get:
 *     summary: Get profile informations
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: ObjectID
 *                       description: User's id
 *                     firstname:
 *                       type: string
 *                       description: User's firstname
 *                     lastname:
 *                       type: string
 *                       description: User's lastname
 *                     username:
 *                       type: string
 *                       description: User's usersname
 *                       unique: true
 *                     email:
 *                       type: string
 *                       description: User's email
 *                     profile:
 *                       type: string
 *                       description: User's profile picture
 *                     fortyTwoId:
 *                       type: string
 *                       description: ID of 42 account
 *                     googleId:
 *                       type: string
 *                       description: ID of Google account
 *                     githubId:
 *                       type: string
 *                       description: ID of Github account 
 *                     modifyAt:
 *                       type: string
 *                       format: date
 *                       description: Last date modification 
 *                     createdAt:
 *                       type: string
 *                       format: date
 *                       description: Account creation date
 *               example:
 *                 success: true
 *                 data:
 *                   _id: "606ddd14a93ff5c6239edbdc"
 *                   firstname: "ayoub"
 *                   lastname: "guismi"
 *                   username: "aguismi"
 *                   email: "i.guismi@gmail.com"
 *                   profile: null
 *                   fortyTwoId: null
 *                   googleId: null
 *                   githubId: null
 *                   modifyAt: null
 *                   createdAt: "2021-04-07T16:25:56.838Z"
 *       400:
 *         description: Bad request, load profile informations failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to load profile informations !"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Your are not authorized !"
 *
 */

/**
 * @swagger
 *
 * /api/users/find/id/{id}:
 *   get:
 *     summary: Get user informations by id
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectID
 *         description: The user ID
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: ObjectID
 *                       description: User's id
 *                     firstname:
 *                       type: string
 *                       description: User's firstname
 *                     lastname:
 *                       type: string
 *                       description: User's lastname
 *                     username:
 *                       type: string
 *                       description: User's usersname
 *                       unique: true
 *                     profile:
 *                       type: string
 *                       description: User's profile picture
 *               example:
 *                 success: true
 *                 data:
 *                   _id: "606ddd14a93ff5c6239edbdc"
 *                   firstname: "ayoub"
 *                   lastname: "guismi"
 *                   username: "aguismi"
 *                   email: "i.guismi@gmail.com"
 *                   profile: null
 *       400:
 *         description: Bad request, load user informations failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to load user informations !"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Your are not authorized !"
 *
 */

/**
 * @swagger
 *
 * /api/users/find/username/{username}:
 *   get:
 *     summary: Get user informations by username
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's username
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: ObjectID
 *                       description: User's id
 *                     firstname:
 *                       type: string
 *                       description: User's firstname
 *                     lastname:
 *                       type: string
 *                       description: User's lastname
 *                     username:
 *                       type: string
 *                       description: User's usersname
 *                       unique: true
 *                     profile:
 *                       type: string
 *                       description: User's profile picture
 *               example:
 *                 success: true
 *                 data:
 *                   _id: "606ddd14a93ff5c6239edbdc"
 *                   firstname: "ayoub"
 *                   lastname: "guismi"
 *                   username: "aguismi"
 *                   email: "i.guismi@gmail.com"
 *                   profile: null
 *       400:
 *         description: Bad request, load user informations failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Failed to load user informations !"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "Your are not authorized !"
 *
 */

/**
 * @swagger
 *
 * /api/users/verify/token:
 *   post:
 *     summary: Verify a token
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: token to verify
 *                 required: true
 *             example:
 *               token: "5ed522876dd5a8d899ccef96df1c871068abcb4293bc64b02e5ecba3da3e491d479d6c858d429ef5c4491caa643690ca2ba615b524f9e1c5d408c4a893b7a6b0"
 *
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 valide:
 *                   type: boolean
 *                   description: Valide token or not
 *               example:
 *                 success: true
 *                 valide: true
 *       400:
 *         description: Bad request, activation account failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success operation or not
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 success: false
 *                 error: "No token to verify !"
 *
 */