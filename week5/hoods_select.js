function initHoodsSelect(el, hoods) {
  // the variables inside the querySelector depends on the HTML file
  const listEl = el.querySelector('ul');
  const searchEL = el.querySelector('.search');

  // Initialize list items
  const hoodListItems = {}; // object not array

  // separate variable stores checked items so they don't dissapear
  function initListItems() {
    for (const hood of hoods) {
      const hoodNames = hood.properties['NAME'];
      const item = document.createElement('li');
      item.innerHTML = `
        <li>
          <label>
            <input name="neighborhood" type="checkbox" value="${hood.properties['NAME']}></input>
            ${hood.properties['LISTNAME']}
          </label>
        </li>
      `;
      hoodListItems[hoodName] = item;
    }
  }

  initListItems();

  // Populate the list of data
  function populateList(hoods) {
    listEl.innerHTML = '';

    hoods = hoods.sort((a, b) => {
      return a.properties['LISTNAME'].localeCompare(
        b.properties['LISTNAME'],
      );
    });
  }

  // Capture search input
  searchEL.addEventListener('change', (evt) => {
    const filteredHoods = hoods.filter((hood) => {
      const searchValue = searchEL.value.toLowerCase(); // good for general search
      const hoodName = hood.properties['LISTNAME'].toLowerCase();
      return hoodName.includes(searchValue);
    });
  });
}

export { initHoodsSelect };
