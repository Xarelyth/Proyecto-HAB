<template>
  <div class="home">
    <vue-headful title="SYNAPSE" />
    <div class="descripcion">
      <h1>WELCOME TO SYNAPSE</h1>
      <br />
      <p>Old equipment laying around in your room, gathering dust?</p>
      <p>Looking for a brand new or second hand monitor to replace your current one?</p>
      <p>SYNAPSE offers an easy solution for your technological needs.</p>
      <p>SET UP an account, LOG IN with your credentials, and sell (or buy!) products from other users.</p>
      <p>No questions asked. No intermediaries. Just one click.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import showproducts from "@/components/ShowProducts.vue";

export default {
  name: "Home",
  components: {}
};
</script>

<style scoped>
img {
  max-height: 84.9vh;
}

a {
  text-transform: uppercase;
  font-weight: bold;
  color: #467599;
}
.home {
  background-image: url("../assets/home-background2.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  height: 900px;
  max-width: 100vw;
  max-height: 81.7vh;
  margin-top: 0rem;
}

.descripcion {
  position: absolute;
  text-align: left;
  font-size: 15px;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 350px;
  margin-top: -200px;
  margin-left: -250px;
  font-weight: bold;
  background: #020103;
  opacity: 90%;
  padding: 3rem;
  border: 3px solid black;
  border-radius: 20px;
  box-shadow: 0px 8px 6px -6px rgba(78, 73, 98, 0.548);
}

h1 {
  text-align: center;
  color: whitesmoke;
  border-bottom: 2px solid #467599;
  margin-bottom: 1rem;
}
</style>


