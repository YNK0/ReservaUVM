const logRequest = (req, res, next) => {
  console.log('------------- Nueva petición');
  console.log(`Tipo de petición: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log('Params:', req.params);
  console.log('Body:', req.body);
  console.log('------------- Fin de la petición');
  next();
};

module.exports = logRequest;