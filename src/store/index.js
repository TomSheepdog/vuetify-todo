import Vue from "vue";
import Vuex from "vuex";
import Localbase from "localbase";

let db = new Localbase("db");
db.config.debug = false;

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appTitle: process.env.VUE_APP_TITLE,
    search: null,
    tasks: [
      // {
      //   id: 1,
      //   title: "kupic truskawki",
      //   done: false,
      //   dueDate: "2023-06-23",
      // },
      // {
      //   id: 2,
      //   title: "kupic warzywa",
      //   done: false,
      //   dueDate: "2023-06-24",
      // },
      // {
      //   id: 3,
      //   title: "kupic cos slodkiego",
      //   done: false,
      //   dueDate: null,
      // },
    ],
    snackbar: {
      show: false,
      text: "",
    },
    sorting: false,
  },
  getters: {
    tasksFiltered(state) {
      if (!state.search) {
        return state.tasks;
      }
      return state.tasks.filter((task) =>
        task.title.toLowerCase().includes(state.search.toLowerCase())
      );
    },
  },
  mutations: {
    setSearch(state, value) {
      state.search = value;
    },

    addNewTask(state, newTask) {
      state.tasks.unshift(newTask);
    },
    doneTask(state, id) {
      const taskIndex = state.tasks.filter((task) => task.id === id)[0];
      taskIndex.done = !taskIndex.done;
    },

    deleteTask(state, id) {
      state.tasks = state.tasks.filter((task) => task.id !== id);
    },
    updateTaskTitle(state, payload) {
      let task = state.tasks.filter((task) => task.id === payload.id)[0];
      task.title = payload.title;
    },
    updateTaskDueDate(state, payload) {
      let task = state.tasks.filter((task) => task.id === payload.id)[0];
      task.dueDate = payload.dueDate;
    },
    setTasks(state, tasks) {
      state.tasks = tasks;
    },
    showSnackbar(state, text) {
      state.snackbar.show = true;
      state.snackbar.text = text;
    },
    hideSnackbar(state) {
      state.snackbar.show = false;
    },
    toggleSorting(state) {
      state.sorting = !state.sorting;
    },
  },
  actions: {
    addTask({ commit }, newTaskTitle) {
      const newTask = {
        id: Date.now(),
        title: newTaskTitle,
        done: false,
        dueDate: null,
      };
      db.collection("tasks")
        .add(newTask)
        .then(() => {
          commit("addNewTask", newTask);
          commit("showSnackbar", "Task Added!");
        });
    },
    doneTask({ state, commit }, id) {
      let task = state.tasks.filter((task) => task.id === id)[0];
      db.collection("tasks")
        .doc({ id: id })
        .update({
          done: !task.done,
        })
        .then(() => {
          commit("doneTask", id);
        });
    },
    deleteTask({ commit }, id) {
      db.collection("tasks")
        .doc({ id: id })
        .delete()
        .then(() => {
          commit("deleteTask", id);
          commit("showSnackbar", "Task deleted!");
        });
    },
    updateTaskTitle({ commit }, payload) {
      db.collection("tasks")
        .doc({ id: payload.id })
        .update({
          title: payload.title,
        })
        .then(() => {
          commit("updateTaskTitle", payload);
          commit("showSnackbar", "Task updated!");
        });
    },
    updateTaskDueDate({ commit }, payload) {
      db.collection("tasks")
        .doc({ id: payload.id })
        .update({
          dueDate: payload.dueDate,
        })
        .then(() => {
          commit("updateTaskDueDate", payload);
          commit("showSnackbar", "Due Date updated!");
        });
    },
    setTasks({ commit }, tasks) {
      db.collection("tasks").set(tasks);
      commit("setTasks", tasks);
    },
    getTasks({ commit }) {
      db.collection("tasks")
        .get()
        .then((tasks) => {
          commit("setTasks", tasks);
        });
    },
  },
});
