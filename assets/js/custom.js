// Seymur Mammadov, 2026-11-20, v6.0

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

const defaultSkills = [
  { name: "HTML Basics", status: "Completed", xp: 30 },
  { name: "CSS Styling", status: "Completed", xp: 45 },
  { name: "Git and GitHub", status: "Completed", xp: 25 },
  { name: "Bootstrap Grid", status: "In Progress", xp: 35 },
  { name: "JavaScript Basics", status: "In Progress", xp: 60 },
  { name: "Forms and Validation", status: "Planned", xp: 50 },
  { name: "DOM Manipulation", status: "Planned", xp: 70 },
  { name: "Local Storage", status: "Planned", xp: 40 },
];

const statuses = ["Planned", "In Progress", "Completed"];

const lists = {
  "Planned": document.getElementById("plannedList"),
  "In Progress": document.getElementById("inProgressList"),
  "Completed": document.getElementById("completedList"),
};

let skills = loadSkills();

function loadSkills() {
  const saved = localStorage.getItem("skills");
  if (saved) {
    return JSON.parse(saved);
  }
  return defaultSkills.map(function (skill) {
    return { name: skill.name, status: skill.status, xp: skill.xp };
  });
}

function saveSkills() {
  localStorage.setItem("skills", JSON.stringify(skills));
}

function createCard(skill, index) {
  const card = document.createElement("div");
  card.className = "skill-card";

  const title = document.createElement("h5");
  title.textContent = skill.name;

  const select = document.createElement("select");
  select.className = "status-select";
  for (const status of statuses) {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    if (status === skill.status) {
      option.selected = true;
    }
    select.appendChild(option);
  }
  select.addEventListener("change", function () {
    changeStatus(index, select.value);
  });

  const xp = document.createElement("span");
  xp.className = "xp";
  xp.textContent = skill.xp + " XP";

  card.appendChild(title);
  card.appendChild(select);
  card.appendChild(xp);
  return card;
}

function renderCards() {
  for (const status of statuses) {
    lists[status].innerHTML = "";
  }

  skills.forEach(function (skill, index) {
    lists[skill.status].appendChild(createCard(skill, index));
  });

  for (const status of statuses) {
    const count = skills.filter(function (skill) {
      return skill.status === status;
    }).length;
    lists[status].parentElement.querySelector(".count").textContent = "(" + count + ")";
  }
}

function getLevel(xp) {
  if (xp >= 300) {
    return { level: 4, rank: "Professional", min: 300, max: 300 };
  }
  if (xp >= 150) {
    return { level: 3, rank: "Specialist", min: 150, max: 300 };
  }
  if (xp >= 50) {
    return { level: 2, rank: "Trainee", min: 50, max: 150 };
  }
  return { level: 1, rank: "Beginner", min: 0, max: 50 };
}

function updateProgress() {
  let totalXp = 0;
  for (const skill of skills) {
    if (skill.status === "Completed") {
      totalXp += skill.xp;
    }
  }

  const info = getLevel(totalXp);
  let percent = 100;
  if (info.level < 4) {
    percent = Math.round(((totalXp - info.min) / (info.max - info.min)) * 100);
  }

  document.getElementById("totalXp").textContent = totalXp + " XP";
  document.getElementById("level").textContent = "Level " + info.level;
  document.getElementById("rank").textContent = info.rank;
  document.getElementById("xpBar").style.width = percent + "%";

  if (info.level < 4) {
    document.getElementById("progressText").textContent = percent + "% (" + totalXp + " / " + info.max + " XP)";
  } else {
    document.getElementById("progressText").textContent = "100% (max level)";
  }
}

function updateStats() {
  const total = skills.length;
  const completed = skills.filter(function (skill) {
    return skill.status === "Completed";
  }).length;
  const percent = Math.round((completed / total) * 100);

  document.getElementById("totalSkills").textContent = total;
  document.getElementById("completedSkills").textContent = completed;
  document.getElementById("completedPercent").textContent = percent + "%";
}

function changeStatus(index, newStatus) {
  skills[index].status = newStatus;
  saveSkills();
  updateModule();
}

function updateModule() {
  renderCards();
  updateProgress();
  updateStats();
}

updateModule();
