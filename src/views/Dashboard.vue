<template>
  <v-main>
    <v-card class="mx-auto overflow-hidden" height="100vh">
      <v-app-bar color="blue" dark>
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
        <v-toolbar-title class="ma-4">Dashboard</v-toolbar-title>
        <v-row justify="end">
          <v-btn class="ma-5" color="primary" @click="logOut">Log Out</v-btn>
        </v-row>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list dense nav>
          <v-list-item-group v-model="group" active-class="text--accent-4">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$router.push({ name: 'Members' })">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Members</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <v-row class="justify-center align-center ma-10">
        <v-badge :content="accounts.totalCount" color="blue darken-1">
          Total Accounts Count
          <v-icon color="grey lighten-1"> mdi-account</v-icon>
        </v-badge>
      </v-row>
    </v-card>
  </v-main>
</template>

<script>
import gql from "graphql-tag";

const ACCOUNTS_QUERY = gql`
  query GetAccounts {
    accounts(limit: 5) {
      totalCount
    }
  }
`;
// TODO Данные необходимо запросить с сервера используя query accounts

export default {
  name: "Dashboard",

  data() {
    return {
      drawer: false,
      group: null,
      hover: false,
      accounts: {
        totalCount: 0,
      },
    };
  },

  mounted() {
    this.$apollo
        .query({
          query: ACCOUNTS_QUERY,
          variables: {
            totalCount: this.accounts.totalCount,
          },
        })
        .then((response) => {
          this.accounts.totalCount = response.data.accounts.totalCount;
          console.log(response);
        })
        .catch((error) => console.log(error));
  },

  methods: {
    logOut() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      this.$router.push({name: "SignIn"});
    },
  },
};
</script>
<style scoped></style>
