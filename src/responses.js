const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  response.write(content);
  response.end();
};

const respondXML = (request, response, status, object) => {
  let content = '<response>';
  if (object.message) {
    content += `<message>${object.message}</message>`;
  }
  if (object.id) {
    content += `<id>${object.id}</id>`;
  }
  content += '</response>';

  response.writeHead(status, {
    'Content-Type': 'text/xml',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  response.write(content);
  response.end();
};

// success status code
const success = (request, response) => {
  const responseJSON = {
    message: 'This is a successful response',
  };

  const acceptHeader = request.headers.accept || 'application/json';

  if (acceptHeader.includes('text/xml')) {
    return respondXML(request, response, 200, responseJSON);
  }

  return respondJSON(request, response, 200, responseJSON);
};

// bad request without the correct parameters
const badRequest = (request, response) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  const acceptHeader = request.headers.accept || 'application/json';

  // if the request does not contain a valid=true query parameter
  if (!request.query.valid || request.query.valid !== 'true') {
    responseJSON.message = 'Missing valid query parameter set to true';
    responseJSON.id = 'badRequest';

    if (acceptHeader.includes('text/xml')) {
      return respondXML(request, response, 400, responseJSON);
    }
    return respondJSON(request, response, 400, responseJSON);
  }

  if (acceptHeader.includes('text/xml')) {
    return respondXML(request, response, 200, responseJSON);
  }
  return respondJSON(request, response, 200, responseJSON);
};

// unauthorized error
const unauthorized = (request, response) => {
  const responseJSON = {
    message: 'You have successfully viewed the content.',
  };

  const acceptHeader = request.headers.accept || 'application/json';

  // if the request does not contain a loggedIn=yes query parameter
  if (!request.query.loggedIn || request.query.loggedIn !== 'yes') {
    responseJSON.message = 'Missing loggedIn query parameter set to yes';
    responseJSON.id = 'unauthorized';

    if (acceptHeader.includes('text/xml')) {
      return respondXML(request, response, 401, responseJSON);
    }
    return respondJSON(request, response, 401, responseJSON);
  }

  if (acceptHeader.includes('text/xml')) {
    return respondXML(request, response, 200, responseJSON);
  }
  return respondJSON(request, response, 200, responseJSON);
};

// forbidden error
const forbidden = (request, response) => {
  const responseJSON = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };

  const acceptHeader = request.headers.accept || 'application/json';

  if (acceptHeader.includes('text/xml')) {
    return respondXML(request, response, 403, responseJSON);
  }
  return respondJSON(request, response, 403, responseJSON);
};

// internal server error
const internal = (request, response) => {
  const responseJSON = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  const acceptHeader = request.headers.accept || 'application/json';

  if (acceptHeader.includes('text/xml')) {
    return respondXML(request, response, 500, responseJSON);
  }
  return respondJSON(request, response, 500, responseJSON);
};

// not implemented error
const notImplemented = (request, response) => {
  const responseJSON = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };

  const acceptHeader = request.headers.accept || 'application/json';

  if (acceptHeader.includes('text/xml')) {
    return respondXML(request, response, 501, responseJSON);
  }
  return respondJSON(request, response, 501, responseJSON);
};

// not found error
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  const acceptHeader = request.headers.accept || 'application/json';

  if (acceptHeader.includes('text/xml')) {
    return respondXML(request, response, 404, responseJSON);
  }
  return respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
