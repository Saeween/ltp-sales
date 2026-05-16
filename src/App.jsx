import { useState, useEffect } from "react"

function App() {

  const [categories, setCategories] = useState(() => {

    const saved = localStorage.getItem("categories")

    return saved
      ? JSON.parse(saved)
      : ["UZBAT", "ESSE", "Winston"]
  })

  const [products, setProducts] = useState(() => {

    const saved = localStorage.getItem("products")

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            category: "UZBAT",
            name: "KENT mix",
            price: 20000,
            qty: ""
          },

          {
            id: 2,
            category: "UZBAT",
            name: "kent 6",
            price: 19500,
            qty: ""
          },

          {
            id: 3,
            category: "ESSE",
            name: "Esse Blue",
            price: 18000,
            qty: ""
          },
        ]
  })

  const [selectedCategory, setSelectedCategory] =
    useState("UZBAT")

  const [showAdmin, setShowAdmin] =
    useState(false)

  const [newCategory, setNewCategory] =
    useState("")

  const [newProductName, setNewProductName] =
    useState("")

  const [newProductPrice, setNewProductPrice] =
    useState("")

  const [newProductCategory, setNewProductCategory] =
    useState("UZBAT")

  const [manageCategory, setManageCategory] =
    useState("UZBAT")

  const [searchManage, setSearchManage] =
    useState("")
  const [searchProduct, setSearchProduct] =
  useState("")
  useEffect(() => {

    localStorage.setItem(
      "categories",
      JSON.stringify(categories)
    )

  }, [categories])
const [salesHistory, setSalesHistory] =
  useState(() => {

    const saved =
      localStorage.getItem("salesHistory")

    return saved
      ? JSON.parse(saved)
      : []
  })
  useEffect(() => {

    localStorage.setItem(
      "products",
      JSON.stringify(products)
    )

  }, [products])

  useEffect(() => {

  localStorage.setItem(
    "salesHistory",
    JSON.stringify(salesHistory)
  )

}, [salesHistory])

  const totalPacks = products.reduce(
    (sum, p) => sum + (Number(p.qty) || 0),
    0
  )

  const totalPrice = products.reduce(
    (sum, p) =>
      sum + ((Number(p.qty) || 0) * p.price),
    0
  )

  const addCategory = () => {

    if (!newCategory) return

    setCategories([
      ...categories,
      newCategory
    ])

    setNewCategory("")
  }

  const addProduct = () => {

    if (
      !newProductName ||
      !newProductPrice
    ) return

    const newProduct = {
      id: Date.now(),
      category: newProductCategory,
      name: newProductName,
      price: Number(newProductPrice),
      qty: ""
    }

    setProducts([
      ...products,
      newProduct
    ])

    setNewProductName("")
    setNewProductPrice("")
  }

  const sellProducts = async () => {

    const soldProducts = products.filter(
      p => Number(p.qty) > 0
    )

    if (soldProducts.length === 0) {
      alert("Нет выбранных товаров")
      return
    }

    let receipt = "LTP GROUP\n"

    receipt += "------------------\n"

    soldProducts.forEach(product => {

      const qty = Number(product.qty)

      const lineTotal = qty * product.price

      receipt +=
        `${product.name} x${qty} = ${lineTotal}\n`
    })

    receipt += "------------------\n"

    receipt += `Пачек: ${totalPacks}\n`

    receipt += `Сумма: ${totalPrice}\n`

    receipt += "------------------\n"

    receipt += new Date().toLocaleString()

    try {
    const newSale = {

  id: Date.now(),

  items: soldProducts,

  totalPacks,

  totalPrice,

  date:
    new Date().toLocaleString()
}

setSalesHistory(prev => [
  newSale,
  ...prev
])
      await navigator.clipboard.writeText(
        receipt
      )

      alert("Чек скопирован в буфер обмена")

    }

    catch {

      alert("Не удалось скопировать чек")

    }

    const cleared = products.map(p => ({
      ...p,
      qty: ""
    }))

    setProducts(cleared)
  }

  return (

    <div style={styles.container}>

      <div style={styles.sidebar}>

        <button
          style={styles.adminButton}
          onClick={() => setShowAdmin(!showAdmin)}
        >
          ⚙
        </button>

        {categories.map(cat => (

          <button
            key={cat}

            style={{
              ...styles.categoryButton,

              background:
                selectedCategory === cat
                  ? "#2f80ed"
                  : "#1f2937"
            }}

            onClick={() =>
              setSelectedCategory(cat)
            }
          >
            {cat}
          </button>

        ))}

      </div>

      <div style={styles.main}>

        <div style={styles.products}>
        <input

  style={styles.searchInput}

  placeholder="🔍 Поиск товара"

  value={searchProduct}

  onChange={(e) =>
    setSearchProduct(e.target.value)
  }
/>
          {products

  .filter(p => {

    const matchesCategory =
      p.category === selectedCategory

    const matchesSearch =
      p.name
        .toLowerCase()
        .includes(
          searchProduct.toLowerCase()
        )

    if (searchProduct.length > 0) {
      return matchesSearch
    }

    return matchesCategory
  })



            .map(product => (

              <div
                key={product.id}
                style={styles.productRow}
              >

                <div style={styles.productInfo}>

                  <div style={styles.productName}>
                    {product.name}
                  </div>

                  <div style={styles.productPrice}>
                    {product.price}
                  </div>

                </div>

                <div style={styles.qtyArea}>

                  <input
                    type="number"
                    inputMode="numeric"
                    style={styles.qtyInput}
                    value={product.qty}

                    onChange={(e) => {

                      const updated = [...products]

                      const target = updated.find(
                        p => p.id === product.id
                      )

                      target.qty = e.target.value

                      setProducts(updated)
                    }}
                  />

                  <button
                    style={styles.clearButton}

                    onClick={() => {

                      const updated = [...products]

                      const target = updated.find(
                        p => p.id === product.id
                      )

                      target.qty = ""

                      setProducts(updated)
                    }}
                  >
                    ✕
                  </button>

                </div>

              </div>

            ))}
                    </div>

        <div style={styles.bottomBar}>

          <div style={styles.totalCard}>
            <div>Пачек</div>
            <strong>{totalPacks}</strong>
          </div>

          <div style={styles.totalCard}>
            <div>Сумма</div>
            <strong>{totalPrice}</strong>
          </div>

        </div>

        <button
          style={styles.sellButton}
          onClick={sellProducts}
        >
          ПРОДАТЬ
        </button>

      </div>

      {showAdmin && (

        <div style={styles.adminPanel}>

          <h2>ADMIN</h2>
        <div style={styles.adminSection}>

  <h3>История продаж</h3>

  <button

    style={styles.clearHistoryButton}

    onClick={() => {

      const confirmClear =
        window.confirm(
          "Очистить историю?"
        )

      if (!confirmClear) return

      setSalesHistory([])
    }}
  >
    Очистить историю
  </button>

  {salesHistory.map(sale => (

    <div
      key={sale.id}
      style={styles.historyCard}
    >

      <div style={styles.historyDate}>
        {sale.date}
      </div>

      {sale.items.map(item => (

        <div key={item.id}>

          {item.name}
          {" x"}
          {item.qty}

        </div>

      ))}

      <div style={styles.historyTotal}>

        {sale.totalPrice}

      </div>

    </div>

  ))}

</div>
          <div style={styles.adminSection}>

            <input
              style={styles.input}
              placeholder="Категория"
              value={newCategory}

              onChange={(e) =>
                setNewCategory(e.target.value)
              }
            />

            <button
              style={styles.addButton}
              onClick={addCategory}
            >
              Добавить категорию
            </button>

          </div>

          <div style={styles.adminSection}>

            <input
              style={styles.input}
              placeholder="Название"
              value={newProductName}

              onChange={(e) =>
                setNewProductName(e.target.value)
              }
            />

            <input
              style={styles.input}
              placeholder="Цена"
              value={newProductPrice}

              onChange={(e) =>
                setNewProductPrice(e.target.value)
              }
            />

            <select
              style={styles.input}
              value={newProductCategory}

              onChange={(e) =>
                setNewProductCategory(
                  e.target.value
                )
              }
            >

              {categories.map(cat => (

                <option key={cat}>
                  {cat}
                </option>

              ))}

            </select>

            <button
              style={styles.addButton}
              onClick={addProduct}
            >
              Добавить товар
            </button>

          </div>

          <div style={styles.adminSection}>

            <select
              style={styles.input}
              value={manageCategory}

              onChange={(e) =>
                setManageCategory(
                  e.target.value
                )
              }
            >

              {categories.map(cat => (

                <option key={cat}>
                  {cat}
                </option>

              ))}

            </select>

            <input
              style={styles.input}
              placeholder="Поиск"
              value={searchManage}

              onChange={(e) =>
                setSearchManage(
                  e.target.value
                )
              }
            />

            {products

              .filter(
                p => p.category === manageCategory
              )

              .filter(
                p =>
                  p.name
                    .toLowerCase()
                    .includes(
                      searchManage.toLowerCase()
                    )
              )

              .map(product => (

                <div
                  key={product.id}
                  style={styles.manageRow}
                >

                  <button

                    style={styles.deleteButton}

                    onClick={() => {

                      const confirmDelete =
                        window.confirm(
                          `Удалить ${product.name}?`
                        )

                      if (!confirmDelete) return

                      const filtered =
                        products.filter(
                          p => p.id !== product.id
                        )

                      setProducts(filtered)
                    }}
                  >
                    ✕
                  </button>

                  <div style={styles.manageName}>
                    {product.name}
                  </div>

                  <input

                    style={styles.priceInputAdmin}

                    value={product.price}

                    onChange={(e) => {

                      const updated = [...products]

                      const target = updated.find(
                        p => p.id === product.id
                      )

                      target.price = e.target.value

                      setProducts(updated)
                    }}
                  />

                </div>

              ))}

          </div>

        </div>

      )}

    </div>

  )
}

const styles = {
    container: {
    display: "flex",
    height: "100vh",
    background: "#111827",
    color: "white",
    overflow: "hidden",
    fontFamily: "Arial",
  },

  sidebar: {
    width: "90px",
    background: "#1f2937",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px",
    overflowY: "auto",
  },

  adminButton: {
    height: "50px",
    border: "none",
    borderRadius: "12px",
    background: "#f59e0b",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
  },

  categoryButton: {
    minHeight: "50px",
    border: "none",
    borderRadius: "12px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    padding: "10px",
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "10px",
    gap: "10px",
  },

  products: {
   searchInput: {
   height: "50px",
   borderRadius: "14px",
   border: "none",
   paddingLeft: "16px",
   background: "#1f2937",
   color: "white",
   fontSize: "16px",
},
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  productRow: {
    background: "#1f2937",
    borderRadius: "16px",
    padding: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: "16px",
    fontWeight: "bold",
  },

  productPrice: {
    color: "#9ca3af",
    marginTop: "4px",
  },

  qtyArea: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },

  qtyInput: {
    width: "70px",
    height: "45px",
    borderRadius: "12px",
    border: "none",
    textAlign: "center",
    fontSize: "18px",
    background: "#374151",
    color: "white",
  },

  clearButton: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontSize: "18px",
  },

  bottomBar: {
    display: "flex",
    gap: "10px",
  },

  totalCard: {
    flex: 1,
    background: "#1f2937",
    borderRadius: "16px",
    padding: "14px",
    textAlign: "center",
  },

  sellButton: {
    height: "70px",
    border: "none",
    borderRadius: "18px",
    background: "#22c55e",
    color: "white",
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  adminPanel: {
    width: "320px",
    background: "#111827",
    borderLeft: "1px solid #374151",
    padding: "20px",
    overflowY: "auto",
  },

  adminSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "30px",
  },

  input: {
    height: "45px",
    borderRadius: "12px",
    border: "none",
    paddingLeft: "12px",
    background: "#1f2937",
    color: "white",
    fontSize: "16px",
  },

  addButton: {
    height: "50px",
    border: "none",
    borderRadius: "12px",
    background: "#2563eb",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  manageRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#1f2937",
    borderRadius: "12px",
    padding: "10px",
  },

  manageName: {
    flex: 1,
  },

  priceInputAdmin: {
    width: "90px",
    height: "40px",
    borderRadius: "10px",
    border: "none",
    textAlign: "center",
    background: "#374151",
    color: "white",
  },

  deleteButton: {
    historyCard: {
  background: "#1f2937",
  borderRadius: "12px",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
},

historyDate: {
  color: "#9ca3af",
  fontSize: "12px",
},

historyTotal: {
  marginTop: "8px",
  fontWeight: "bold",
  color: "#22c55e",
},

clearHistoryButton: {
  height: "45px",
  border: "none",
  borderRadius: "12px",
  background: "#ef4444",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
},
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },

}

export default App