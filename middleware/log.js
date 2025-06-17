const logRequestAndResponse = (req, res, next) => {
  console.log('--- Nueva petición ---');
  console.log(`Tipo de petición: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log('Params:', req.params);
  console.log('Body:', req.body);

  const originalSend = res.send;
  res.send = function (body) {
    if (typeof body === 'object') {
      console.log('Respuesta:', JSON.stringify(body));
    } else {
      console.log('Respuesta:', body);
    }
    return originalSend.call(this, body);
  };
  next();
};

module.exports = logRequestAndResponse;