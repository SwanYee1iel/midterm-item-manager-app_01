import "./App.css";
import { useState, useRef } from "react";

// All icons are in src/assets (same folder level as App.jsx -> "./assets/..")
import deleteLogo from "./assets/delete.svg";

import stationaryLogo from "./assets/ink_pen.svg";
import kitchenwareLogo from "./assets/flat_ware.svg";
import applianceLogo from "./assets/electrical_services.svg";

function ItemManager() {
  /*
   * !!! IMPORTANT !!!
   * - You MUST use the given states and refs in your code.
   * - You MAY add additional state, refs, and variables if needed.
   */

  const [items, setItems] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  // You must use this ref for the item name input
  const itemName = useRef(null);

  // Additional state/refs
  const [category, setCategory] = useState(""); // no default category
  const [price, setPrice] = useState("");
  const nextId = useRef(1);

  const categories = [
    { value: "Stationary", label: "Stationary", icon: stationaryLogo },
    { value: "Kitchenware", label: "Kitchenware", icon: kitchenwareLogo },
    { value: "Appliance", label: "Appliance", icon: applianceLogo },
  ];

  const getCategoryIcon = (catValue) => {
    const found = categories.find((c) => c.value === catValue);
    return found ? found.icon : null;
  };

  const handleAddItem = () => {
    const name = (itemName.current?.value ?? "").trim();
    const selectedCategory = category;
    const priceNum = Number(price);

    // Validation order + exact messages
    if (!name) {
      setErrorMsg("Item name must not be empty");
      return;
    }

    const isDup = items.some(
      (it) => it.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (isDup) {
      setErrorMsg("Item must not be duplicated");
      return;
    }

    const isValidCategory = categories.some((c) => c.value === selectedCategory);
    if (!isValidCategory) {
      setErrorMsg("Please select a category");
      return;
    }

    if (price === "" || Number.isNaN(priceNum) || priceNum < 0) {
      setErrorMsg("Price must not be less than 0");
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        id: nextId.current++,
        name,
        category: selectedCategory,
        price: priceNum,
      },
    ]);

    // Clear form + error
    setErrorMsg("");
    if (itemName.current) itemName.current.value = "";
    setCategory("");
    setPrice("");
    itemName.current?.focus?.();
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setErrorMsg("");
  };

  return (
    <>
      <div id="h1">Item Management</div>

      <div id="data-area">
        <table id="item-table" className="item-table">
          <thead>
            <tr>
              <th id="col-item-id">ID</th>
              <th id="col-item-name">Name</th>
              <th id="col-item-category">Category</th>
              <th id="col-item-price">Price</th>
              <th id="col-item-action">Action</th>
            </tr>
          </thead>

          <tbody>
            {/*
             * !!! IMPORTANT !!!
             * - All items must be listed here (above the form row).
             * - Your input form must be implemented as the LAST row in this table.
             */}
            {items.map((it) => (
              <tr key={it.id}>
                <td>{it.id}</td>
                <td>{it.name}</td>
                <td>
                  {getCategoryIcon(it.category) ? (
                    <img
                      src={getCategoryIcon(it.category)}
                      alt={it.category}
                      title={it.category}
                      style={{ width: 24, height: 24, verticalAlign: "middle" }}
                    />
                  ) : (
                    it.category
                  )}
                </td>
                <td>{it.price}</td>
                <td>
                  <img
                    src={deleteLogo}
                    alt="delete"
                    title="Delete"
                    style={{ width: 20, height: 20, cursor: "pointer" }}
                    onClick={() => handleDelete(it.id)}
                  />
                </td>
              </tr>
            ))}

            {/* FORM ROW (MUST BE LAST ROW) */}
            <tr>
              <td></td>
              <td>
                <input
                  ref={itemName}
                  type="text"
                  placeholder="Item name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddItem();
                  }}
                />
              </td>
              <td>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddItem();
                  }}
                />
              </td>
              <td>
                <button type="button" onClick={handleAddItem}>
                  Add Item
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="error-message">{/* You MUST display the errorMsg state here. */}{errorMsg}</div>
    </>
  );
}

export default ItemManager;
