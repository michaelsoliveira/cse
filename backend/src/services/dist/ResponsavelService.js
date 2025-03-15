"use strict";
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
var ResponsavelService = /** @class */ (function () {
    function ResponsavelService() {
    }
    ResponsavelService.prototype.create = function (data) {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var nome, pessoaFisica, endereco, where, respTecExists, uf, basicData, responsavel;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        nome = (_a = data === null || data === void 0 ? void 0 : data.pessoaFisica) === null || _a === void 0 ? void 0 : _a.nome;
                        pessoaFisica = data.pessoaFisica, endereco = data.endereco;
                        where = {
                            pessoa: {
                                AND: {
                                    pessoaFisica: {
                                        nome: nome
                                    },
                                    projeto: {
                                        id: data === null || data === void 0 ? void 0 : data.id_projeto
                                    }
                                }
                            }
                        };
                        return [4 /*yield*/, prismaClient_1.prismaClient.responsavelTecnico.findFirst({
                                where: where
                            })];
                    case 1:
                        respTecExists = _b.sent();
                        if (respTecExists) {
                            throw new Error("Já existe um Técnico cadastrado com estas informações");
                        }
                        uf = (endereco === null || endereco === void 0 ? void 0 : endereco.id_estado) ? {
                            connect: {
                                id: endereco === null || endereco === void 0 ? void 0 : endereco.id_estado
                            }
                        } : undefined;
                        basicData = {
                            crea: data === null || data === void 0 ? void 0 : data.crea,
                            numero_art: (data === null || data === void 0 ? void 0 : data.numero_art) ? Number.parseInt(data === null || data === void 0 ? void 0 : data.numero_art) : 0,
                            tipo: data === null || data === void 0 ? void 0 : data.tipo,
                            pessoa: {
                                create: {
                                    pessoaFisica: {
                                        create: {
                                            nome: pessoaFisica === null || pessoaFisica === void 0 ? void 0 : pessoaFisica.nome,
                                            rg: pessoaFisica === null || pessoaFisica === void 0 ? void 0 : pessoaFisica.rg,
                                            cpf: pessoaFisica === null || pessoaFisica === void 0 ? void 0 : pessoaFisica.cpf
                                        }
                                    },
                                    tipo: client_1.TipoPessoa.F,
                                    endereco: {
                                        create: {
                                            cep: endereco === null || endereco === void 0 ? void 0 : endereco.cep,
                                            logradouro: endereco === null || endereco === void 0 ? void 0 : endereco.logradouro,
                                            bairro: endereco === null || endereco === void 0 ? void 0 : endereco.bairro,
                                            municipio: endereco === null || endereco === void 0 ? void 0 : endereco.municipio,
                                            estado: uf
                                        }
                                    }
                                }
                            },
                            projeto: {
                                connect: {
                                    id: data === null || data === void 0 ? void 0 : data.id_projeto
                                }
                            }
                        };
                        return [4 /*yield*/, prismaClient_1.prismaClient.responsavelTecnico.create({
                                data: __assign({}, basicData),
                                include: {
                                    pessoa: {
                                        include: {
                                            pessoaFisica: true
                                        }
                                    }
                                }
                            })];
                    case 2:
                        responsavel = _b.sent();
                        return [2 /*return*/, responsavel];
                }
            });
        });
    };
    ResponsavelService.prototype.update = function (id, data) {
        return __awaiter(this, void 0, Promise, function () {
            var pessoaFisica, endereco, uf, basicData, detentor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pessoaFisica = data.pessoaFisica, endereco = data.endereco;
                        uf = (endereco === null || endereco === void 0 ? void 0 : endereco.id_estado) ? {
                            connect: {
                                id: endereco === null || endereco === void 0 ? void 0 : endereco.id_estado
                            }
                        } : undefined;
                        basicData = {
                            crea: data === null || data === void 0 ? void 0 : data.crea,
                            numero_art: (data === null || data === void 0 ? void 0 : data.numero_art) ? Number.parseInt(data === null || data === void 0 ? void 0 : data.numero_art) : 0,
                            pessoa: {
                                update: {
                                    pessoaFisica: {
                                        create: {
                                            nome: pessoaFisica === null || pessoaFisica === void 0 ? void 0 : pessoaFisica.nome,
                                            rg: pessoaFisica === null || pessoaFisica === void 0 ? void 0 : pessoaFisica.rg,
                                            cpf: pessoaFisica === null || pessoaFisica === void 0 ? void 0 : pessoaFisica.cpf
                                        }
                                    },
                                    tipo: client_1.TipoPessoa.F,
                                    endereco: {
                                        create: {
                                            cep: endereco === null || endereco === void 0 ? void 0 : endereco.cep,
                                            logradouro: endereco === null || endereco === void 0 ? void 0 : endereco.logradouro,
                                            bairro: endereco === null || endereco === void 0 ? void 0 : endereco.bairro,
                                            municipio: endereco === null || endereco === void 0 ? void 0 : endereco.municipio,
                                            estado: uf
                                        }
                                    }
                                }
                            },
                            projeto: {
                                connect: {
                                    id: data === null || data === void 0 ? void 0 : data.id_projeto
                                }
                            }
                        };
                        return [4 /*yield*/, prismaClient_1.prismaClient.pessoa.update({
                                data: __assign({}, basicData),
                                where: {
                                    id: id
                                }
                            })];
                    case 1:
                        detentor = _a.sent();
                        return [2 /*return*/, detentor];
                }
            });
        });
    };
    ResponsavelService.prototype["delete"] = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.pessoa["delete"]({
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
    ResponsavelService.prototype.getAll = function (query, userId) {
        return __awaiter(this, void 0, Promise, function () {
            var projeto, perPage, page, search, skip, where, _a, data, total;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        projeto = ProjetoService_1.getProjeto(userId);
                        perPage = query.perPage, page = query.page, search = query.search;
                        skip = (page - 1) * perPage;
                        where = search ?
                            {
                                AND: [{
                                        pessoa: {
                                            pessoaFisica: {
                                                nome: {
                                                    mode: client_1.Prisma.QueryMode.insensitive, contains: search
                                                }
                                            }
                                        }
                                    }, {
                                        projeto: {
                                            id: projeto === null || projeto === void 0 ? void 0 : projeto.id
                                        }
                                    }
                                ]
                            } : {
                            projeto: {
                                id: projeto === null || projeto === void 0 ? void 0 : projeto.id
                            }
                        };
                        return [4 /*yield*/, prismaClient_1.prismaClient.$transaction([
                                prismaClient_1.prismaClient.responsavelTecnico.findMany({
                                    include: {
                                        pessoa: {
                                            include: {
                                                pessoaFisica: true
                                            }
                                        }
                                    },
                                    where: where,
                                    take: perPage ? parseInt(perPage) : 50,
                                    skip: skip ? skip : 0,
                                    orderBy: {
                                        pessoa: {
                                            pessoaFisica: {
                                                nome: 'asc'
                                            }
                                        }
                                    }
                                }),
                                prismaClient_1.prismaClient.responsavelTecnico.count({ where: where })
                            ])];
                    case 1:
                        _a = _b.sent(), data = _a[0], total = _a[1];
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
    ResponsavelService.prototype.getAll1 = function (projetoId, tipo) {
        return __awaiter(this, void 0, Promise, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.responsavelTecnico.findMany({
                            include: {
                                pessoa: {
                                    include: {
                                        pessoaFisica: true
                                    }
                                }
                            },
                            where: {
                                AND: [
                                    {
                                        projeto: {
                                            id: projetoId
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
    ResponsavelService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var responsavel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.responsavelTecnico.findFirst({
                            include: {
                                pessoa: {
                                    include: {
                                        pessoaFisica: true,
                                        pessoaJuridica: true,
                                        endereco: {
                                            include: {
                                                estado: true
                                            }
                                        },
                                        telefone: true
                                    }
                                }
                            },
                            where: {
                                id: id
                            }
                        })];
                    case 1:
                        responsavel = _a.sent();
                        if (!responsavel)
                            throw new Error("Responsável Técnico não encontrada");
                        return [2 /*return*/, responsavel];
                }
            });
        });
    };
    return ResponsavelService;
}());
exports["default"] = new ResponsavelService();
