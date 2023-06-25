function validateForm() {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const service = document.getElementById("service");
  const message = document.getElementById("message");

  removeInvalidClass();

  if (name.value.trim() === "") {
    showError(name, "Please enter your name.");
    return false;
  }

  if (email.value.trim() === "") {
    showError(email, "Please enter your email.");
    return false;
  }

  if (!validateEmail(email.value)) {
    showError(email, "Please enter a valid email address.");
    return false;
  }

  if (phone.value.trim() === "") {
    showError(phone, "Please enter your phone number.");
    return false;
  }

  if (!validatePhoneNumber(phone.value)) {
    showError(phone, "Please enter a valid phone number.");
    return false;
  }

  if (service.value.trim() === "") {
    showError(service, "Please select a service.");
    return false;
  }

  if (message.value.trim() === "") {
    showError(message, "Please enter your message.");
    return false;
  }

  SubForm();
  return true;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhoneNumber(phone) {
  const phoneRegex = /^\d{10}$/; // Assumes a 10-digit phone number format
  return phoneRegex.test(phone);
}

function removeInvalidClass() {
  const invalidFields = document.querySelectorAll(".invalid");
  invalidFields.forEach((field) => {
    field.classList.remove("invalid");
  });

  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((message) => {
    message.textContent = "";
  });
}

function showError(field, message) {
  field.classList.add("invalid");
  const errorMessage = document.createElement("span");
  errorMessage.className = "error-message";
  errorMessage.textContent = message;
  field.parentNode.appendChild(errorMessage);
}

function SubForm() {
  const form = document.getElementById("myForm");

  if (form.checkValidity()) {
    $.ajax({
      url: "https://api.apispreadsheets.com/data/atXetd4pJwJaEdoh/",
      type: "post",
      data: $("#myForm").serializeArray(),
      success: function () {
        form.reset();
        const toast = document.getElementById("toastMessage");
        toast.classList.add("show");

        setTimeout(function () {
          toast.classList.remove("show");
        }, 3000);
      },
      error: function () {
        alert("There was an error :(");
      },
    });
  }
}

// Array to store service requests
var requests = [];

// Function to add a new request to the array
function addRequest() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;
  var service = document.getElementById("service").value;
  var message = document.getElementById("message").value;

  var request = {
    name: name,
    email: email,
    phone: phone,
    service: service,
    message: message,
  };

  requests.push(request);

  // Clear the form fields after submission
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("service").value = "";
  document.getElementById("message").value = "";

  // Display the table after adding a request
  displayTable();
}

// Function to display the table of requests
function displayTable() {
  var table = document.getElementById("requestTable");
  var tbody = table.getElementsByTagName("tbody")[0];
  tbody.innerHTML = ""; // Clear existing table rows

  // Generate table rows based on the requests array
  for (var i = 0; i < requests.length; i++) {
    var request = requests[i];

    var row = document.createElement("tr");
    row.innerHTML = `
      <td>${request.name}</td>
      <td>${request.email}</td>
      <td>${request.phone}</td>
      <td>${request.service}</td>
      <td>${request.message}</td>
      
    <td>
        <button onclick="makeEditable(this)" class="edit-button">Edit</button>
        <button onclick="updateRow(this)" style="display: none;" class="save-button">Save</button>
      </td>
    `;

    tbody.appendChild(row);
  }

  // Show the table container
  document.getElementById("tableContainer").style.display = "block";
}

// Function to edit a request
function editRequest(index) {
  var request = requests[index];

  // Set the form fields with the request data for editing
  document.getElementById("name").value = request.name;
  document.getElementById("email").value = request.email;
  document.getElementById("phone").value = request.phone;
  document.getElementById("service").value = request.service;
  document.getElementById("message").value = request.message;

  // Remove the edited request from the array
  requests.splice(index, 1);

  // Hide the table container after editing a request
  document.getElementById("tableContainer").style.display = "none";
}

// Function to delete a request
function deleteRequest(index) {
  // Remove the request from the array
  requests.splice(index, 1);

  // Refresh the table display
  displayTable();
}

// Function to validate the form
function validateForm() {
  // Your form validation code here

  // api call to save form data to server
  SubForm();

  // Call addRequest() if the form is valid
  addRequest();
}

//make table row editable when edit on that row is clicked
function makeEditable(button) {
  var row = button.parentNode.parentNode;
  var cells = row.getElementsByTagName("td");

  for (var i = 0; i < cells.length - 1; i++) {
    var cell = cells[i];
    if (cell.getAttribute("contenteditable") === "true") {
      // If already editable, make it non-editable
      cell.setAttribute("contenteditable", "false");
    } else {
      // If not editable, make it editable
      if (i === 3) {
        // Set "Service" field as a dropdown
        var serviceDropdown = cell.querySelector(".editable-dropdown");
        if (serviceDropdown) {
          // Dropdown already exists, update selected value
          var currentValue = cell.textContent.trim();
          serviceDropdown.value = currentValue;
        } else {
          // Dropdown doesn't exist, create a new one
          var serviceOptions = ["Dog Walking", "Dog Grooming", "Dog Boarding"];
          serviceDropdown = document.createElement("select");
          serviceDropdown.className = "editable-dropdown";
          serviceOptions.forEach(function (option) {
            var optionElement = document.createElement("option");
            optionElement.value = option;
            optionElement.text = option;
            serviceDropdown.appendChild(optionElement);
          });
          // Set the initial selected value
          var currentValue = cell.textContent.trim();
          serviceDropdown.value = currentValue;
          // Replace the cell's content with the dropdown
          cell.innerHTML = "";
          cell.appendChild(serviceDropdown);
        }
      } else {
        // Set other cells as editable
        cell.setAttribute("contenteditable", "true");
        cell.focus();
      }
    }
  }

  var editButton = row.querySelector("button:nth-of-type(1)");
  var saveButton = row.querySelector("button:nth-of-type(2)");
  editButton.style.display = "none";
  saveButton.style.display = "inline";
}

function updateRow(button) {
  var row = button.parentNode.parentNode;
  var cells = row.getElementsByTagName("td");
  var data = {};

  for (var i = 0; i < cells.length - 1; i++) {
    var cell = cells[i];
    var columnName = "column" + (i + 1);
    var cellValue;

    if (i === 3) {
      // Handle service dropdown
      var serviceDropdown = cell.querySelector(".editable-dropdown");
      cellValue = serviceDropdown.value;
    } else {
      // Get the cell's text content
      cellValue = cell.textContent.trim();
    }

    data[columnName] = cellValue;
    cell.setAttribute("contenteditable", "false");
  }

  var editButton = row.querySelector("button:nth-of-type(1)");
  var saveButton = row.querySelector("button:nth-of-type(2)");
  editButton.style.display = "inline";
  saveButton.style.display = "none";

  // Update data on the server based on the user's email
  fetch("https://api.apispreadsheets.com/data/atXetd4pJwJaEdoh/", {
    method: "POST",
    body: JSON.stringify({
      data: {
        Name: data["column1"],
        Email: data["column2"],
        Phone: data["column3"],
        Service: data["column4"],
        Message: data["column5"],
      },
      query:
        "select * from 4PgfMemc4PctVv1X where email=" +
        "'" +
        data["column2"] +
        "'",
    }),
  }).then((res) => {
    if (res.status === 201) {
      const toast = document.getElementById("toastMessage");
      toast.classList.add("show");

      setTimeout(function () {
        toast.classList.remove("show");
      }, 3000);
    } else {
      // ERROR
      alert("There was an error saving your request :(");
    }
  });
}
