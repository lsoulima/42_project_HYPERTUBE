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
 *   name: Comments
 *   description: All about /api/comments
 */

const commentsController = require("../controllers/comments.controller");
const commentMiddlewares = require("../middlewares/comments.middlewares");
const moviesMiddlewares = require("../middlewares/movies.middlewares");
const routes = require('express').Router();

module.exports = ( passport ) => {
	const AuthMiddlewares = require('../middlewares/auth.middlewares')(passport);

    return routes
    .get("/list/:id", AuthMiddlewares.isAuth, moviesMiddlewares.isMovieIdValid, commentsController.getCommentsMovie)
    .post("/add/:id", AuthMiddlewares.isAuth, moviesMiddlewares.isMovieIdValid, commentsController.addCommentMovie)
    .delete("/delete/:id", AuthMiddlewares.isAuth, commentMiddlewares.deleteCommentMovie, commentsController.deleteCommentMovie)
}

/**
 * @swagger
 *
 * /api/comments/list/{id}:
 *   get:
 *     summary: Load comments of a movie
 *     description: Get comments of a movie by id
 *     tags:
 *       - Comments
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     format: ObjectId
 *                     description: Comment id
 *                   userId:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         format: ObjectId
 *                         description: User id
 *                       username:
 *                         type: string
 *                         description: Username of the user
 *                   content:
 *                     type: string
 *                     description: Comment description
 *                   createdAt:
 *                     type: date
 *                     description: date creation
 *               example:
 *                 - _id: "60747f08c8ae2e089b4d1084"
 *                   userId:
 *                     _id: "60706364f94bee11d74e9acf"
 *                     username: "aguismi"
 *                   content: "new comment !!"
 *                   createdAt: "2021-04-12T17:10:32.583Z"
 *       400:
 *         description: Bad request, Failed to add movie to favorite list.
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
 *                 error: "Failed to add the specified movie to favorite list !"
 * 
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
 * /api/comments/add/{id}:
 *   post:
 *     summary: Add a comment to a movie
 *     description: Add a new comment to a movie by a connected user
 *     tags:
 *       - Comments
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The movie ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 description: comment description
 *                 required: true
 *             example:
 *               body: "new comment !!"
 *
 *     responses:
 *       200:
 *         description: OK.
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
 *                   description: Success message
 *                 comment:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: ObjectId
 *                       description: Comment id
 *                     userId:
 *                       type: string
 *                       format: ObjectId
 *                       description: User id
 *                     movieId:
 *                       type: string
 *                       description: Movie id
 *                     content:
 *                       type: string
 *                       description: Comment description
 *                     createdAt:
 *                       type: date
 *                       description: date creation
 *               example:
 *                 success: true
 *                 message: "Your comment has been added !"
 *                 comment:
 *                   _id: "60747f08c8ae2e089b4d1084"
 *                   userId: "60706364f94bee11d74e9acf"
 *                   movieId: "30221"
 *                   content: "new comment !!"
 *                   createdAt: "2021-04-12T17:10:32.583Z"
 *                   __v: 0
 *   
 *       400:
 *         description: Bad request, Failed to add movie to favorite list.
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
 *                 error: "Failed to add the specified movie to favorite list !"
 * 
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
 * /api/comments/delete/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete a comment by a connected user
 *     tags:
 *       - Comments
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: OK.
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
 *                   description: Success message
 *               example:
 *                 success: true
 *                 message: "Your comment has been deleted !"
 *       400:
 *         description: Bad request, Failed to add movie to favorite list.
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
 *                 error: "Failed to delete the specified comment !"
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