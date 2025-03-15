"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var prismaClient_1 = require("../database/prismaClient");
var client_1 = require("@prisma/client");
var ProjetoService_1 = require("./ProjetoService");
var EspecieService = /** @class */ (function () {
    function EspecieService() {
    }
    EspecieService.prototype.create = function (_a, projetoId) {
        var requestData = _a.data, userId = _a.userId;
        return __awaiter(this, void 0, Promise, function () {
            var nome, nome_cientifico, nome_orgao, id_projeto, id_categoria, especieExists, user, categoriaNaoDefinida, _b, data, especie;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        nome = requestData.nome, nome_cientifico = requestData.nome_cientifico, nome_orgao = requestData.nome_orgao, id_projeto = requestData.id_projeto, id_categoria = requestData.id_categoria;
                        return [4 /*yield*/, prismaClient_1.prismaClient.especie.findFirst({
                                where: {
                                    AND: {
                                        nome: requestData.nome,
                                        id_projeto: projetoId ? projetoId : id_projeto
                                    }
                                }
                            })];
                    case 1:
                        especieExists = _c.sent();
                        return [4 /*yield*/, prismaClient_1.prismaClient.user.findFirst({
                                where: {
                                    id: userId
                                }
                            })];
                    case 2:
                        user = _c.sent();
                        if (especieExists) {
                            throw new Error("J\u00E1 existe uma esp\u00E9cie cadastrada com o nome " + (especieExists === null || especieExists === void 0 ? void 0 : especieExists.nome) + " neste projeto");
                        }
                        if (!(user === null || user === void 0 ? void 0 : user.id_poa_ativo)) return [3 /*break*/, 4];
                        return [4 /*yield*/, prismaClient_1.prismaClient.categoriaEspecie.findFirst({
                                where: {
                                    AND: {
                                        id_poa: user === null || user === void 0 ? void 0 : user.id_poa_ativo,
                                        id_projeto: user === null || user === void 0 ? void 0 : user.id_projeto_ativo,
                                        nome: {
                                            mode: client_1.Prisma.QueryMode.insensitive,
                                            contains: 'Não definida'
                                        }
                                    }
                                }
                            })];
                    case 3:
                        _b = _c.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, prismaClient_1.prismaClient.categoriaEspecie.findFirst({
                            where: {
                                AND: {
                                    id_projeto: user === null || user === void 0 ? void 0 : user.id_projeto_ativo,
                                    id_poa: null,
                                    nome: {
                                        mode: client_1.Prisma.QueryMode.insensitive,
                                        contains: 'Não definida'
                                    }
                                }
                            }
                        })];
                    case 5:
                        _b = _c.sent();
                        _c.label = 6;
                    case 6:
                        categoriaNaoDefinida = _b;
                        if (!categoriaNaoDefinida) {
                            throw new Error('Não foi possível localizar uma categoria padrão \n necessário para importação da Lista de Espécies');
                        }
                        data = {
                            nome: nome,
                            nome_orgao: nome_orgao,
                            nome_cientifico: nome_cientifico,
                            id_projeto: projetoId ? projetoId : id_projeto
                        };
                        return [4 /*yield*/, prismaClient_1.prismaClient.especie.create({ data: data })];
                    case 7:
                        especie = _c.sent();
                        return [4 /*yield*/, prismaClient_1.prismaClient.categoriaEspeciePoa.create({
                                data: {
                                    id_especie: especie === null || especie === void 0 ? void 0 : especie.id,
                                    id_categoria: id_categoria ? id_categoria : categoriaNaoDefinida === null || categoriaNaoDefinida === void 0 ? void 0 : categoriaNaoDefinida.id
                                }
                            })];
                    case 8:
                        _c.sent();
                        return [2 /*return*/, especie];
                }
            });
        });
    };
    EspecieService.prototype.importEspecies = function (data, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, categoriaNaoDefinida, _a, especies, nomes_1, duplicates, _i, data_1, especie, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 13, , 14]);
                        return [4 /*yield*/, prismaClient_1.prismaClient.user.findUnique({
                                where: {
                                    id: userId
                                }
                            })];
                    case 1:
                        user = _b.sent();
                        if (!(user === null || user === void 0 ? void 0 : user.id_poa_ativo)) return [3 /*break*/, 3];
                        return [4 /*yield*/, prismaClient_1.prismaClient.categoriaEspecie.findFirst({
                                where: {
                                    AND: {
                                        id_poa: user === null || user === void 0 ? void 0 : user.id_poa_ativo,
                                        id_projeto: user === null || user === void 0 ? void 0 : user.id_projeto_ativo,
                                        nome: {
                                            mode: client_1.Prisma.QueryMode.insensitive,
                                            contains: 'Não definida'
                                        }
                                    }
                                }
                            })];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, prismaClient_1.prismaClient.categoriaEspecie.findFirst({
                            where: {
                                AND: {
                                    id_projeto: user === null || user === void 0 ? void 0 : user.id_projeto_ativo,
                                    id_poa: null,
                                    nome: {
                                        mode: client_1.Prisma.QueryMode.insensitive,
                                        contains: 'Não definida'
                                    }
                                }
                            }
                        })];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5:
                        categoriaNaoDefinida = _a;
                        return [4 /*yield*/, prismaClient_1.prismaClient.especie.findMany({
                                where: {
                                    id_projeto: user === null || user === void 0 ? void 0 : user.id_projeto_ativo
                                }
                            })];
                    case 6:
                        especies = _b.sent();
                        nomes_1 = especies.map(function (especie) { return especie.nome; });
                        duplicates = data.map(function (d) { return d.nome; }).filter(function (d) { return nomes_1.includes(d); });
                        if (!(duplicates.length > 0)) return [3 /*break*/, 7];
                        return [2 /*return*/, {
                                error: true,
                                type: 'duplicates',
                                duplicates: duplicates
                            }];
                    case 7:
                        _i = 0, data_1 = data;
                        _b.label = 8;
                    case 8:
                        if (!(_i < data_1.length)) return [3 /*break*/, 11];
                        especie = data_1[_i];
                        return [4 /*yield*/, prismaClient_1.prismaClient.especie.create({
                                data: {
                                    nome: especie === null || especie === void 0 ? void 0 : especie.nome,
                                    nome_orgao: especie === null || especie === void 0 ? void 0 : especie.nome_orgao,
                                    nome_cientifico: especie === null || especie === void 0 ? void 0 : especie.nome_cientifico,
                                    id_projeto: user === null || user === void 0 ? void 0 : user.id_projeto_ativo,
                                    categoria_especie: {
                                        create: {
                                            id_categoria: categoriaNaoDefinida === null || categoriaNaoDefinida === void 0 ? void 0 : categoriaNaoDefinida.id
                                        }
                                    }
                                }
                            })];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 8];
                    case 11: return [2 /*return*/, {
                            error: false,
                            message: 'Importação Realizada com Sucesso!'
                        }];
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        error_1 = _b.sent();
                        console.log(error_1.message);
                        return [2 /*return*/, {
                                error: true,
                                message: error_1.message
                            }];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    EspecieService.prototype.update = function (id, dataRequest) {
        return __awaiter(this, void 0, Promise, function () {
            var _a, nome, nome_cientifico, nome_orgao, id_categoria, poa, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = dataRequest, nome = _a.nome, nome_cientifico = _a.nome_cientifico, nome_orgao = _a.nome_orgao, id_categoria = _a.id_categoria, poa = _a.poa;
                        data = {
                            nome: nome,
                            nome_cientifico: nome_cientifico,
                            nome_orgao: nome_orgao
                        };
                        return [4 /*yield*/, prismaClient_1.prismaClient.especie.update({
                                where: {
                                    id: id
                                },
                                data: data
                            })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, prismaClient_1.prismaClient.categoriaEspeciePoa.deleteMany({
                                where: {
                                    AND: [
                                        { id_especie: id },
                                        {
                                            categoria: {
                                                poa: {
                                                    id: poa
                                                }
                                            }
                                        }
                                    ]
                                }
                            })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, prismaClient_1.prismaClient.categoriaEspeciePoa.create({
                                data: {
                                    id_especie: id,
                                    id_categoria: id_categoria
                                }
                            })];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, this.findById(id, poa)];
                }
            });
        });
    };
    EspecieService.prototype["delete"] = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.especie["delete"]({
                            where: {
                                id: id
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EspecieService.prototype.deleteEspecies = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                ids.forEach(function (id) {
                    prismaClient_1.prismaClient.especie["delete"]({
                        where: { id: id }
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    EspecieService.prototype.getAll = function (query, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var projeto, perPage, page, order, search, orderBy, poa, skip, orderByTerm, orderByElement, where, _a, data, total;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, ProjetoService_1.getProjeto(userId)];
                    case 1:
                        projeto = _d.sent();
                        perPage = query.perPage, page = query.page, order = query.order, search = query.search, orderBy = query.orderBy, poa = query.poa;
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
                                AND: {
                                    nome: { mode: client_1.Prisma.QueryMode.insensitive, contains: search },
                                    projeto: {
                                        id: projeto === null || projeto === void 0 ? void 0 : projeto.id
                                    },
                                    categoria_especie: {
                                        some: {
                                            categoria: {
                                                id_poa: poa ? poa : null
                                            }
                                        }
                                    }
                                }
                            } : {
                            AND: [
                                {
                                    projeto: {
                                        id: projeto === null || projeto === void 0 ? void 0 : projeto.id
                                    },
                                    categoria_especie: {
                                        some: {
                                            categoria: {
                                                id_poa: poa ? poa : null
                                            }
                                        }
                                    }
                                }
                            ]
                        };
                        return [4 /*yield*/, prismaClient_1.prismaClient.$transaction([
                                prismaClient_1.prismaClient.especie.findMany({
                                    include: {
                                        categoria_especie: {
                                            include: {
                                                categoria: {
                                                    select: {
                                                        id: true,
                                                        nome: true
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    where: where,
                                    take: perPage ? parseInt(perPage) : 50,
                                    skip: skip ? skip : 0,
                                    orderBy: __assign({}, orderByTerm)
                                }),
                                prismaClient_1.prismaClient.especie.count({ where: where })
                            ])];
                    case 2:
                        _a = _d.sent(), data = _a[0], total = _a[1];
                        return [2 /*return*/, {
                                orderBy: orderBy,
                                order: order,
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
    EspecieService.prototype.findByCategoria = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var especies;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            SELECT e.*, ce.id as id_categoria, ce.nome as nome_categoria \n                FROM especie e\n                INNER JOIN categoria_especie_poa cep on cep.id_especie = e.id\n                INNER JOIN categoria_especie ce on ce.id = cep.id_categoria\n            WHERE\n                ce.id = ", "\n            ORDER BY e.nome\n        "], ["\n            SELECT e.*, ce.id as id_categoria, ce.nome as nome_categoria \n                FROM especie e\n                INNER JOIN categoria_especie_poa cep on cep.id_especie = e.id\n                INNER JOIN categoria_especie ce on ce.id = cep.id_categoria\n            WHERE\n                ce.id = ", "\n            ORDER BY e.nome\n        "])), id)];
                    case 1:
                        especies = _a.sent();
                        return [2 /*return*/, especies];
                }
            });
        });
    };
    EspecieService.prototype.setCategoriaEspecies = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.categoriaEspeciePoa.updateMany({
                            where: {
                                AND: {
                                    id_especie: {
                                        "in": data === null || data === void 0 ? void 0 : data.especies
                                    },
                                    id_categoria: data === null || data === void 0 ? void 0 : data.oldCategory
                                }
                            },
                            data: {
                                id_categoria: data === null || data === void 0 ? void 0 : data.newCategory
                            }
                        })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    EspecieService.prototype.findById = function (id, poaId) {
        return __awaiter(this, void 0, Promise, function () {
            var especie;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.$queryRaw(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n            SELECT e.*, ce.id as id_categoria, ce.nome as nome_categoria \n                FROM especie e\n                INNER JOIN categoria_especie_poa cep on cep.id_especie = e.id\n                INNER JOIN categoria_especie ce on ce.id = cep.id_categoria\n            WHERE\n                e.id = ", "\n                ", "\n        "], ["\n            SELECT e.*, ce.id as id_categoria, ce.nome as nome_categoria \n                FROM especie e\n                INNER JOIN categoria_especie_poa cep on cep.id_especie = e.id\n                INNER JOIN categoria_especie ce on ce.id = cep.id_categoria\n            WHERE\n                e.id = ", "\n                ",
                            "\n        "])), id, poaId ? client_1.Prisma.sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["AND ce.id_poa = ", ""], ["AND ce.id_poa = ", ""])), poaId) : client_1.Prisma.sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["AND ce.id_poa ISNULL"], ["AND ce.id_poa ISNULL"]))))];
                    case 1:
                        especie = _a.sent();
                        return [2 /*return*/, especie];
                }
            });
        });
    };
    return EspecieService;
}());
exports["default"] = new EspecieService;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
