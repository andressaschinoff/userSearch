let tabFound = null;
let tabStatistic = null;
let totalUser = null;
let foundStatistic = null;

let searchInput = null;
let searchButton = null;

let allUsers = [];
let foundUsers = [];

let countFemaleGenderStatistic = 0;
let countMaleGenderStatistic = 0;

let totalAges = 0;
let avarageAge = 0;

let numberFormat = null;

window.addEventListener('load', () => {
  tabFound = document.querySelector('#tabFound');
  tabStatistic = document.querySelector('#tabStatistic');
  totalUsers = document.querySelector('#totalUsers');
  foundStatistic = document.querySelector('#foundStatistic');

  searchInput = document.querySelector('#searchInput');
  searchButton = document.querySelector('#searchButton');

  numberFormat = Intl.NumberFormat('pt-BR');
  fetchUsers();
});

async function fetchUsers() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();
  allUsers = await json.results.map((user) => {
    const { first: name, last: surname } = user.name;
    const { age } = user.dob;
    const { gender } = user;
    const picture = user.picture.thumbnail;
    return { name, surname, age, gender, picture };
  });

  preventFormSubmit();
  activateInput();
}

function preventFormSubmit() {
  function handleFormSubmit(event) {
    event.preventDefault();
  }

  let form = document.querySelector('form');
  form.addEventListener('submit', handleFormSubmit);
}

function activateInput() {
  function handleTyping(event) {
    const hasText = !!event.target.value && event.target.value.trim() !== '';
    const disabled = 'disabled';
    const active = 'waves-effect waves-light';
    if (!hasText) {
      clearInput();
      return;
    } else {
      searchButton.className = searchButton.className.replace(disabled, active);
    }

    if (event.key === 'Enter') {
      startSearch();
    }
  }

  function startSearch() {
    searchUsers();
    clearInput();
    render();
    countMaleGenderStatistic = 0;
    countFemaleGenderStatistic = 0;
  }

  searchButton.addEventListener('click', startSearch);
  searchInput.addEventListener('keyup', handleTyping);
  searchInput.focus();
}

function clearInput() {
  searchInput.value = '';
  searchInput.focus();
  const disabled = 'disabled';
  const active = 'waves-effect waves-light';
  searchButton.className = searchButton.className.replace(active, disabled);
}

function searchUsers() {
  foundUsers = allUsers
    .filter((user) => {
      const first = user.name.toLowerCase();
      const last = user.surname.toLowerCase();
      const textToSearch = searchInput.value.toLowerCase();
      const foundName = first.includes(textToSearch);
      const foundSurname = last.includes(textToSearch);
      if (foundName || foundSurname) {
        return user;
      }
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
}

function render() {
  renderGenderCounter();
  renderAgesCalc();
  renderFoundUsers();
  renderStatistics();
}

function renderFoundUsers() {
  totalUsers.innerHTML = `${foundUsers.length} usuário(s) encontrado(s)`;
  let foundHTML = `<div>`;
  foundUsers.forEach((user) => {
    const { name, surname, age, picture } = user;
    const userHTML = `
        <div>
          <img src='${picture}' alt='${name} ${surname}'>
          <span class='align'>${name} ${surname}, ${age} anos</span>
        <div>
        `;

    foundHTML += userHTML;
  });

  foundHTML += '</div>';
  tabFound.innerHTML = foundHTML;
}

function renderStatistics() {
  foundStatistic.innerHTML = `Estatísticas`;
  let statisticHTML = `
    <div>
      <p>Sexo Masculino: <span class='bold'>${countMaleGenderStatistic}</span></p>
      <p>Sexo Feminino: <span class='bold'>${countFemaleGenderStatistic}</span></p>
      <p>Soma das idades: <span class='bold'>${totalAges}</span></p>
      <p>Média das idades: <span class='bold'>${avarageAge}</span></p>
    </div>
    `;

  tabStatistic.innerHTML = statisticHTML;
}

function renderGenderCounter() {
  foundUsers.forEach((user) => {
    const { gender } = user;
    if (gender == 'female') {
      countFemaleGenderStatistic++;
    } else {
      countMaleGenderStatistic++;
    }
  });
  return { countFemaleGenderStatistic, countMaleGenderStatistic };
}

function renderAgesCalc() {
  totalAges = foundUsers.reduce((acc, curr) => {
    return acc + curr.age;
  }, 0);

  avarageAge = totalAges / foundUsers.length;
  avarageAge = avarageAge.toFixed(2);
  totalAges = formatNumber(totalAges);
  avarageAge = formatNumber(avarageAge);
}

function formatNumber(number) {
  return numberFormat.format(number);
}
