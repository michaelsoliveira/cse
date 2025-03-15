"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Authentication = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var user_service_1 = require("../services/user.service");
var axios_1 = require("axios");
var decodeJwtGoogle_1 = require("../services/decodeJwtGoogle");
var config = require("../config");
exports.Authentication = function () {
    var TokenExpiredError = jsonwebtoken_1["default"].TokenExpiredError;
    var catchError = function (err, res) {
        if (err instanceof TokenExpiredError) {
            return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
        }
        return res.sendStatus(401).send({ message: "Unauthorized!" });
    };
    return function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
        var authorization, token, provider, _a, provider_1, user, url, verificationResponse, user, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    authorization = request.headers.authorization;
                    if (!authorization) {
                        return [2 /*return*/, response.status(401).json({ error: "Token is missing!" })];
                    }
                    token = authorization.replace('Bearer', '').trim();
                    provider = token.substring(0, 3);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 12, , 13]);
                    _a = provider;
                    switch (_a) {
                        case 'ya2': return [3 /*break*/, 2];
                        case 'ghu': return [3 /*break*/, 5];
                        case 'EAA': return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 9];
                case 2: return [4 /*yield*/, decodeJwtGoogle_1.getDecodedOAuthJwtGoogle(token)];
                case 3:
                    provider_1 = _b.sent();
                    return [4 /*yield*/, user_service_1["default"].findProvider(provider_1)];
                case 4:
                    user = _b.sent();
                    request.user = {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        provider: 'google',
                        roles: user.user_roles.map(function (userRoles) { return userRoles.roles; })
                    };
                    return [3 /*break*/, 11];
                case 5:
                    url = 'https://api.github.com/user';
                    return [4 /*yield*/, axios_1["default"].get(url, {
                            headers: { authorization: "token " + token }
                        }).then(function (response) { return __awaiter(void 0, void 0, void 0, function () {
                            var provider, user;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        provider = response.data;
                                        return [4 /*yield*/, user_service_1["default"].findProvider(provider)];
                                    case 1:
                                        user = _a.sent();
                                        request.user = {
                                            id: user === null || user === void 0 ? void 0 : user.id,
                                            email: user === null || user === void 0 ? void 0 : user.email,
                                            username: user === null || user === void 0 ? void 0 : user.username,
                                            provider: 'github',
                                            roles: user.user_roles.map(function (userRoles) { return userRoles.roles; })
                                        };
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 7: return [4 /*yield*/, axios_1["default"].get("https://graph.facebook.com/me?access_token=" + token + "&fields=id")
                        .then(function (response) { return __awaiter(void 0, void 0, void 0, function () {
                        var provider, user;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    provider = response.data;
                                    return [4 /*yield*/, user_service_1["default"].findProvider(provider)];
                                case 1:
                                    user = _a.sent();
                                    request.user = {
                                        id: user.id,
                                        email: user.email,
                                        username: user.username,
                                        provider: user.provider,
                                        roles: user.user_roles.map(function (userRoles) { return userRoles.roles; })
                                    };
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 8:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 9:
                    verificationResponse = jsonwebtoken_1["default"].verify(token, config.server.JWT_SECRET);
                    return [4 /*yield*/, user_service_1["default"].findOne(verificationResponse.id)];
                case 10:
                    user = _b.sent();
                    request.user = {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        provider: 'local',
                        roles: user === null || user === void 0 ? void 0 : user.users_roles.map(function (userRoles) { return userRoles.roles; })
                    };
                    _b.label = 11;
                case 11: return [2 /*return*/, next()];
                case 12:
                    error_1 = _b.sent();
                    return [2 /*return*/, response.status(401).json({
                            error: true,
                            message: error_1.message,
                            data: null
                        })];
                case 13: return [2 /*return*/];
            }
        });
    }); };
};
