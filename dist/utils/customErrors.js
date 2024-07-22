"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alreadyTakenError = alreadyTakenError;
exports.notFoundError = notFoundError;
exports.badCredentialsError = badCredentialsError;
exports.badRequestError = badRequestError;
exports.serverError = serverError;
exports.NoContent = NoContent;
function alreadyTakenError(message) {
    throw new Error(`AlreadyTakenError: ${message}`);
}
function notFoundError(entity) {
    throw new Error(`NotFoundError: ${entity} not found`);
}
function badCredentialsError(message) {
    throw new Error(`BadCredentialsError: ${message}`);
}
function badRequestError(message) {
    throw new Error(`BadRequestError: ${message}`);
}
function serverError(message) {
    throw new Error(`ServerError: ${message}`);
}
function NoContent() {
    throw new Error(`NoContent`);
}
