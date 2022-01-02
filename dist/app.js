// STORAGE
// const StorageCtrl = (function () {
//   return {
//     storeData: (data) => {
//       let item;
//       if (localStorage.getItem("items") === null) {
//         item = [];
//         item.push(data);
//         localStorage.setItem("items", JSON.stringify(item));
//       } else {
//         item = JSON.parse(localStorage.getItem("items"));
//         item.push(data);
//         localStorage.setItem("items", JSON.stringify(item));
//       }
//     },
//     getItemFromStorage: () => {
//       let item;
//       if (localStorage.getItem("items") === null) {
//         item = [];
//       } else {
//         item = JSON.parse(localStorage.getItem("items"));
//       }
//       return item;
//     },
//     // updateItemToStorage : (updatedItem) => {
//     //   let item = JSON.parse(localStorage.getItem('items'))
//     //   item.forEach((item, index) => {
//     //     if (updateItem.id == item.id) {
//     //       item.splice(index, 1, updatedItem)

//     //     }
//     //   })
//     //   localStorage.setItem('items', JSON.stringify(item))
//     // },
//     // deleteItemFromStorage : (id) => {
//     //   let item = JSON.parse(localStorage.getItem('items'))
//     //   item.forEach((item, index) => {
//     //     if (id == item.id) {
//     //       item.splice(index, 1)
//     //     }
//     //   })
//     //   localStorage.setItem('items', JSON.stringify(item))
//     // }
  // };
// })();

// POPULATE UI FUNCTION
const UIctrl = (function () {
  // SELECTOR FOR UI VALUES
  const UIselectors = {
    listItems: "#list-collection",
    listItemsTags: "#list-collection li",
    addBtn: "#add-btn",
    calorieInput: "#calorie",
    nameInput: "#meal",
    totalCalorie: ".total",
    backBtn: "#back-btn",
    deleteBtn: "#delete-btn",
    updateBtn: "#update-btn",
    clearBtn: "#clear-btn",
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
    addItem: function (item) {
      const li = document.createElement("li");
      li.className =
        "border-0 border-b-2 border-gray-300 py-2 text-1xl items-center flex justify-between";
      li.id = `item-${item.id}`;
      li.innerHTML = `
      <strong>${item.name} : <em>${item.calorie} Calorie</em></strong>
      <button class="px-2 text-xl py-1 rounded hover:opacity-80 edit-btn  text-white bg-gray-700" id="edit">&Leftrightarrow; Edit</button>
      `;
      document
        .querySelector(UIselectors.listItems)
        .insertAdjacentElement("beforeend", li);
    },
    updateList: function (item) {
      let list = document.querySelectorAll(UIselectors.listItemsTags);
      list = Array.from(list);
      // console.log(item.id)
      list.forEach((itemz) => {
        const itemID = itemz.getAttribute("id");
        if (itemID == `item-${item.id}`) {
          // console.log(itemz)
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name} : <em>${item.calorie} Calorie</em></strong>
          <button class="px-2 text-xl py-1 rounded hover:opacity-80 edit-btn text-white bg-gray-700" id="edit">&Leftrightarrow; Edit</button>
          `;
        }
      });
    },
    showTotal: function (item) {
      document.querySelector(UIselectors.totalCalorie).textContent = item;
    },
    clearInput: function () {
      document.querySelector(UIselectors.nameInput).value = "";
      document.querySelector(UIselectors.calorieInput).value = "";
    },
    addEditItem: function () {
      document.querySelector(UIselectors.nameInput).value = ItemsCtlr.getCurrentItem().name;
      document.querySelector(UIselectors.calorieInput).value = ItemsCtlr.getCurrentItem().calorie;
      UIctrl.showEditState();
    },
    removeItem: function (id) {
      const Id = `#item-${id}`;
      const item = document.querySelector(Id);
      item.remove();
    },
    clearItems: function () {
      let list = document.querySelectorAll(UIselectors.listItemsTags);
      list = Array.from(list);
      list.forEach((item) => item.remove());
    },
    clearEditState: function () {
      UIctrl.clearInput()
      document.querySelector(UIselectors.addBtn).style.display = "block";
      document.querySelector(UIselectors.deleteBtn).style.display = "none";
      document.querySelector(UIselectors.backBtn).style.display = "none";
      document.querySelector(UIselectors.updateBtn).style.display = "none";
    },
    showEditState: function () {
      document.querySelector(UIselectors.addBtn).style.display = "none";
      document.querySelector(UIselectors.deleteBtn).style.display = "block";
      document.querySelector(UIselectors.backBtn).style.display = "block";
      document.querySelector(UIselectors.updateBtn).style.display = "block";
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
  const data = {
    // DUMMY DATA
   items: [
    //   // { id: 1, name: "Steak meat", calorie: 1200 },
    //   // { id: 2, name: "Cookies", calorie: 400 },
    //   // { id: 3, name: "Ice Cream", calorie: 600 },
    ],
    // items: StorageCtrl.getItemFromStorage(),
    currentItem: null,
    totalCalorie: 0,
  };

  return {
    // RETURN COMPLETE DATA
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
    getItemEdit: function (id) {
      let found;
      data.items.filter((item) => {
        if (item.id == id) {
          found = item;
        }
      });
      return found;
    },
    setItemToEdit: function (item) {
      data.currentItem = item;
      // console.log(data.currentItem)
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    updateItemList: function (name, calorie) {
      calorie = parseInt(calorie);
      let found = null;
      data.items.forEach((item) => {
        if (item.id == data.currentItem.id) {
          item.name = name;
          item.calorie = calorie;
          found = item;
        }
      });
      return found;
    },
    deleteCurrentItem: function (id) {
      const itemId = data.items.map((item) => item.id);
      // console.log(itemId)
      const index = itemId.indexOf(id);
      data.items.splice(index, 1);
    },
    clearAllData: function () {
      data.items = [];
    },
    getTotalCalorie: function () {
      let total = 0;
      data.items.forEach((item) => {
        total += item.calorie;
      });
      data.totalCalorie = total;
      return data.totalCalorie;
    },
  };
})();

// MAIN APP CONTROLLER
const App = (function (ItemsCtlr, UIctrl) {
  const loadEvents = function () {
    // GET UI SELECTORS
    const UIselectors = UIctrl.getSelectors();
    // DISABLE ENTER KEY SENDING
    document.addEventListener("keypress", (e) => {
      if (e.keyCode == 13 || e.which == 13) {
        e.preventDefault();
        return false;
      }
    });
    // ADD ITEM EVENT
    document
      .querySelector(UIselectors.addBtn)
      .addEventListener("click", addItemSubmit);

    // EDIT ITEM EVENT
    document
      .querySelector(UIselectors.listItems)
      .addEventListener("click", editItemSubmit);
    // UPDATE EDITED ITEM EVENT
    document
      .querySelector(UIselectors.updateBtn)
      .addEventListener("click", updateEditItem);
    // BACK BTN CLEAR
    document
      .querySelector(UIselectors.backBtn)
      .addEventListener("click", (e)=>{
        UIctrl.clearEditState()
        e.preventDefault()
      });
    // CLEAR ITEM DATA AND UI
    document
      .querySelector(UIselectors.clearBtn)
      .addEventListener("click", clearDataSubmit);
    // DELETE HIGHLIGHTED ITEM EVENT
    document
      .querySelector(UIselectors.deleteBtn)
      .addEventListener("click", deleteItemSubmit);
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
        UIctrl.addItem(newItem);
        // ADD TOTAL CALORIE VALUE
        let totalCalorie = ItemsCtlr.getTotalCalorie();
        UIctrl.showTotal(totalCalorie);
        // StorageCtrl.storeData(newItem);
        // CLEAR INPUT FIELDS
        UIctrl.clearInput();
      } else {
        alert("Please Fill the correct inputs");
      }
      e.preventDefault();
    }

    function editItemSubmit(e) {
      if (e.target.classList.contains("edit-btn")) {

        const idString = e.target.parentNode.id;
        const idArr = idString.split("-");
        const id = parseInt(idArr[1]);
        const itemToEdit = ItemsCtlr.getItemEdit(id);
        // console.log(itemToEdit)
        // StorageCtrl.getItemFromStorage()
        ItemsCtlr.setItemToEdit(itemToEdit);

        UIctrl.addEditItem();

      }
      e.preventDefault();
    }

    function updateEditItem(e) {
      const inputs = UIctrl.getInput();

      const updateItem = ItemsCtlr.updateItemList(
        inputs.name.value,
        inputs.calorie.value
      );
      // console.log(updateItem)
      UIctrl.updateList(updateItem);

      let totalCalorie = ItemsCtlr.getTotalCalorie();
      UIctrl.showTotal(totalCalorie);

      // StorageCtrl.updateItemToStorage(updateItem)
      UIctrl.clearEditState();
      e.preventDefault();
    }

    function deleteItemSubmit(e) {
      const currentItem = ItemsCtlr.getCurrentItem();
      // DELETE FROM ITEM DATA
      ItemsCtlr.deleteCurrentItem(currentItem.id);
      UIctrl.removeItem(currentItem.id);

      let totalCalorie = ItemsCtlr.getTotalCalorie();
      UIctrl.showTotal(totalCalorie);
      // StorageCtrl.deleteItemFromStorage(currentItem.id)
      UIctrl.clearEditState();
      // DELETE FROM UI

      e.preventDefault();
    }
    function clearDataSubmit(e) {
      // console.log('abc')
      // CLEAR ALL DATA FROM ITEMS
      ItemsCtlr.clearAllData();
      // CLEAR FROM UI
      let totalCalorie = ItemsCtlr.getTotalCalorie();
      UIctrl.showTotal(totalCalorie);
      UIctrl.clearItems();

      e.preventDefault();
    }
  };

  return {
    init: function () {
      // ACTIVATE EVENTLISTENERS
      UIctrl.clearEditState();
      // GET CURRENT ITEMS DATA
      const data = ItemsCtlr.getData();
      // GET TOTAL CALORIES
      UIctrl.populateData(data);
      
      let totalCalorie = ItemsCtlr.getTotalCalorie();
      UIctrl.showTotal(totalCalorie);
      // DISPLAY ITEMS ON UI
      loadEvents();
    },
  };
})(ItemsCtlr, UIctrl);
App.init();
