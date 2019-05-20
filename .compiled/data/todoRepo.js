'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteTodo = exports.UpdateTodo = exports.CreateTodo = exports.GetById = exports.GetAll = undefined;

var _mongodb = require('mongodb');

var _logger = require('../helper/logger');

var _logger2 = _interopRequireDefault(_logger);

var _todo = require('../entities/todo');

var _todo2 = _interopRequireDefault(_todo);

var _returnData = require('../dataTypes/returnData');

var _returnData2 = _interopRequireDefault(_returnData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DBURL = 'mongodb://localhost:27017';
var DBNAME = 'todos';

// Check if the connection to the db is open
var isServerConnected = function isServerConnected(client) {
  return !!client && !!client.topology && client.topology.isConnected();
};

// Open the connection to the server
var connectServer = async function connectServer(collectionName) {
  var client = void 0;
  try {
    // Connect to the db
    client = await _mongodb.MongoClient.connect(DBURL + '/' + DBNAME, { useNewUrlParser: true }).catch(function (err) {
      throw err;
    }).then(function (val) {
      return val;
    });

    var db = client.db(DBNAME);
    var collection = db.collection(collectionName);

    return new _returnData2.default(true, { client: client, collection: collection, db: db });
  } catch (err) {
    // Make sure the connection to the db is closed
    if (isServerConnected(client)) client.close();

    _logger2.default.consoleLog('Error occured while creating a connection to the server', err);
    return new _returnData2.default(false, null, err);
  }
};

var GetAll = exports.GetAll = async function GetAll() {
  var client = void 0,
      collection = void 0;
  try {

    // Retrieve the first Todo that matches the filter
    var _ref = await connectServer('todo').catch(function (err) {
      throw err;
    }).then(function (val) {
      return val.data;
    });

    client = _ref.client;
    collection = _ref.collection;
    var todos = await collection.find({}).toArray().catch(function (err) {
      throw err;
    }).then(function (val) {
      return val;
    });

    client.close();

    if (!todos.length) return new _returnData2.default(false);

    todos = todos.map(function (todo) {
      return new _todo2.default(todo._id.toHexString(), todo.title, todo.description);
    });

    _logger2.default.consoleLog('Found ' + todos.length + ' Todos');
    return new _returnData2.default(true, todos);
  } catch (err) {
    // Make sure the connection to the db is closed
    if (isServerConnected(client)) client.close();

    _logger2.default.consoleLog('Error occured while executing GetAll', err);
    return new _returnData2.default(false, null, err);
  }
};

var GetById = exports.GetById = async function GetById(id) {
  if (!id) return new _returnData2.default(false);

  var client = void 0,
      collection = void 0;
  try {

    // Retrieve the first Todo that matches the filter
    var _ref2 = await connectServer('todo').catch(function (err) {
      throw err;
    }).then(function (val) {
      return val.data;
    });

    client = _ref2.client;
    collection = _ref2.collection;
    var todo = await collection.findOne({ '_id': new _mongodb.ObjectID(id) }).catch(function (err) {
      throw err;
    }).then(function (val) {
      return new _todo2.default(val._id.toHexString(), val.title, val.description);
    });

    client.close();

    if (!todo) return new _returnData2.default(false);

    _logger2.default.consoleLog('Found requested Todo');
    return new _returnData2.default(true, todo);
  } catch (err) {
    // Make sure the connection to the db is closed
    if (isServerConnected(client)) client.close();

    _logger2.default.consoleLog('Error occured while executing GetById', err);
    return new _returnData2.default(false, null, err);
  }
};

var CreateTodo = exports.CreateTodo = async function CreateTodo(_ref3) {
  var title = _ref3.title,
      description = _ref3.description;

  if (!title || !description) return new _returnData2.default(false);

  var client = void 0,
      collection = void 0;
  try {
    var _ref4 = await connectServer('todo').catch(function (err) {
      throw err;
    }).then(function (val) {
      return val.data;
    });

    client = _ref4.client;
    collection = _ref4.collection;


    var todo = await collection.insertOne({ title: title, description: description }).catch(function (err) {
      throw err;
    }).then(function (val) {
      return new _todo2.default(val.insertedId.toHexString(), title, description);
    });

    client.close();

    if (!todo) return new _returnData2.default(false);

    _logger2.default.consoleLog('New Todo has been inserted');

    return new _returnData2.default(true, todo);
  } catch (err) {
    // Make sure the connection to the db is closed
    if (isServerConnected(client)) client.close();

    _logger2.default.consoleLog('Error occured while executing CreateTodo', err);
    return new _returnData2.default(false, null, err);
  }
};

var UpdateTodo = exports.UpdateTodo = async function UpdateTodo(_ref5) {
  var id = _ref5.id,
      title = _ref5.title,
      description = _ref5.description;

  if (!id) return new _returnData2.default(false);

  // Avoiding nulls in the db
  if (title == null) title = '';
  if (description == null) description = '';

  var client = void 0,
      collection = void 0;
  try {
    var _ref6 = await connectServer('todo').catch(function (err) {
      throw err;
    }).then(function (val) {
      return val.data;
    });

    client = _ref6.client;
    collection = _ref6.collection;


    var updatedCount = await collection.updateOne({ '_id': new _mongodb.ObjectID(id) }, { $set: { title: title, description: description } }).catch(function (err) {
      throw err;
    }).then(function (val) {
      return val.result.n;
    });

    client.close();

    if (!updatedCount) return new _returnData2.default(false);

    _logger2.default.consoleLog('Updated Todo');

    return new _returnData2.default(true);
  } catch (err) {
    // Make sure the connection to the db is closed
    if (isServerConnected(client)) client.close();

    _logger2.default.consoleLog('Error occured while executing UpdateTodo', err);
    return new _returnData2.default(false, null, err);
  }
};

var DeleteTodo = exports.DeleteTodo = async function DeleteTodo(id) {
  if (!id) return new _returnData2.default(false);

  var client = void 0,
      collection = void 0;
  try {
    var _ref7 = await connectServer('todo').catch(function (err) {
      throw err;
    }).then(function (val) {
      return val.data;
    });

    client = _ref7.client;
    collection = _ref7.collection;


    var updatedCount = await collection.deleteOne({ '_id': new _mongodb.ObjectID(id) }).catch(function (err) {
      throw err;
    }).then(function (val) {
      return val.result.n;
    });

    // TODO: Check why Promise.prototype.finally() is not working
    client.close();

    if (!updatedCount) return new _returnData2.default(false);

    _logger2.default.consoleLog('Deleted Todo');

    return new _returnData2.default(true);
  } catch (err) {
    // Make sure the connection to the db is closed
    if (isServerConnected(client)) client.close();

    _logger2.default.consoleLog('Error occured while executing DeleteTodo', err);
    return new _returnData2.default(false, null, err);
  }
};
//# sourceMappingURL=todoRepo.js.map