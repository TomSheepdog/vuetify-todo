<template>
  <div>
    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="handleClick(index)"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <dialog-edit
      v-if="dialogs.edit"
      :task="task"
      @close="dialogs.edit = false"
    />
    <dialog-due-date
      v-if="dialogs.dueDate"
      :task="task"
      @close="dialogs.dueDate = false"
    />
    <dialog-delete
      v-if="dialogs.delete"
      :task="task"
      @close="dialogs.delete = false"
    />
    <dialog-sort
      v-if="dialogs.sort"
      :task="task"
      @close="dialogs.sort = false"
    />
  </div>
</template>
<script>
export default {
  props: ["task"],
  data: () => ({
    dialogs: {
      edit: false,
      dueDate: false,
      delete: false,
      sort: false,
    },
    selectedItem: 1,
    items: [
      {
        text: "Edit",
        icon: "mdi-pencil",
        click() {
          this.dialogs.edit = true;
        },
      },
      {
        text: "Due date",
        icon: "mdi-calendar",
        click() {
          this.dialogs.dueDate = true;
        },
      },
      {
        text: "Delete",
        icon: "mdi-delete",
        click() {
          this.dialogs.delete = true;
        },
      },
      {
        text: "Sort",
        icon: "mdi-drag-horizontal-variant",
        click() {
          if (!this.$store.state.search) {
            this.$store.commit("toggleSorting");
          } else {
            this.$store.commit("showSnackbar", "Sorting while searching");
          }
        },
      },
    ],
  }),
  methods: {
    handleClick(index) {
      this.items[index].click.call(this);
    },
  },
  components: {
    "dialog-delete": require("@/components/Todo/dialogs/DialogDelete.vue")
      .default,
    "dialog-edit": require("@/components/Todo/dialogs/DialogEdit.vue").default,
    "dialog-due-date": require("@/components/Todo/dialogs/DialogDueDate.vue")
      .default,
    "dialog-sort": require("@/components/Todo/dialogs/ButtonDoneSorting.vue")
      .default,
  },
};
</script>
<style></style>
