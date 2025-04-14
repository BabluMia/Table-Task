<template>
  <div class="p-4 w-full max-w-6xl mx-auto mt-10 mb-6 shadow-sm rounded-md">
    <h2 class="font-semibold text-gray-700 mb-4">{{ $t("about.title2") }}</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Kad Pengenalan -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> {{ $t("about.id") }}</label>
        <DxTextBox :value="id" @valueChanged="(e) => (id = e.value)" class="w-full" />
      </div>

      <!-- Nama -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"> {{ $t("about.name") }} </label>
        <DxTextBox :value="name" @valueChanged="(e) => (name = e.value)" class="w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t("about.Record_Display") }}
        </label>
        <DxSelectBox
          :items="displayOptions"
          :value="selectedDisplay"
          @valueChanged="(e) => (selectedDisplay = e.value)"
          class="w-40"
        />
      </div>
    </div>

    <div class="flex flex-col md:flex-row md:items-end md:justify-between mt-6 gap-4">
      <!-- Search Button -->
      <div class="self-start md:self-end">
        <DxButton text="Search" type="default" @click="handleSearch" />
        <DxButton text="Reset" class="ms-2" type="default" @click="handleReset" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DxTextBox from "devextreme-vue/text-box";
import DxSelectBox from "devextreme-vue/select-box";
import DxButton from "devextreme-vue/button";
import { useEmployeeStore } from "../../stores/employee"; // Importing the Pinia store

// Instantiate the store
const employeeStore = useEmployeeStore();
const { filterData, resetEmployees } = employeeStore; // Destructure the methods from the store

// Reactive state for inputs
const id = ref("");
const name = ref("");
const selectedDisplay = ref("Daily");
const displayOptions = ["Daily", "Weekly", "Monthly"];

// Method to handle the search button click
const handleSearch = () => {
  filterData(name.value, id.value);
};

const handleReset = () => {
  id.value = "";
  name.value = "";
  selectedDisplay.value = "Daily";
  resetEmployees();
};
</script>
