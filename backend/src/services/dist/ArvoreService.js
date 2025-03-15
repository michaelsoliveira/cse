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
var math = require('mathjs');
var NUM_WRITES = 1000;
var ArvoreService = /** @class */ (function () {
    function ArvoreService() {
    }
    ArvoreService.prototype.create = function (data) {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var ut, upa, arvoreExists, especie, eqVolume, dap, scope, volume, areaBasal, preparedData, dataObs, arvore, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, prismaClient_1.prismaClient.ut.findUnique({
                                where: {
                                    id: data === null || data === void 0 ? void 0 : data.ut
                                }
                            })];
                    case 1:
                        ut = _c.sent();
                        return [4 /*yield*/, prismaClient_1.prismaClient.upa.findUnique({
                                where: {
                                    id: data === null || data === void 0 ? void 0 : data.upa
                                }
                            })];
                    case 2:
                        upa = _c.sent();
                        return [4 /*yield*/, prismaClient_1.prismaClient.arvore.findFirst({
                                where: {
                                    AND: {
                                        numero_arvore: parseInt(data.numero_arvore),
                                        ut: {
                                            id: data === null || data === void 0 ? void 0 : data.ut
                                        }
                                    }
                                }
                            })];
                    case 3:
                        arvoreExists = _c.sent();
                        if (arvoreExists) {
                            throw new Error('Já existe uma árvore cadastrada com este número');
                        }
                        return [4 /*yield*/, prismaClient_1.prismaClient.especie.findUnique({
                                where: {
                                    id: data === null || data === void 0 ? void 0 : data.especie
                                }
                            })];
                    case 4:
                        especie = _c.sent();
                        return [4 /*yield*/, prismaClient_1.prismaClient.equacaoVolume.findFirst({
                                where: {
                                    upa: {
                                        some: {
                                            id: upa === null || upa === void 0 ? void 0 : upa.id
                                        }
                                    }
                                }
                            })];
                    case 5:
                        eqVolume = _c.sent();
                        dap = (data === null || data === void 0 ? void 0 : data.cap) ? (parseFloat((_a = data === null || data === void 0 ? void 0 : data.cap) === null || _a === void 0 ? void 0 : _a.replace(",", ".")) / Math.PI) : parseFloat((_b = data === null || data === void 0 ? void 0 : data.dap) === null || _b === void 0 ? void 0 : _b.replace(",", "."));
                        scope = {
                            dap: dap,
                            altura: parseFloat(data === null || data === void 0 ? void 0 : data.altura)
                        };
                        volume = math.evaluate(eqVolume === null || eqVolume === void 0 ? void 0 : eqVolume.expressao.toLowerCase().replace("ln(", "log("), scope);
                        areaBasal = math.evaluate('PI * (DAP ^ 2) / 40000', { DAP: dap });
                        console.log(volume, areaBasal);
                        preparedData = (upa === null || upa === void 0 ? void 0 : upa.tipo) === 1 ? {
                            numero_arvore: parseInt(data === null || data === void 0 ? void 0 : data.numero_arvore),
                            faixa: parseInt(data === null || data === void 0 ? void 0 : data.faixa),
                            dap: dap,
                            altura: parseFloat(data === null || data === void 0 ? void 0 : data.altura),
                            fuste: parseInt(data === null || data === void 0 ? void 0 : data.fuste),
                            orient_x: data === null || data === void 0 ? void 0 : data.orient_x,
                            lat_y: parseFloat(data === null || data === void 0 ? void 0 : data.lat_y),
                            long_x: parseFloat(data === null || data === void 0 ? void 0 : data.long_x),
                            volume: volume,
                            area_basal: areaBasal,
                            ut: {
                                connect: {
                                    id: ut === null || ut === void 0 ? void 0 : ut.id
                                }
                            },
                            especie: {
                                connect: {
                                    id: especie === null || especie === void 0 ? void 0 : especie.id
                                }
                            }
                        } : {
                            numero_arvore: parseInt(data === null || data === void 0 ? void 0 : data.numero_arvore),
                            dap: (data === null || data === void 0 ? void 0 : data.cap) ? parseFloat(data === null || data === void 0 ? void 0 : data.cap) / Math.PI : parseFloat(data === null || data === void 0 ? void 0 : data.dap),
                            altura: parseFloat(data === null || data === void 0 ? void 0 : data.altura),
                            fuste: parseInt(data === null || data === void 0 ? void 0 : data.fuste),
                            ponto_gps: parseInt(data === null || data === void 0 ? void 0 : data.ponto_gps),
                            volume: volume,
                            area_basal: areaBasal,
                            ut: {
                                connect: {
                                    id: ut === null || ut === void 0 ? void 0 : ut.id
                                }
                            },
                            especie: {
                                connect: {
                                    id: especie === null || especie === void 0 ? void 0 : especie.id
                                }
                            }
                        };
                        dataObs = (data === null || data === void 0 ? void 0 : data.id_observacao) ? __assign(__assign({}, preparedData), { observacao_arvore: {
                                connect: {
                                    id: data === null || data === void 0 ? void 0 : data.id_observacao
                                }
                            } }) : preparedData;
                        return [4 /*yield*/, prismaClient_1.prismaClient.arvore.create({
                                data: dataObs
                            })];
                    case 6:
                        arvore = _c.sent();
                        return [2 /*return*/, arvore];
                    case 7:
                        e_1 = _c.sent();
                        return [2 /*return*/, e_1];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    // Função para inserir um lote de dados usando Prisma
    ArvoreService.prototype.inserirLoteDeDados = function (dados, userId, upa) {
        return __awaiter(this, void 0, void 0, function () {
            var user_1, eqVolume_1, getData, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, prismaClient_1.prismaClient.user.findUnique({
                                where: {
                                    id: userId
                                }
                            })];
                    case 1:
                        user_1 = _a.sent();
                        return [4 /*yield*/, prismaClient_1.prismaClient.equacaoVolume.findFirst({
                                where: {
                                    upa: {
                                        some: {
                                            id: upa === null || upa === void 0 ? void 0 : upa.id
                                        }
                                    }
                                }
                            })];
                    case 2:
                        eqVolume_1 = _a.sent();
                        getData = function () { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.all(dados === null || dados === void 0 ? void 0 : dados.map(function (arv) { return __awaiter(_this, void 0, void 0, function () {
                                            var dap, scope, nome_especie, expressao, volume, areaBasal, especie, _a, ut, _b, preparedData, result;
                                            var _c, _d, _e, _f;
                                            return __generator(this, function (_g) {
                                                switch (_g.label) {
                                                    case 0:
                                                        dap = (arv === null || arv === void 0 ? void 0 : arv.cap) ? (Number((_c = arv === null || arv === void 0 ? void 0 : arv.cap) === null || _c === void 0 ? void 0 : _c.replace(",", ".")) / Math.PI) : Number((_d = arv === null || arv === void 0 ? void 0 : arv.dap) === null || _d === void 0 ? void 0 : _d.replace(",", "."));
                                                        scope = {
                                                            dap: dap,
                                                            altura: parseFloat(arv === null || arv === void 0 ? void 0 : arv.altura)
                                                        };
                                                        nome_especie = (arv === null || arv === void 0 ? void 0 : arv.especie) ? arv === null || arv === void 0 ? void 0 : arv.especie : arv === null || arv === void 0 ? void 0 : arv.especie_nome_vulgar;
                                                        expressao = eqVolume_1 === null || eqVolume_1 === void 0 ? void 0 : eqVolume_1.expressao.toLowerCase().replaceAll("ln(", "log(");
                                                        volume = math.evaluate(expressao, scope);
                                                        areaBasal = math.evaluate('PI * (DAP ^ 2) / 40000', { DAP: dap });
                                                        _a = nome_especie;
                                                        if (!_a) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, prismaClient_1.prismaClient.categoriaEspeciePoa.findFirst({
                                                                distinct: ['id_especie'],
                                                                include: {
                                                                    especie: true
                                                                },
                                                                where: {
                                                                    AND: [
                                                                        {
                                                                            especie: {
                                                                                nome: nome_especie,
                                                                                projeto: {
                                                                                    id: user_1 === null || user_1 === void 0 ? void 0 : user_1.id_projeto_ativo
                                                                                }
                                                                            }
                                                                        },
                                                                        {
                                                                            categoria: {
                                                                                poa: {
                                                                                    id: user_1 === null || user_1 === void 0 ? void 0 : user_1.id_poa_ativo
                                                                                }
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            })];
                                                    case 1:
                                                        _a = (_g.sent());
                                                        _g.label = 2;
                                                    case 2:
                                                        especie = _a;
                                                        _b = (arv === null || arv === void 0 ? void 0 : arv.ut);
                                                        if (!_b) return [3 /*break*/, 4];
                                                        return [4 /*yield*/, prismaClient_1.prismaClient.ut.findFirst({
                                                                where: {
                                                                    AND: [
                                                                        { numero_ut: parseInt(arv === null || arv === void 0 ? void 0 : arv.ut) },
                                                                        { id_upa: upa === null || upa === void 0 ? void 0 : upa.id }
                                                                    ]
                                                                }
                                                            })];
                                                    case 3:
                                                        _b = (_g.sent());
                                                        _g.label = 4;
                                                    case 4:
                                                        ut = _b;
                                                        preparedData = (upa === null || upa === void 0 ? void 0 : upa.tipo) === 1 ? {
                                                            faixa: parseInt(arv === null || arv === void 0 ? void 0 : arv.faixa),
                                                            orient_x: arv === null || arv === void 0 ? void 0 : arv.orient_x
                                                        } : {
                                                            ponto_gps: (arv === null || arv === void 0 ? void 0 : arv.ponto_gps) && parseInt(arv === null || arv === void 0 ? void 0 : arv.ponto_gps),
                                                            lat_y: parseFloat((_e = arv === null || arv === void 0 ? void 0 : arv.latitude) === null || _e === void 0 ? void 0 : _e.replace(",", ".")),
                                                            long_x: parseFloat((_f = arv === null || arv === void 0 ? void 0 : arv.longitude) === null || _f === void 0 ? void 0 : _f.replace(",", "."))
                                                        };
                                                        result = (arv === null || arv === void 0 ? void 0 : arv.numero_arvore) !== '' && __assign(__assign({ numero_arvore: parseInt(arv === null || arv === void 0 ? void 0 : arv.numero_arvore), dap: dap, altura: parseFloat(arv === null || arv === void 0 ? void 0 : arv.altura), fuste: (arv === null || arv === void 0 ? void 0 : arv.qf) && parseInt(arv === null || arv === void 0 ? void 0 : arv.qf), volume: volume, area_basal: areaBasal }, preparedData), { id_ut: ut === null || ut === void 0 ? void 0 : ut.id, id_especie: especie === null || especie === void 0 ? void 0 : especie.id_especie });
                                                        return [2 /*return*/, result];
                                                }
                                            });
                                        }); }))];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); };
                        getData().then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.arvore.createMany({
                                            data: data
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })["catch"](function (error) {
                            throw error;
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        //console.error('Erro ao inserir lote de dados:', error);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Função para inserir todos os dados em paralelo usando Promise.all
    ArvoreService.prototype.inserirDadosEmParalelo = function (dados, userId, upa, size) {
        return __awaiter(this, void 0, void 0, function () {
            var lotes, i, promises, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lotes = [];
                        for (i = 0; i < dados.length; i += size) {
                            lotes.push(dados.slice(i, i + size));
                        }
                        promises = lotes === null || lotes === void 0 ? void 0 : lotes.map(function (lote) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.inserirLoteDeDados(lote, userId, upa)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.all(promises).then(function () {
                                return {
                                    error: false,
                                    message: 'Importação Realizada com Sucesso!!!'
                                };
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_2 = _a.sent();
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ArvoreService.prototype.createByImport = function (dt, userId, upa) {
        return __awaiter(this, void 0, Promise, function () {
            var data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.inserirDadosEmParalelo(dt === null || dt === void 0 ? void 0 : dt.importedData, userId, upa, NUM_WRITES).then(function (data) {
                                return __assign({}, data);
                            })];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, __assign({}, data)];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3 === null || error_3 === void 0 ? void 0 : error_3.message);
                        return [2 /*return*/, {
                                error: true,
                                message: error_3.message
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ArvoreService.prototype.update = function (id, data) {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var ut, upa, especie, eqVolume, dap, scope, volume, areaBasal, preparedData, dataObs, arvore;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.ut.findUnique({
                            where: {
                                id: data === null || data === void 0 ? void 0 : data.id_ut
                            }
                        })];
                    case 1:
                        ut = _c.sent();
                        return [4 /*yield*/, prismaClient_1.prismaClient.upa.findUnique({
                                where: {
                                    id: ut === null || ut === void 0 ? void 0 : ut.id_upa
                                }
                            })];
                    case 2:
                        upa = _c.sent();
                        return [4 /*yield*/, prismaClient_1.prismaClient.especie.findUnique({
                                where: {
                                    id: data === null || data === void 0 ? void 0 : data.id_especie
                                }
                            })];
                    case 3:
                        especie = _c.sent();
                        return [4 /*yield*/, prismaClient_1.prismaClient.equacaoVolume.findFirst({
                                where: {
                                    upa: {
                                        some: {
                                            id: upa === null || upa === void 0 ? void 0 : upa.id
                                        }
                                    }
                                }
                            })];
                    case 4:
                        eqVolume = _c.sent();
                        dap = (data === null || data === void 0 ? void 0 : data.cap) ? (parseFloat((_a = data === null || data === void 0 ? void 0 : data.cap) === null || _a === void 0 ? void 0 : _a.replace(",", ".")) / Math.PI) : parseFloat((_b = data === null || data === void 0 ? void 0 : data.dap) === null || _b === void 0 ? void 0 : _b.replace(",", "."));
                        scope = {
                            dap: dap,
                            altura: parseFloat(data === null || data === void 0 ? void 0 : data.altura)
                        };
                        volume = math.evaluate(eqVolume === null || eqVolume === void 0 ? void 0 : eqVolume.expressao.toLowerCase().replace("ln(", "log("), scope);
                        areaBasal = math.evaluate('PI * (DAP ^ 2) / 40000', { DAP: dap });
                        preparedData = (upa === null || upa === void 0 ? void 0 : upa.tipo) === 1 ? {
                            numero_arvore: parseInt(data === null || data === void 0 ? void 0 : data.numero_arvore),
                            faixa: parseInt(data === null || data === void 0 ? void 0 : data.faixa),
                            dap: dap,
                            altura: parseFloat(data === null || data === void 0 ? void 0 : data.altura),
                            fuste: parseInt(data === null || data === void 0 ? void 0 : data.fuste),
                            orient_x: data === null || data === void 0 ? void 0 : data.orient_x,
                            lat_y: parseFloat(data === null || data === void 0 ? void 0 : data.lat_y),
                            long_x: parseFloat(data === null || data === void 0 ? void 0 : data.long_x),
                            volume: volume,
                            area_basal: areaBasal,
                            ut: {
                                connect: {
                                    id: ut === null || ut === void 0 ? void 0 : ut.id
                                }
                            },
                            especie: {
                                connect: {
                                    id: especie === null || especie === void 0 ? void 0 : especie.id
                                }
                            }
                        } : {
                            numero_arvore: parseInt(data === null || data === void 0 ? void 0 : data.numero_arvore),
                            dap: (data === null || data === void 0 ? void 0 : data.cap) ? parseFloat(data === null || data === void 0 ? void 0 : data.cap) / Math.PI : parseFloat(data === null || data === void 0 ? void 0 : data.dap),
                            altura: parseFloat(data === null || data === void 0 ? void 0 : data.altura),
                            fuste: parseInt(data === null || data === void 0 ? void 0 : data.fuste),
                            lat_y: parseFloat(data === null || data === void 0 ? void 0 : data.lat_y),
                            long_x: parseFloat(data === null || data === void 0 ? void 0 : data.long_x),
                            ponto_gps: parseInt(data === null || data === void 0 ? void 0 : data.ponto_gps),
                            volume: volume,
                            area_basal: areaBasal,
                            ut: {
                                connect: {
                                    id: ut === null || ut === void 0 ? void 0 : ut.id
                                }
                            },
                            especie: {
                                connect: {
                                    id: especie === null || especie === void 0 ? void 0 : especie.id
                                }
                            }
                        };
                        dataObs = (data === null || data === void 0 ? void 0 : data.id_observacao) ? __assign(__assign({}, preparedData), { observacao_arvore: {
                                connect: {
                                    id: data === null || data === void 0 ? void 0 : data.id_observacao
                                }
                            } }) : preparedData;
                        return [4 /*yield*/, prismaClient_1.prismaClient.arvore.update({
                                where: {
                                    id: id
                                },
                                data: dataObs
                            })];
                    case 5:
                        arvore = _c.sent();
                        return [2 /*return*/, arvore];
                }
            });
        });
    };
    ArvoreService.prototype["delete"] = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.arvore["delete"]({
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
    ArvoreService.prototype.getAll = function (userId, query, utId) {
        return __awaiter(this, void 0, Promise, function () {
            var user, perPage, page, search, orderBy, order, skip, orderByTerm, orderByElement, withUt, where, _a, data, total;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.user.findUnique({
                            where: {
                                id: userId
                            }
                        })];
                    case 1:
                        user = _d.sent();
                        perPage = query.perPage, page = query.page, search = query.search, orderBy = query.orderBy, order = query.order;
                        skip = perPage && (page - 1) * perPage;
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
                        withUt = utId === "0" || (typeof utId === undefined)
                            ? {}
                            : {
                                ut: {
                                    AND: [
                                        { id: utId },
                                    ]
                                }
                            };
                        where = search ? __assign(__assign({ AND: { numero_arvore: parseInt(search) } }, withUt), { especie: {
                                AND: [
                                    { id_projeto: (user === null || user === void 0 ? void 0 : user.id_projeto_ativo) ? user === null || user === void 0 ? void 0 : user.id_projeto_ativo : null },
                                    { categoria_especie: {
                                            some: {
                                                categoria: {
                                                    id_poa: (user === null || user === void 0 ? void 0 : user.id_poa_ativo) ? user === null || user === void 0 ? void 0 : user.id_poa_ativo : null
                                                }
                                            }
                                        } }
                                ]
                            } }) : {
                            AND: __assign(__assign({}, withUt), { especie: {
                                    AND: [
                                        { id_projeto: (user === null || user === void 0 ? void 0 : user.id_projeto_ativo) ? user === null || user === void 0 ? void 0 : user.id_projeto_ativo : null },
                                        { categoria_especie: {
                                                some: {
                                                    categoria: {
                                                        id_poa: (user === null || user === void 0 ? void 0 : user.id_poa_ativo) ? user === null || user === void 0 ? void 0 : user.id_poa_ativo : null
                                                    }
                                                }
                                            } }
                                    ]
                                } })
                        };
                        return [4 /*yield*/, prismaClient_1.prismaClient.$transaction([
                                prismaClient_1.prismaClient.arvore.findMany({
                                    include: {
                                        especie: true,
                                        situacao_arvore: true,
                                        ut: true
                                    },
                                    where: where,
                                    orderBy: orderByTerm,
                                    take: perPage && parseInt(perPage),
                                    skip: skip ? skip : 0
                                }),
                                prismaClient_1.prismaClient.arvore.count({ where: where })
                            ])];
                    case 2:
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
    ArvoreService.prototype.deleteArvores = function (arvores) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.arvore.deleteMany({
                            where: { id: { "in": arvores } }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ArvoreService.prototype.search = function (q, userId, utId) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.arvore.findMany({
                            where: {
                                AND: [
                                    { numero_arvore: parseInt(q) },
                                    { ut: { id: utId } }
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
    ArvoreService.prototype.findById = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var arvore;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prismaClient_1.prismaClient.arvore.findUnique({
                            include: {
                                observacao_arvore: true,
                                especie: true
                            },
                            where: { id: id }
                        })];
                    case 1:
                        arvore = _a.sent();
                        return [2 /*return*/, arvore];
                }
            });
        });
    };
    return ArvoreService;
}());
exports["default"] = new ArvoreService;
