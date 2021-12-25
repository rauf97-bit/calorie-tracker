// POPULATE UI FUNCTION
const UIctrl = (function () {
  // SELECTOR FOR UI VALUES
  const UIselectors = {
    listItems: "#list-collection",
    addBtn: "#add-btn",
    calorieInput: "#calorie",
    nameInput: "#meal",
    totalCalorie : '.total',
    backBtn : '#back-btn',
    deleteBtn : '#delete-btn',
    updateBtn : '#update-btn',
  };

  return {
    // POPULATE DATA TO UI 
    populateData: function (data) {
      let list = "";
      data.forEach((item) => {
        list += `
        <li class="border-0 border-b-2 border-gray-300 py-2 text-1xl items-center flex justify-between" id="item-${item.id}" >
            <strong>${item.name} : <em>${item.calorie} Calorie</em></strong>
            <button class="px-2 text-xl py-1 rounded hover:opacity-80 text-white bg-gray-700" id="edit">&Leftrightarrow; Edit</button>
        </li>
        `;
      });
      document.querySelector(UIselectors.listItems).innerHTML = list;
    },
    // EXPORT UI SELECTORS
    getSelectors: function () {
      return UIselectors;
    },
    // EXPORT INPUT SELECTORS
    getInput: function () {
      return {
        name: document.querySelector(UIselectors.nameInput),
        calorie: document.querySelector(UIselectors.calorieInput),
      };
    },
    addItem : function (item) {
      const li = document.createElement('li')
      li.className = 'border-0 border-b-2 border-gray-300 py-2 text-1xl items-center flex justify-between'
      li.id = `item-${item.id}`
      li.innerHTML = `
      <strong>${item.name} : <em>${item.calorie} Calorie</em></strong>
      <button class="px-2 text-xl py-1 rounded hover:opacity-80 edit-btn  text-white bg-gray-700" id="edit">&Leftrightarrow; Edit</button>
      `;
      document.querySelector(UIselectors.listItems).insertAdjacentElement('beforeend', li)
    },
    showTotal : function (item) {
      document.querySelector(UIselectors.totalCalorie).textContent  = item;
    },
    clearInput : function () {
      document.querySelector(UIselectors.nameInput).value = ''
      document.querySelector(UIselectors.calorieInput).value = ''
    },
    addEditItem : function (item) {
      document.querySelector(UIselectors.nameInput).value = item.name
      document.querySelector(UIselectors.calorieInput).value = item.calorie
      UIctrl.showEditState()
    },
    clearEditState : function () {
      document.querySelector(UIselectors.addBtn).style.display = 'block'
      document.querySelector(UIselectors.deleteBtn).style.display = 'none'
      document.querySelector(UIselectors.backBtn).style.display = 'none'
      document.querySelector(UIselectors.updateBtn).style.display = 'none'
    },
    showEditState : function () {
      document.querySelector(UIselectors.addBtn).style.display = 'none'
      document.querySelector(UIselectors.deleteBtn).style.display = 'block'
      document.querySelector(UIselectors.backBtn).style.display = 'block'
      document.querySelector(UIselectors.updateBtn).style.display = 'block'
    },
  };
})();

// FETCH UI DATA
const ItemsCtlr = (function () {
  // CONSTRUCTOR FOR LIST ITEMS
  const Items = function (id, name, calorie) {
    this.id = id;
    this.name = name;
    this.calorie = calorie;
  };
  // DUMMY DATA
  const data = {
    items: [
      // { id: 1, name: "Steak meat", calorie: 1200 },
      // { id: 2, name: "Cookies", calorie: 400 },
      // { id: 3, name: "Ice Cream", calorie: 600 },
    ],
    currentItem: null,
    totalCalorie: 0,
  };

  return {
    // RETURN COMPLETE DUMMY DATA
    logData: function () {
      return data;
    },
    // RETURN DATA ITEMS
    getData: function () {
      return data.items;
    },
    // ADD NEW ITEMS TO DATA.ITEMS
    addItem: function (name, calorie) {
      let id;
      // GENERATE  ID
      if (data.items.length > 0) {
        id = data.items.length + 1;
      } else {
        id = 1;
      }
      // CONVERT CALORIE STRING TO INTEGER
      calorie = parseInt(calorie);
      // INSTANTIATE NEW ITEM
      const newItem = new Items(id, name, calorie);
      // UPDATE ITEMS DATA
      data.items.push(newItem);
      return newItem;
    },
    getItemEdit : function (id) {
      let found;
      data.items.filter((item) =>{
        if (item.id == id) {
          found = item
        }
      })
      return found
    },
    setItemToEdit : function (item) {
      data.currentItem = item
      // console.log(data.currentItem)
      return data.currentItem
    },
    getTotalCalorie : function () {
      let total = 0;
      data.items.forEach(item => {
        total += item.calorie
      })
      data.totalCalorie = total;
      return data.totalCalorie;
    }
  };
})();

// MAIN APP CONTROLLER
const App = (function () {
  const loadEvents = function () {
    // GET UI SELECTORS
    const UIselectors = UIctrl.getSelectors();
    // ADD ITEM EVENT
    document
      .querySelector(UIselectors.addBtn)
      .addEventListener("click", addItemSubmit);
    // EDIT ITEM EVENT
    document.querySelector(UIselectors.listItems).addEventListener('click', editItemSubmit)
    // FETCH INPUT SELECTORS
    const inputSelectors = UIctrl.getInput();
    // FUNCTION TO GET VALUES FROM INPUT FORM
    function addItemSubmit(e) {
      if (
        inputSelectors.name.value !== "" &&
        inputSelectors.calorie.value !== ""
      ) {
        const newItem = ItemsCtlr.addItem(
          inputSelectors.name.value,
          inputSelectors.calorie.value
        );
        // ADD ADDED ITEM TO UI
        UIctrl.addItem(newItem)
        // ADD TOTAL CALORIE VALUE
        let totalCalorie = ItemsCtlr.getTotalCalorie();
        UIctrl.showTotal(totalCalorie)
        // CLEAR INPUT FIELDS
        UIctrl.clearInput()
      } else {
        alert("Please Fill the correct inputs");
      }
      e.preventDefault();
    }
    function editItemSubmit(e) {
      if (e.target.classList.contains('edit-btn')) {
        const idString = e.target.parentNode.id
        const idArr = idString.split('-')
        const id = parseInt(idArr[1])
        const itemToEdit = ItemsCtlr.getItemEdit(id)
        // console.log(itemToEdit)
        const editItem = ItemsCtlr.setItemToEdit(itemToEdit)

        UIctrl.addEditItem(editItem)
      }
      e.preventDefault()
    }
  };

  return {
    init: function () {
      // ACTIVATE EVENTLISTENERS
      UIctrl.clearEditState()
      loadEvents();
      // GET CURRENT ITEMS DATA
      const data = ItemsCtlr.getData();
      // DISPLAY ITEMS ON UI
      UIctrl.populateData(data);
      
    },
  };
})();
App.init();
