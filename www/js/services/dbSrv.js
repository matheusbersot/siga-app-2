/*Source: https://gist.github.com/jgoux/10738978*/

angular.module('myApp.services')
// DB wrapper
    .factory('DB', function ($q, DB_CONFIG) {
        var self = this;
        self.db = null;

        self.init = function () {

            var deferred = $q.defer();

            if (window.location.protocol == "file:") {
                self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name});
            } else {
                self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);
            }

            if(self.db){
                deferred.resolve("Conexão com o banco de dados foi estabelecida.");
            }
            else{
                deferred.resolve("Conexão com o banco de dados não foi estabelecida.");
            }

            angular.forEach(DB_CONFIG.tables, function (table) {
                var columns = [];

                angular.forEach(table.columns, function (column) {
                    columns.push(column.name + ' ' + column.type);
                });

                var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
                self.query(query);
                console.log('Table ' + table.name + ' initialized');
            });

            return deferred.promise;
        };

        self.query = function (query, bindings) {
            bindings = typeof bindings !== 'undefined' ? bindings : [];
            var deferred = $q.defer();

            self.db.transaction(function (transaction) {
                transaction.executeSql(query, bindings, function (transaction, result) {
                    deferred.resolve(result);
                }, function (transaction, error) {
                    deferred.reject(error);
                });
            });

            return deferred.promise;
        };

        self.fetchAll = function (result) {
            var output = [];

            for (var i = 0; i < result.rows.length; i++) {
                output.push(result.rows.item(i));
            }

            return output;
        };

        self.fetch = function (result) {
            if(result.rows > 0)
            {
                return result.rows.item(0);
            }
            return null;
        };

        return self;
    });
