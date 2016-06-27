var WebSQL = {

	db: {
		generate: openDatabase('todo', '1.0', 'Todo Database', 5 * 1024 * 1024 ),

		onError: function(tx, ex) {
		  alert("Error: " + ex.message);
		},

		onSuccess: function(tx, results) {
			var len = results.rows.length;

			for(var i = 0; i < len; i++) {

				// render found todo item
				render(results.rows.item(i));
			}
		}
	},

	generateDB: function() {
		WebSQL.db.generate.transaction(function (tx) {
		  tx.executeSql(
		    'CREATE TABLE IF NOT EXISTS todo '+ 
		    '(id INTEGER PRIMARY KEY ASC, todo TEXT)',
		    [], 
		    WebSQL.db.onSuccess, 
		    WebSQL.db.onError
		  );
		})
	},

	addItemDB: function(item) {

		WebSQL.db.generate.transaction(function(tx) {
			tx.executeSql(
				'INSERT INTO todo(todo) VALUES (?)',
				[
					item.todo
				],
				WebSQL.db.onSuccess, 
		    	WebSQL.db.onError
			);
		})

	},

	modifyItemDB: function(item) {

		WebSQL.db.generate.transaction(function(tx) {
			tx.executeSql(
				'UPDATE todo SET todo = ? WHERE id = ?',
				[
					item.todo,
					item.id
				],
				WebSQL.db.onSuccess,
		    	WebSQL.db.onError
			);
		})
		
	},

	removeItemDB: function(id) {
		WebSQL.db.generate.transaction(function (tx) {
			tx.executeSql(
				'DELETE FROM todo WHERE id = ?',
				[
					id
				],
				WebSQL.db.onSuccess, 
		    	WebSQL.db.onError
			);
		})
	},

	readDB: function() {
		WebSQL.db.generate.transaction(function (tx) {
			tx.executeSql(
	    		'SELECT * FROM todo',
	    		[],
	    		WebSQL.db.onSuccess, 
		    	WebSQL.db.onError
			)
		})
	},

	readDBnotRepeat: function(column) {
		WebSQL.db.generate.transaction(function (tx) {
			tx.executeSql(
	    		'SELECT DISTINCT todo FROM ?',
	    		[
	    			column
	    		],
	    		WebSQL.db.onSuccess, 
		    	WebSQL.db.onError
			)
		})
	},

	index: function() {
		this.generateDB();
		this.addItemDB({ todo:"Manolo"});
	}

};

(function() {


	WebSQL.index();

	document.getElementById("deleteBtn").addEventListener("click", function(e) {
		e.preventDefault();
		WebSQL.readDB();
	});


})()

