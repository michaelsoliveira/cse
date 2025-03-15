"use strict";
exports.__esModule = true;
var express_1 = require("express");
var UserController_1 = require("../controllers/UserController");
var AuthController_1 = require("../controllers/AuthController");
var auth_middleware_1 = require("../middleware/auth.middleware");
var DetentorController_1 = require("../controllers/DetentorController");
var EspecieController_1 = require("../controllers/EspecieController");
var multer_1 = require("multer");
var CategoriaEspecieController_1 = require("../controllers/CategoriaEspecieController");
var UmfController_1 = require("../controllers/UmfController");
var EstadoController_1 = require("../controllers/EstadoController");
var UpaController_1 = require("../controllers/UpaController");
var EquacaoVolumeController_1 = require("../controllers/EquacaoVolumeController");
var SysRefController_1 = require("../controllers/SysRefController");
var UtController_1 = require("../controllers/UtController");
var ProjetoController_1 = require("../controllers/ProjetoController");
var permission_1 = require("../middleware/permission");
var RoleController_1 = require("../controllers/RoleController");
var PermissionController_1 = require("../controllers/PermissionController");
var ArvoreController_1 = require("../controllers/ArvoreController");
var ObservacaoArvoreController_1 = require("../controllers/ObservacaoArvoreController");
var PoaController_1 = require("../controllers/PoaController");
var routes = express_1["default"].Router();
routes.get('/users', auth_middleware_1.Authentication(), new UserController_1.UserController().findAll);
routes.get('/users/provider/find-by-email', auth_middleware_1.Authentication(), new UserController_1.UserController().findByEmail);
routes.get('/users/:projetoId/:userId', auth_middleware_1.Authentication(), new UserController_1.UserController().findOne);
routes.post('/users/create', new UserController_1.UserController().store);
routes.put('/users/:id', auth_middleware_1.Authentication(), new UserController_1.UserController().update);
routes.get('/users/search', auth_middleware_1.Authentication(), new UserController_1.UserController().search);
routes["delete"]('/users/:id', auth_middleware_1.Authentication(), new UserController_1.UserController()["delete"]);
routes.post('/users/create-role', auth_middleware_1.Authentication(), new UserController_1.UserController().createRole);
routes.post('/users/create-permission', auth_middleware_1.Authentication(), new UserController_1.UserController().createPermission);
routes.post('/users/create-role-permission/:roleId', auth_middleware_1.Authentication(), new UserController_1.UserController().createRolePermission);
routes.post('/users/create-acl/:userId', auth_middleware_1.Authentication(), new UserController_1.UserController().createUserACL);
routes.post('/users/send-email', new UserController_1.UserController().sendMail);
//Alterar senha
routes.post('/users/change-password', auth_middleware_1.Authentication(), new UserController_1.UserController().updatePassword);
routes.get('/provider/find', new UserController_1.UserController().findProvider);
routes.post('/auth/login', new AuthController_1.AuthController().login);
routes.get('/auth/oauth', new AuthController_1.AuthController().googleAuth);
routes.get('/auth/google', new AuthController_1.AuthController().googleAuth);
routes.get('/auth/me', auth_middleware_1.Authentication(), new AuthController_1.AuthController().getUserByToken);
routes.post('/auth/refresh', new AuthController_1.AuthController().refreshToken);
routes.get('/auth/callback/github', new AuthController_1.AuthController().signInCallback);
//Detentor
routes.post('/detentor', auth_middleware_1.Authentication(), new DetentorController_1.DetentorController().store);
routes.get('/detentor/findAll/:projetoId', auth_middleware_1.Authentication(), new DetentorController_1.DetentorController().findAll);
routes.get('/detentor/:id', auth_middleware_1.Authentication(), new DetentorController_1.DetentorController().findOne);
routes.put('/detentor/:id', auth_middleware_1.Authentication(), new DetentorController_1.DetentorController().update);
routes["delete"]('/detentor/:id', auth_middleware_1.Authentication(), new DetentorController_1.DetentorController()["delete"]);
//Categoria
routes.post('/categoria/', auth_middleware_1.Authentication(), permission_1.is(['admin', 'gerente']), new CategoriaEspecieController_1.CategoriaEspecieController().store);
routes.get('/categoria/', auth_middleware_1.Authentication(), new CategoriaEspecieController_1.CategoriaEspecieController().findAll);
routes.get('/categoria/:id', auth_middleware_1.Authentication(), new CategoriaEspecieController_1.CategoriaEspecieController().findOne);
routes.get('/categoria/search/q', auth_middleware_1.Authentication(), new CategoriaEspecieController_1.CategoriaEspecieController().search);
routes.put('/categoria/:id', auth_middleware_1.Authentication(), new CategoriaEspecieController_1.CategoriaEspecieController().update);
routes["delete"]('/categoria/:id', auth_middleware_1.Authentication(), new CategoriaEspecieController_1.CategoriaEspecieController()["delete"]);
//Categoria
routes.post('/obs-arvore/', auth_middleware_1.Authentication(), permission_1.is(['admin', 'gerente']), new ObservacaoArvoreController_1.ObservacaoArvoreController().store);
routes.get('/obs-arvore/', auth_middleware_1.Authentication(), new ObservacaoArvoreController_1.ObservacaoArvoreController().findAll);
routes.get('/obs-arvore/:id', auth_middleware_1.Authentication(), new ObservacaoArvoreController_1.ObservacaoArvoreController().findOne);
routes.get('/obs-arvore/search/q', auth_middleware_1.Authentication(), new ObservacaoArvoreController_1.ObservacaoArvoreController().search);
routes.put('/obs-arvore/:id', auth_middleware_1.Authentication(), new ObservacaoArvoreController_1.ObservacaoArvoreController().update);
routes["delete"]('/obs-arvore/:id', auth_middleware_1.Authentication(), new ObservacaoArvoreController_1.ObservacaoArvoreController()["delete"]);
//Umf
routes.post('/umf/', auth_middleware_1.Authentication(), new UmfController_1.UmfController().store);
routes.get('/umf/:id', auth_middleware_1.Authentication(), new UmfController_1.UmfController().findOne);
routes.get('/umf/find-by-projeto/:projetoId', auth_middleware_1.Authentication(), new UmfController_1.UmfController().findAll);
routes.get('/umf/get/', auth_middleware_1.Authentication(), new UmfController_1.UmfController().getUmf);
routes.get('/umf/search/q', auth_middleware_1.Authentication(), new UmfController_1.UmfController().search);
routes.put('/umf/:id', auth_middleware_1.Authentication(), new UmfController_1.UmfController().update);
routes["delete"]('/umf/single/:id', auth_middleware_1.Authentication(), new UmfController_1.UmfController()["delete"]);
routes["delete"]('/umf/multiples', auth_middleware_1.Authentication(), new UmfController_1.UmfController().deleteUmfs);
//Projeto
routes.post('/projeto/', auth_middleware_1.Authentication(), new ProjetoController_1.ProjetoController().store);
routes.get('/projeto/', auth_middleware_1.Authentication(), new ProjetoController_1.ProjetoController().findAll);
routes.get('/projeto/:projetoId/default-data', auth_middleware_1.Authentication(), new ProjetoController_1.ProjetoController().getDefaultData);
routes.get('/projeto/:projetoId/users', auth_middleware_1.Authentication(), new ProjetoController_1.ProjetoController().findUsers);
routes.get('/projeto/:projetoId/eq-volume', auth_middleware_1.Authentication(), new ProjetoController_1.ProjetoController().findEqVolumes);
routes.get('/projeto/:id', auth_middleware_1.Authentication(), new ProjetoController_1.ProjetoController().findOne);
routes.get('/projeto/search/q', auth_middleware_1.Authentication(), new ProjetoController_1.ProjetoController().search);
routes.get('/projeto/active/get', auth_middleware_1.Authentication(), new ProjetoController_1.ProjetoController().getActive);
routes.post('/projeto/active/:projetoId', auth_middleware_1.Authentication(), new ProjetoController_1.ProjetoController().changeActive);
routes.put('/projeto/:id', auth_middleware_1.Authentication(), new ProjetoController_1.ProjetoController().update);
routes.put('/projeto/single/:id', auth_middleware_1.Authentication(), new ProjetoController_1.ProjetoController()["delete"]);
routes["delete"]('/projeto/multiples', auth_middleware_1.Authentication(), new ProjetoController_1.ProjetoController().deleteProjetos);
//Upa
routes.post('/upa/', auth_middleware_1.Authentication(), new UpaController_1.UpaController().store);
routes.get('/upa/', auth_middleware_1.Authentication(), new UpaController_1.UpaController().findAll);
routes.get('/upa/:id', auth_middleware_1.Authentication(), new UpaController_1.UpaController().findOne);
routes.get('/upa/search/q', auth_middleware_1.Authentication(), new UpaController_1.UpaController().search);
routes.put('/upa/:id', auth_middleware_1.Authentication(), new UpaController_1.UpaController().update);
routes["delete"]('/upa/single/:id', auth_middleware_1.Authentication(), new UpaController_1.UpaController()["delete"]);
routes["delete"]('/upa/multiples', auth_middleware_1.Authentication(), new UpaController_1.UpaController().deleteUpas);
//Upa
routes.post('/poa/', auth_middleware_1.Authentication(), new PoaController_1.PoaController().store);
routes.get('/poa/', auth_middleware_1.Authentication(), new PoaController_1.PoaController().findAll);
routes.get('/poa/:id', auth_middleware_1.Authentication(), new PoaController_1.PoaController().findOne);
routes.get('/poa/search/q', auth_middleware_1.Authentication(), new PoaController_1.PoaController().search);
routes.put('/poa/:id', auth_middleware_1.Authentication(), new PoaController_1.PoaController().update);
routes["delete"]('/poa/single/:id', auth_middleware_1.Authentication(), new PoaController_1.PoaController()["delete"]);
routes["delete"]('/poa/multiples', auth_middleware_1.Authentication(), new PoaController_1.PoaController().deletePoas);
//Ut
routes.post('/ut/', auth_middleware_1.Authentication(), new UtController_1.UtController().store);
routes.get('/ut/', auth_middleware_1.Authentication(), new UtController_1.UtController().findAll);
routes.get('/ut/:id', auth_middleware_1.Authentication(), new UtController_1.UtController().findOne);
routes.get('/ut/search/q', auth_middleware_1.Authentication(), new UtController_1.UtController().search);
routes.put('/ut/:id', auth_middleware_1.Authentication(), new UtController_1.UtController().update);
routes["delete"]('/ut/single/:id', auth_middleware_1.Authentication(), new UtController_1.UtController()["delete"]);
routes["delete"]('/ut/multiples', auth_middleware_1.Authentication(), new UtController_1.UtController().deleteUts);
//Umf
routes.post('/estado/', auth_middleware_1.Authentication(), new EstadoController_1.EstadoController().store);
routes.get('/estado/', auth_middleware_1.Authentication(), new EstadoController_1.EstadoController().findAll);
routes.get('/estado/:id', auth_middleware_1.Authentication(), new EstadoController_1.EstadoController().findOne);
routes.get('/estado/search/q', auth_middleware_1.Authentication(), new EstadoController_1.EstadoController().search);
routes.put('/estado/:id', auth_middleware_1.Authentication(), new EstadoController_1.EstadoController().update);
routes["delete"]('/estado/single/:id', auth_middleware_1.Authentication(), new EstadoController_1.EstadoController()["delete"]);
//Equação de volume
routes.post('/eq-volume/', auth_middleware_1.Authentication(), new EquacaoVolumeController_1.EquacaoVolumeController().store);
routes.get('/eq-volume/', auth_middleware_1.Authentication(), new EquacaoVolumeController_1.EquacaoVolumeController().findAll);
routes.get('/eq-volume/:id', auth_middleware_1.Authentication(), new EquacaoVolumeController_1.EquacaoVolumeController().findOne);
routes.get('/eq-volume/:projetoId/search/q', auth_middleware_1.Authentication(), new EquacaoVolumeController_1.EquacaoVolumeController().search);
routes.put('/eq-volume/:id', auth_middleware_1.Authentication(), new EquacaoVolumeController_1.EquacaoVolumeController().update);
routes["delete"]('/eq-volume/single/:id', auth_middleware_1.Authentication(), new EquacaoVolumeController_1.EquacaoVolumeController()["delete"]);
//Equação Modelo
routes.get('/eq-modelo', auth_middleware_1.Authentication(), new EquacaoVolumeController_1.EquacaoVolumeController().getEqModelos);
//Role
routes.post('/role/', auth_middleware_1.Authentication(), new RoleController_1.RoleController().store);
routes.get('/role', new RoleController_1.RoleController().findAll);
routes.get('/role/search', auth_middleware_1.Authentication(), new RoleController_1.RoleController().search);
routes.get('/role/:id', auth_middleware_1.Authentication(), new RoleController_1.RoleController().findOne);
routes.put('/role/:id', auth_middleware_1.Authentication(), new RoleController_1.RoleController().update);
routes["delete"]('/role/single/:id', auth_middleware_1.Authentication(), new RoleController_1.RoleController()["delete"]);
routes["delete"]('/role/multiples', auth_middleware_1.Authentication(), new RoleController_1.RoleController().deleteAll);
//Permission
routes.post('/permission/', auth_middleware_1.Authentication(), new PermissionController_1.PermissionController().store);
routes.get('/permission/', auth_middleware_1.Authentication(), new PermissionController_1.PermissionController().findAll);
routes.get('/permission/:id', auth_middleware_1.Authentication(), new PermissionController_1.PermissionController().findOne);
routes.get('/permission/search/q', auth_middleware_1.Authentication(), new PermissionController_1.PermissionController().search);
routes.put('/permission/:id', auth_middleware_1.Authentication(), new PermissionController_1.PermissionController().update);
routes["delete"]('/permission/single/:id', auth_middleware_1.Authentication(), new PermissionController_1.PermissionController()["delete"]);
routes["delete"]('/permission/multiples', auth_middleware_1.Authentication(), new PermissionController_1.PermissionController().deleteAll);
//Sistema de Coordenadas
routes.get('/sys-ref/', auth_middleware_1.Authentication(), new SysRefController_1.SysRefController().findAll);
routes.get('/sys-ref/:id', auth_middleware_1.Authentication(), new SysRefController_1.SysRefController().findOne);
routes.get('/sys-ref/search/q', auth_middleware_1.Authentication(), new SysRefController_1.SysRefController().search);
var multerConfig = multer_1["default"]();
//Especie
routes.post('/especie', auth_middleware_1.Authentication(), new EspecieController_1.EspecieController().store);
routes.get('/especie', auth_middleware_1.Authentication(), new EspecieController_1.EspecieController().findAll);
routes.get('/especie/:id', auth_middleware_1.Authentication(), new EspecieController_1.EspecieController().findOne);
routes.put('/especie/:id', auth_middleware_1.Authentication(), new EspecieController_1.EspecieController().update);
routes["delete"]('/especie/single/:id', auth_middleware_1.Authentication(), new EspecieController_1.EspecieController()["delete"]);
routes["delete"]('/especie/multiples', auth_middleware_1.Authentication(), new EspecieController_1.EspecieController().deleteEspecies);
routes.post('/especie/import', multerConfig.single('file'), new EspecieController_1.EspecieController().importEspecie);
//Arvore
routes.post('/arvore', auth_middleware_1.Authentication(), new ArvoreController_1.ArvoreController().store);
routes.get('/arvore/get-all/:utId', auth_middleware_1.Authentication(), new ArvoreController_1.ArvoreController().findAll);
routes.get('/arvore/:id', auth_middleware_1.Authentication(), new ArvoreController_1.ArvoreController().findOne);
routes.put('/arvore/:id', auth_middleware_1.Authentication(), new ArvoreController_1.ArvoreController().update);
routes["delete"]('/arvore/single/:id', auth_middleware_1.Authentication(), new ArvoreController_1.ArvoreController()["delete"]);
routes["delete"]('/arvore/multiples', auth_middleware_1.Authentication(), new ArvoreController_1.ArvoreController().deleteArvores);
routes.post('/arvore/import-inventario', auth_middleware_1.Authentication(), new ArvoreController_1.ArvoreController().importInventario);
exports["default"] = routes;
