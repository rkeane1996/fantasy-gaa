export const StatusCode: { [name: string]: any } = {
    OK: {
      status: 200,
      statusText: 'OK'
    },
  
    BAD_REQUEST: {
      status: 400,
      statusText: 'Bad Request'
    },

    FORBIDDEN: {
      status: 403,
      statusText: 'Forbidden'
    },

    UNAUTHORIZED: {
      status: 401,
      statusText: 'Unauthorized'
    },
  
    NOT_FOUND: {
      status: 404,
      statusText: 'Not Found'
    }
  };