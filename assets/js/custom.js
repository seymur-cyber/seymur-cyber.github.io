// Seymur Mammadov, 2026-11-20, v5.0

const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const result = document.getElementById("formResult");
const phoneInput = document.getElementById("phone");

const fieldIds = ["firstName", "lastName", "email", "phone", "address", "rating1", "rating2", "rating3"];
const touched = {};

function getError(id, value) {
  if (value === "") {
    return "This field is required";
  }
  if ((id === "firstName" || id === "lastName") && !/^\p{L}+$/u.test(value)) {
    return "Only letters are allowed";
  }
  if (id === "email" && !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value)) {
    return "Email format is not correct";
  }
  if (id === "phone" && !/^\+370 6\d{2} \d{5}$/.test(value)) {
    return "Phone must be +370 6xx xxxxx";
  }
  if (id.startsWith("rating")) {
    const number = Number(value);
    if (!Number.isInteger(number) || number < 1 || number > 10) {
      return "Rating must be from 1 to 10";
    }
  }
  return "";
}

function checkField(id) {
  const input = document.getElementById(id);
  const error = getError(id, input.value.trim());
  const errorText = input.nextElementSibling;

  if (touched[id] && error !== "") {
    input.classList.add("is-invalid");
    errorText.textContent = error;
  } else {
    input.classList.remove("is-invalid");
    errorText.textContent = "";
  }

  return error === "";
}

function checkForm() {
  let allValid = true;
  for (const id of fieldIds) {
    if (!checkField(id)) {
      allValid = false;
    }
  }
  submitBtn.disabled = !allValid;
}

function formatPhone(value) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("370")) {
    digits = digits.slice(3);
  } else if (value.startsWith("+37")) {
    digits = "";
  } else if (digits.startsWith("8")) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 8);

  if (digits === "") {
    return "";
  }

  let formatted = "+370 " + digits.slice(0, 3);
  if (digits.length > 3) {
    formatted += " " + digits.slice(3);
  }
  return formatted;
}

function showResult(data, average) {
  result.innerHTML = "";

  const lines = [
    "First name: " + data.firstName,
    "Last name: " + data.lastName,
    "Email: " + data.email,
    "Phone number: " + data.phone,
    "Address: " + data.address,
    "Rating 1: " + data.rating1,
    "Rating 2: " + data.rating2,
    "Rating 3: " + data.rating3,
  ];

  for (const line of lines) {
    const p = document.createElement("p");
    p.textContent = line;
    result.appendChild(p);
  }

  const averageLine = document.createElement("p");
  averageLine.className = "average";
  averageLine.textContent = data.firstName + " " + data.lastName + ": " + average;
  result.appendChild(averageLine);
}

phoneInput.addEventListener("beforeinput", function (event) {
  if (event.data && /\D/.test(event.data)) {
    event.preventDefault();
  }
});

phoneInput.addEventListener("input", function () {
  phoneInput.value = formatPhone(phoneInput.value);
});

for (const id of fieldIds) {
  document.getElementById(id).addEventListener("input", function () {
    touched[id] = true;
    checkForm();
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const data = {
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim(),
    rating1: Number(document.getElementById("rating1").value),
    rating2: Number(document.getElementById("rating2").value),
    rating3: Number(document.getElementById("rating3").value),
  };

  console.log(data);

  const average = ((data.rating1 + data.rating2 + data.rating3) / 3).toFixed(1);
  showResult(data, average);
});

clearBtn.addEventListener("click", function () {
  form.reset();
  result.innerHTML = "";
  for (const id of fieldIds) {
    touched[id] = false;
  }
  checkForm();
});

checkForm();
