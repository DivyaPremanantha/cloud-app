// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
const databaseManager = require('./databaseManager');
console.log("event123");
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

exports.bookingTripHandler = async (event) => {
	console.log(event);

	switch (event.httpMethod) {
		case 'DELETE':
			return deleteBooking(event);
		case 'GET':
			return getBooking(event);
		case 'POST':
			return saveBooking(event);
		case 'PUT':
			return updateBooking(event);
		default:
			return sendResponse(404, `Unsupported method "${event.httpMethod}"`);
	}
};

function saveBooking(event) {
	const booking = JSON.parse(event.body);
	booking.bookingId = "123";

	return databaseManager.saveBooking(booking).then(response => {
		console.log(response);
		return sendResponse(200, booking.bookingId);
	});
}

function getBooking(event) {
	const bookingId = event.pathParameters.bookingId;

	return databaseManager.getBooking(bookingId).then(response => {
		console.log(response);
		return sendResponse(200, JSON.stringify(response));
	});
}

function deleteBooking(event) {
	const bookingId = event.pathParameters.bookingId;

	return databaseManager.deleteBooking(bookingId).then(response => {
		return sendResponse(200, 'DELETE BOOKING');
	});
}

function updateBooking(event) {
	const bookingId = event.pathParameters.bookingId;

	const body = JSON.parse(event.body);
	const paramName = body.paramName;
	const paramValue = body.paramValue;

	return databaseManager.updateBooking(bookingId, paramName, paramValue).then(response => {
		console.log(response);
		return sendResponse(200, JSON.stringify(response));
	});
}

function sendResponse(statusCode, message) {
	const response = {
		statusCode: statusCode,
		body: JSON.stringify(message)
	};
	return response
}
