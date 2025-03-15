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
// import { CategoriaEspecie } from "../entities/CategoriaEspecie";
var prismaClient_1 = require("../database/prismaClient");
var client_1 = require("@prisma/client");
var ProjetoService_1 = require("./ProjetoService");
var CategoriaService = /** @class */ (function () {
    function CategoriaService() {
    }
    CategoriaService.prototype.create = function (data) {
        return __awaiter(this, void 0, Promise, function () {
            var categoriaExists, categoria;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.categoriaEspecie.findFirst({
                            where: {
                                AND: {
                                    nome: data.nome,
                                    id_projeto: data === null || data === void 0 ? void 0 : data.id_projeto
                                }
                            }
                        })];
                    case 1:
                        categoriaExists = _a.sent();
                        if (categoriaExists) {
                            throw new Error('Já existe uma categoria cadastrada com este nome');
                        }
                        return [4 /*yield*/, prismaClient_1.prismaClient.categoriaEspecie.create({
                                data: data
                            })];
                    case 2:
                        categoria = _a.sent();
                        return [2 /*return*/, categoria];
                }
            });
        });
    };
    CategoriaService.prototype.update = function (id, data) {
        return __awaiter(this, void 0, Promise, function () {
            var categoria;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.categoriaEspecie.update({
                            data: data,
                            where: {
                                id: id
                            }
                        })];
                    case 1:
                        categoria = _a.sent();
                        return [2 /*return*/, categoria];
                }
            });
        });
    };
    CategoriaService.prototype["delete"] = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.categoriaEspecie["delete"]({
                            where: { id: id }
                        })
                            .then(function (response) {
                            console.log(response);
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CategoriaService.prototype.getAll = function (userId, query) {
        return __awaiter(this, void 0, Promise, function () {
            var projeto, perPage, page, search, orderBy, order, poa, skip, orderByTerm, orderByElement, where, _a, data, total;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        projeto = ProjetoService_1.getProjeto(userId);
                        perPage = query.perPage, page = query.page, search = query.search, orderBy = query.orderBy, order = query.order, poa = query.poa;
                        skip = (page - 1) * perPage;
                        orderByTerm = {};
                        orderByElement = orderBy ? orderBy.split('.') : {};
                        if (orderByElement.length == 2) {
                            orderByTerm = (_b = {},
                                _b[orderByElement[1]] = order,
                                _b);
                        }
                        else {
                            orderByTerm = (_c = {},
                                _c[orderByElement] = order,
                                _c);
                        }
                        where = search ?
                            {
                                AND: [
                                    {
                                        nome: { mode: client_1.Prisma.QueryMode.insensitive, contains: search }
                                    },
                                    {
                                        projeto: {
                                            id: projeto === null || projeto === void 0 ? void 0 : projeto.id
                                        }
                                    },
                                    {
                                        id_poa: poa ? poa : null
                                    }
                                ]
                            } : {
                            AND: [
                                {
                                    id_poa: poa ? poa : null
                                },
                                {
                                    projeto: {
                                        id: projeto === null || projeto === void 0 ? void 0 : projeto.id
                                    }
                                }
                            ]
                        };
                        return [4 /*yield*/, prismaClient_1.prismaClient.$transaction([
                                prismaClient_1.prismaClient.categoriaEspecie.findMany({
                                    where: where,
                                    orderBy: orderByTerm,
                                    take: perPage ? parseInt(perPage) : 50,
                                    skip: skip ? skip : 0
                                }),
                                prismaClient_1.prismaClient.categoriaEspecie.count({ where: where })
                            ])];
                    case 1:
                        _a = _d.sent(), data = _a[0], total = _a[1];
                        return [2 /*return*/, {
                                data: data,
                                perPage: perPage,
                                page: page,
                                skip: skip,
                                count: total
                            }];
                }
            });
        });
    };
    CategoriaService.prototype.deleteCategorias = function (categorias) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.categoriaEspecie.deleteMany({
                            where: { id: { "in": categorias } }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CategoriaService.prototype.search = function (q, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var projeto, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        projeto = ProjetoService_1.getProjeto(userId);
                        return [4 /*yield*/, prismaClient_1.prismaClient.categoriaEspecie.findMany({
                                where: {
                                    AND: [
                                        {
                                            nome: { mode: client_1.Prisma.QueryMode.insensitive, contains: q }
                                        },
                                        {
                                            projeto: {
                                                id: projeto === null || projeto === void 0 ? void 0 : projeto.id
                                            }
                                        }
                                    ]
                                }
                            })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    CategoriaService.prototype.findById = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var categoria;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.categoriaEspecie.findUnique({ where: { id: id } })];
                    case 1:
                        categoria = _a.sent();
                        return [2 /*return*/, categoria];
                }
            });
        });
    };
    return CategoriaService;
}());
exports["default"] = new CategoriaService;
