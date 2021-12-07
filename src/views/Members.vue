<template>
  <v-main>
    <v-card class="mx-auto overflow-hidden" height="100vh">
      <v-app-bar color="blue" dark>
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
        <v-toolbar-title class="ma-4">Members</v-toolbar-title>
        <v-row justify="end">
          <v-btn class="ma-5" color="primary" @click="logOut">Log Out</v-btn>
        </v-row>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list dense nav>
          <v-list-item-group v-model="group" active-class="text--accent-4">
            <v-list-item @click="$router.push({ name: 'Dashboard' })">
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Members</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <v-data-table :headers="headers" :items="list" class="elevation-1">
      </v-data-table>
    </v-card>
  </v-main>
</template>

<script>
import dayjs from "dayjs";
import gql from "graphql-tag";

const ACCOUNTS_QUERY = gql`
  query GetUsers {
    accounts(where: { login_contains: "" }, limit: 20, orderBy: login_DESC) {
      list {
        login
        createdAt
      }
    }
  }
`;
// TODO разобраться с запросом к бд для получения аккаунтов используйте login_contains в параметр AccountWhereInput

export default {
  name: "Members",

  data() {
    return {
      drawer: false,
      group: null,

      headers: [
        {text: "Email", value: "login"},
        {text: "Created At", value: "createdAt"},
      ],

      list: [
        {
          login: "",
          createdAt: dayjs().format("DD-MM-YYYY HH:mm:ss"),
        },
      ],
    };
  },

  mounted() {
    this.$apollo
        .query({
          query: ACCOUNTS_QUERY,
          variables: {
            list: {
              login: this.list.login,
              createdAt: this.list.createdAt,
            },
          },
        })
        .then((response) => {
          this.list = response.data.accounts.list;
          console.log(this.list);
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
