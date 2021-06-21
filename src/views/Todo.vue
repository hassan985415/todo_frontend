<template>
  <div class="home">
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar">
        {{ snackbarText }}

        <template v-slot:action="{ attrs }">
          <v-btn color="green" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
    <v-card-title>
      Todo Dashboard
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="todos"
      :search="search"
      sort-by="created_at"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Todo CRUD</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.task"
                        label="Task Title"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.description"
                        label="Description"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout.vue";

Vue.use(axios);

export default {
  name: "Todo",
  created() {
    this.$emit("update:layout", DashboardLayout);
  },
  mounted() {
    axios.get("http://127.0.0.1:8000/api/todo").then((response) => {
      this.todos = response.data.data;
    });
  },
  data() {
    return {
      search: "",
      headers: [
        { text: "Title", value: "task", align: "start" },
        { text: "Description", value: "description" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        task: "",
        description: "",
      },
      defaultItem: {
        task: "",
        description: "",
      },
      taskId: "",
      todos: [],
      snackbar: false,
      snackbarText: "",
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    editItem(item) {
      console.log(item.id);
      this.taskId = item.id;
      this.editedIndex = this.todos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.todos.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
      this.taskId = item.id;
    },

    deleteItemConfirm() {
      this.todos.splice(this.editedIndex, 1);

      axios
        .delete(
          "http://127.0.0.1:8000/api/todo/" + this.taskId,
          this.editedItem
        )
        .then((response) => {
          this.snackbar = true;
          this.snackbarText = "Task Deleted Successfully";
          this.closeDelete();
        });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.todos[this.editedIndex], this.editedItem);

        axios
          .put("http://127.0.0.1:8000/api/todo/" + this.taskId, this.editedItem)
          .then((response) => {
            this.snackbar = true;
            this.snackbarText = "Task Edited Successfully";
          });
      } else {
        this.todos.push(this.editedItem);

        axios
          .post("http://127.0.0.1:8000/api/todo", this.editedItem)
          .then((response) => {
            this.snackbar = true;
            this.snackbarText = "Task Added Successfully";
          });
      }
      this.close();
    },
  },
};
</script>
