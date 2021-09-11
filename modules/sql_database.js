//
// Enregistrement de données via base de données SQL.
// Source : https://www.npmjs.com/package/mysql
//
const mysql = require("mysql")
const {sqlHost, sqlUser, sqlPassword, sqlDatabase} = require("../data/__internal__.json")

const connection = mysql.createConnection({
    host: sqlHost,
    user: sqlUser,
    password: sqlPassword,
    database: sqlDatabase
})

module.exports = {

	// Connexion à la base de données.
	connect: () => {

		return new Promise((resolve, reject) => {

			// On vérifie si la base de données n'est pas déjà connectée.
			if (connection.state == "connected")
			{
				resolve("[Info] La base de données est déjà connectée.")
				return
			}

			// Dans le cas contraire, on essaie d'établir la connexion.
			connection.connect((error) => {

				// On vérifie si la connexion a réussie.
				if (error)
				{
					reject(`[Erreur] Impossible de se connecter à la base de données SQL, ${error.message}`)
					return
				}

				// On créé alors la table de configuration.
				connection.query(`CREATE TABLE IF NOT EXISTS \`configuration\` (

					\`guildID\` VARCHAR(20) NOT NULL,
					\`name\` VARCHAR(30) NOT NULL,
					\`value\` VARCHAR(255) NOT NULL

				)`)

				// On affiche enfin le message de connexion avec l'identifiant associé.
				resolve(`[Info] Connexion réussie à la base de données, ID : ${connection.threadId}.`)

			})

		})

	},

	// Définition d'une valeur sauvegardée.
	setSaveData: (id, name, value) => {

		return new Promise(async() => {

			// On vérifie si la connexion avec la base de données est déjà établie.
			await module.exports.connect()
				.then(console.log)
				.catch((message) => {

					console.log(message)

					return

				})

			// On rend ensuite valide les arguments renseignés.
			id = connection.escape(id)
			name = connection.escape(name)
			value = connection.escape(value)

			// On fait une première requête SQL pour vérifier si une valeur est déjà présente.
			var selectQuery = `
				SELECT \`value\` FROM \`configuration\`
				WHERE \`guildID\` = ${id} AND \`name\` = ${name};`

			connection.query(selectQuery, (error, results) => {

				// On affiche un message d'erreur si la requête échoue.
				if (error)
				{
					console.log(`[Erreur] Erreur lors de la requête SQL, ${error.message}`)
					return
				}

				// Dans le cas contraire, on vérifie le nombre de résultats.
				console.log(results)

				if (results.length <= 0)
				{
					// Ajout d'une nouvelle entrée.
					connection.query(`
						INSERT INTO \`configuration\` (\`guildID\`, \`name\`, \`value\`)
						VALUES (${id}, ${name}, ${value});
					`)
				}
				else
				{
					// Actualisation d'une entrée existante.
					connection.query(`
						UPDATE \`configuration\` SET \`value\` = ${value}
						WHERE \`guildID\` = ${id} AND \`name\` = ${name};
					`)
				}

			})

		})

	},

	// Récupération d'une valeur sauvegardée.
	getSaveData: (id, name, fallback) => {

		return new Promise(async(resolve) => {

			// On vérifie si la connexion avec la base de données est déjà établie.
			await module.exports.connect()
				.then(console.log)
				.catch((message) => {

					console.log(message)

					resolve(fallback)

					return

				})

			// On rend ensuite valide les arguments renseignés.
			id = connection.escape(id)
			name = connection.escape(name)

			// On effectue enfin une requête pour obtenir la valeur.
			var selectQuery = `
				SELECT \`value\` FROM \`configuration\`
				WHERE \`guildID\` = ${id} AND \`name\` = ${name}`

			connection.query(selectQuery, (error, results) => {

				// On vérifie si le résultat n'est pas une erreur.
				if (error)
				{
					resolve(fallback)
					return
				}

				// Dans le cas contraire, on résout la promesse avec les informations retournées.
				resolve(results.length <= 0 && fallback || results[0].value)

			})

		})

	}

}