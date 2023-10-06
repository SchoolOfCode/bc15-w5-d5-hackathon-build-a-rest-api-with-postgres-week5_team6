export function jSendSuccess(data) {
    const jSendObj = {
        status: "success"
    }
    if (Array.isArray(data)) {
        jSendObj.data = {users: data}
    } else {
        jSendObj.data = {user: data}
    }

    return jSendObj;
}

export function jSendError(err) {
  const jSendObj = {
    status: err.status || 'error',
    message: err.message || 'An error occurred'
  }

  return jSendObj;
}
