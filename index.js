const url =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";

const firstInput = document.querySelector("#first-input");
const secondInput = document.querySelector("#second-input");
const leftMenu = document.querySelectorAll("#left-menu li");
const rightMenu = document.querySelectorAll("#right-menu li");
const firstFooter = document.querySelector("#first-input-footer");
const secondFooter = document.querySelector("#second-input-footer");
const wifiStatus = document.querySelector("#wifi-status");
const wifiStatusText = document.querySelector("#wifi-status-text");

let activeLeftMenu = "rub";
let activeRightMenu = "usd";
let firstResponse, secondResponse;

async function fetchData(lMenu, rMenu) {
  try {
    const [leftRes, rightRes] = await Promise.all([
      fetch(url + lMenu + ".json").then((res) => res.json()),
      fetch(url + rMenu + ".json").then((res) => res.json()),
    ]);
    firstResponse = leftRes[lMenu][rMenu];
    secondResponse = rightRes[rMenu][lMenu];

    firstFooter.textContent = `1 ${lMenu.toUpperCase()} = ${firstResponse} ${rMenu.toUpperCase()}`;
    secondFooter.textContent = `1 ${rMenu.toUpperCase()} = ${secondResponse} ${lMenu.toUpperCase()}`;

    if (activeInput === "first" && firstInput.value !== "") {
      secondInput.value =
        lMenu === rMenu
          ? firstInput.value
          : (firstResponse * firstInput.value).toFixed(6);
    } else if (activeInput === "second" && secondInput.value !== "") {
      firstInput.value =
        lMenu === rMenu
          ? secondInput.value
          : (secondResponse * secondInput.value).toFixed(6);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (!navigator.onLine) {
    wifiStatus.classList.add("offline");
  } else {
    wifiStatus.classList.remove("offline");
    fetchData(activeLeftMenu, activeRightMenu);
  }

  window.addEventListener("online", () => {
    wifiStatus.classList.remove("offline");
  });

  window.addEventListener("offline", () => {
    wifiStatus.classList.add("offline");
  });
});

leftMenu.forEach((item) => {
  item.addEventListener("click", (e) => {
    leftMenu.forEach((menu) => menu.classList.remove("active-nav"));
    e.target.classList.add("active-nav");
    activeLeftMenu = e.target.textContent.toLowerCase();
    fetchData(activeLeftMenu, activeRightMenu);
  });
});

rightMenu.forEach((item) => {
  item.addEventListener("click", (e) => {
    rightMenu.forEach((menu) => menu.classList.remove("active-nav"));
    e.target.classList.add("active-nav");
    activeRightMenu = e.target.textContent.toLowerCase();
    fetchData(activeLeftMenu, activeRightMenu);
  });
});

firstInput.addEventListener("keyup", (e) => {
  const inputValue = parseFloat(e.target.value);

  if (!isNaN(inputValue) && inputValue > 0) {
    secondInput.value =
      activeLeftMenu === activeRightMenu
        ? inputValue
        : (firstResponse * inputValue).toFixed(6);
  } else {
    secondInput.value = "";
  }
});

secondInput.addEventListener("keyup", (e) => {
  const inputValue = parseFloat(e.target.value);

  if (!isNaN(inputValue) && inputValue > 0) {
    firstInput.value =
      activeLeftMenu === activeRightMenu
        ? inputValue
        : (secondResponse * inputValue).toFixed(6);
  } else {
    firstInput.value = "";
  }
});

let activeInput = null;

firstInput.addEventListener("focus", () => {
  activeInput = "first";
});

secondInput.addEventListener("focus", () => {
  activeInput = "second";
});
