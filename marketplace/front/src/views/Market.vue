<template>
  <div class="market">
    <vue-headful title="Marketplace" />
    <br />
    <br />
    <button @click="showSearch()">PRODUCT SEARCH</button>

    <!-- FORMULARIO PARA BUSCADOR -->
    <div class="buscador" v-show="advancedSearch">
      <p>
        <b>PRODUCT NAME</b>
        <br />
        <input
          v-model="name"
          type="search"
          name="name"
          size="33"
          placeholder="Search for any product!"
        />
      </p>
      <div class="catInput">
        <p>
          <b>CATEGORY</b>
          <br />
          <br />
          <input v-model="category" type="radio" name="category" value="consoles" />Consoles
          <br />
          <input v-model="category" type="radio" name="category" value="keyboard" />Keyboard
          <br />
          <input v-model="category" type="radio" name="category" value="mices" />Mices
          <br />
        </p>
      </div>
      <p>
        <b>PRICE</b>
        <br />
        <input v-model="price" type="number" name="price" />
      </p>
      <p>
        <input type="reset" value="Borrar" />
      </p>

      <button class="search" @click="searchProducts()">SEARCH!</button>
      <!-- OBTENCION DE LOS RESULTADOS DEL SEARCH -->
      <div class="resultados">
        <ul>
          <li v-for="searchResult in searchResults" :key="searchResult.id">
            <div>
              <p>{{ searchResult.name }}</p>
              <p>{{ searchResult.category }}</p>
              <p>{{ searchResult.price }}€</p>
              <button @click="buyProduct">BUY</button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <showallproducts
      :products="products"
      :product="product"
      v-on:comprar="buyProduct"
      v-on:openModal="showPurchaseText"
    ></showallproducts>
    <div class="modal" v-show="openPurchaseBox">
      <div class="modalBox">
        <input type="text" v-model="newName" placeholder="Address" />
        <input type="text" v-model="newAddress" placeholder="Address" />
        <button @click="buyProduct()">BUY</button>
        <button @click="openPurchaseBox = false">CANCEL</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import vueHeadful from "vue-headful";
import showproducts from "@/components/ShowProducts.vue";
import showallproducts from "@/components/ShowAllProducts.vue";

export default {
  name: "Market",
  components: { showallproducts },
  data() {
    return {
      products: [],
      product: {},
      name: "",
      category: "",
      description: "",
      price: "",
      newName: "",
      newCategory: "",
      newDescription: "",
      newPrice: "",
      newAddress: "",
      correctData: false,
      openPurchaseBox: false,
      pk_id: "",
      index: "",
      search: "",
      advancedSearch: false,
      searchResults: [],
      productPicture: ""
    };
  },
  methods: {
    getProducts() {
      const self = this;
      axios
        .get("http://localhost:3000/products")
        .then(function(response) {
          console.log(response);
          self.products = response.data.data;
          self.products = response.data.data.map(product => {
            product.product_picture =
              "http://localhost:3000/uploads/" + product.product_picture;
            return product;
          });
        })
        .catch(function(error) {
          console.error(error);
        });
    },
    buyProduct() {
      this.validatePurchase();
      const self = this;
      const data = self.pk_id;
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log(self.correctData);
      if (self.correctData === true) {
        axios
          .post("http://localhost:3000/products/purchase/" + data, {
            address: self.newAddress,
            price: self.products[self.index].price
          })
          .then(function(response) {
            console.log(response);
            Swal.fire({
              icon: "success",
              title: "Product successfully purchased.",
              text:
                "You'll soon receive a confirmation email. Check your inbox!",
              timer: "5000"
            });
          })
          .catch(function(error) {
            console.error(error.response.data.message);
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Information is missing",
          timer: 3000
        });
      }
    },
    validatePurchase() {
      if (this.newAddress === "" || this.newName === "") {
        this.correctData = false;
      } else {
        this.correctData = true;
      }
    },
    showPurchaseText(index) {
      const data = this.products[index];
      this.openPurchaseBox = true;
      this.newName = data.name;
      this.pk_id = data.pk_id;
      this.index = index;
      this.newAddress = localStorage.getItem("address");
    },
    searchProducts() {
      const self = this;
      const searchProductsParams = self.makingSearchURL();
      axios
        .get(`http://localhost:3000/searching?${searchProductsParams}`)
        .then(function(response) {
          console.log(response);
          self.advancedSearch = true;
          self.searchResults = response.data.data;
        })
        .catch(function(error) {
          Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Your search produced no product matches!",
            timer: 4000
          });
        });
    },
    makingSearchURL() {
      const params = new URLSearchParams();
      if (!!this.name) {
        params.append("name", this.name);
      }
      if (!!this.category) {
        params.append("category", this.category);
      }
      if (!!this.price) {
        params.append("price", this.price);
      }
      return params;
    },
    showSearch() {
      this.advancedSearch = !this.advancedSearch;
    }
  },
  created() {
    this.getProducts();
  },
  computed: {
    filteredProducts() {
      if (!this.search) {
        return this.products;
      }
      return this.products.filter(
        product =>
          product.name.toLowerCase().includes(this.search.toLowerCase()) ||
          product.category.toLowerCase().includes(this.search.toLowerCase()) ||
          product.price.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}
.modalBox {
  background: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

ul {
  list-style: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

li {
  margin: 2rem;
  padding: 2rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  width: 40%;
  text-align: left;

  background: rgba(0, 0, 0, 0.322);
  padding-bottom: 2rem;
  border-radius: 20px;
}

.resultados li {
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
}

b {
  color: #467599;
}
</style>
