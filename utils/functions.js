//
// Permet d'imposer un temps de pause avant de continuer l'exécution du code.
//
module.exports.sleep = ( milliseconds ) =>
{
	return new Promise( resolve => setTimeout( resolve, milliseconds ) );
};