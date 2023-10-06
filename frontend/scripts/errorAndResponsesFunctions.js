const userId = document.querySelector("#userId");
const submitButton = document.querySelector("#getButton");
const container = document.querySelector("#resultsHolder");

function displayErrorAndResponseDetails(contentObj, container) {
  const div = document.createElement("div");
  console.log(contentObj);
  appendPara(div, "errordescription", `${contentObj.description}`);
  appendPara(div, "cause", `${contentObj.cause}`);
  appendPara(div, "error_code", `${contentObj.error_code}`);
  appendPara(div, "error_message", `${contentObj.error_message}`);
  appendPara(div, "solution", contentObj.solution);
  appendPara(div, "workshop", contentObj.workshop);
  container.appendChild(div);
}

function displayBookDetails(contentObj, container) {
  const div = document.createElement("div");
  appendPara(
    div,
    "title",
    `${contentObj.title} - ${contentObj.published_date.slice(0, 4)}`
  );
  // appendPara(div, "published_date", `${contentObj.published_date.slice(0,4)}`);
  // appendPara(div, "catchphrase", `Catchphrase: ${contentObj.catchphrase}`);
  appendPara(div, "bookId", contentObj.id);
  container.appendChild(div);
}

function appendPara(parent, className, textContent) {
  const elem = document.createElement("p");
  elem.classList.add(className);
  elem.textContent = textContent;
  parent.appendChild(elem);
}

function clearBooks() {
  for (let child of container.children) {
    child.remove();
  }
}

async function showAll() {
  const response = await sendFetchRequest(
    "GET",
    "http://localhost:3000/errors/responses"
  );
  if ((response.status = "success")) {
    const contentsArray = response.data;
    contentsArray.forEach((contentObj) => {
      displayErrorAndResponseDetails(contentObj, container);
    });
  }
}

async function getBook() {
  const idElem = document.querySelector("#bookId");
  const url = `http://localhost:3000/books/` + idElem.value;
  const response = await sendFetchRequest("GET", url);
  clearBooks();
  if (response.status === "success") {
    const contentObj = response.data;
    displayBookDetails(contentObj, container);
    idElem.value = "";
  } else {
    const div = document.createElement("div");
    appendPara(div, "book", response.data.msg);
    container.appendChild(div);
  }
}

function deleteUser1(event) {
  event.preventDefault();
  deleteUser();
}

async function deleteUser() {
  console.log("Delete user function is being called");
  const idElem = document.querySelector("#userId");
  const url = `http://localhost:3000/users/` + idElem.value;
  const response = await sendFetchRequest("DELETE", url);
  clearUsers();
  if (response.status === "success") {
    const contentObj = response.data.user;
    displayUserDetails(contentObj, container);
    console.log("displaying user details");
    // idElem.value = "";
  } else {
    const div = document.createElement("div");
    appendPara(div, "user", response.message);
    container.appendChild(div);
  }
}

// document.querySelector("#userId")?.addEventListener("input", (event) => {
//   event.target.value.length === 0 ? (submitButton.disabled = true) : (submitButton.disabled = false);
// });

// console.log("entering userFunctions.js");
