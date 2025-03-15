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
var Permission_1 = require("../entities/Permission");
var Role_1 = require("../entities/Role");
var User_1 = require("../entities/User");
var typeorm_1 = require("typeorm");
var Empresa_1 = require("../entities/Empresa");
var Umf_1 = require("../entities/Umf");
var Estado_1 = require("../entities/Estado");
var Upa_1 = require("../entities/Upa");
var Ut_1 = require("../entities/Ut");
var CategoriaEspecie_1 = require("../entities/CategoriaEspecie");
var Especie_1 = require("../entities/Especie");
var Projeto_1 = require("../entities/Projeto");
var RefreshToken_1 = require("../entities/RefreshToken");
var Endereco_1 = require("../entities/Endereco");
var SpatialRefSys_1 = require("../entities/SpatialRefSys");
var EquacaoVolume_1 = require("../entities/EquacaoVolume");
var dotenv = require('dotenv');
// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config();
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var connection, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, typeorm_1.createConnection({
                        type: "postgres",
                        host: process.env.HOST,
                        port: 5432,
                        username: process.env.USERNAME,
                        password: process.env.PASSWORD,
                        database: process.env.DATABASE_NAME,
                        entities: [
                            Permission_1.Permission,
                            Role_1.Role,
                            User_1.User,
                            Empresa_1.Empresa,
                            Projeto_1.Projeto,
                            SpatialRefSys_1.SpatialRefSys,
                            EquacaoVolume_1.EquacaoVolume,
                            Upa_1.Upa,
                            Ut_1.Ut,
                            Estado_1.Estado,
                            Umf_1.Umf,
                            CategoriaEspecie_1.CategoriaEspecie,
                            Especie_1.Especie,
                            RefreshToken_1.RefreshToken,
                            Endereco_1.Endereco
                        ],
                        synchronize: false
                    })];
            case 1:
                connection = _a.sent();
                console.log('Connected to Postgres');
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                throw new Error(error_1.message);
            case 3: return [2 /*return*/];
        }
    });
}); };
main();
