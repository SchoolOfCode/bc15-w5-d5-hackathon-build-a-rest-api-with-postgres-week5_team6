async function sendFetchRequest(method = "GET", url = "http://localhost:3000/books", bodyParms) {
  // console.log ("client send fetch request", "method: ", method, "url: ", url, "bodyParms: ", bodyParms);
  try {
    const options = {
      method: method,
      headers: { "Content-Type": "application/json" },
    };

    if (["POST", "PATCH"].includes(method)) {
      options.body = JSON.stringify(bodyParms);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.status === "fail") {
        return errorData;
      }
      console.error(`Error received: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// async function sendRequest() {
//     const method = document.querySelector('#method').value;
//     const url = document.querySelector('#url').value;
//     bodyParms = document.querySelector("#bodyParms").value;
//     if (bodyParms) {
//       bodyParms = JSON.parse(bodyParms);
//     }
//     const data = await sendFetchRequest(method, url, bodyParms);
// }

// function snd(event) {
//     event.preventDefault();
//     sendRequest();
// }
