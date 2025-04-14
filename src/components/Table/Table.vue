<template>
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-2xl font-bold text-gray-800">{{ $t("about.title1") }}</h2>

    <button
      class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
      @click="openAddPopup"
    >
      {{ $t("about.title3") }}
    </button>
  </div>

  <DxDataGrid
    id="employees"
    :data-source="filteredEmployees"
    :show-borders="false"
    :column-auto-width="true"
    :word-wrap-enabled="true"
    key-expr="id"
    class="rounded-lg overflow-hidden shadow-lg w-full"
  >
    <DxSearchPanel :visible="true" :width="300" placeholder="Search records..." />
    <DxHeaderFilter :visible="true" />
    <DxSelection mode="multiple" />
    <DxScrolling mode="standard" />
    <DxPaging :enabled="true" :page-size="10" />
    <DxPager
      :show-page-size-selector="true"
      :allowed-page-sizes="[5, 10, 20]"
      :show-info="true"
      :visible="true"
      position="bottom"
    />
    <DxColumn type="selection" style="border: 2px solid green" :width="40" />

    <DxColumn data-field="employee_name" :caption="$t('add.name')" :width="180" />
    <DxColumn data-field="identification_number" :caption="$t('add.id')" :width="120" />
    <DxColumn data-field="date_time_get_to_work" :caption="$t('add.gtw')" :width="160" />
    <DxColumn data-field="date_time_out_of_office" :caption="$t('add.lo')" :width="160" />
    <DxColumn data-field="date_time_reenter_office" :caption="$t('add.reent')" :width="160" />
    <DxColumn data-field="date_time_back_to_work" :caption="$t('add.bctw')" :width="160" />
    <DxColumn
      data-field="status_presence"
      caption="Status"
      :width="120"
      cellTemplate="statusTemplate"
    />

    <DxColumn caption="Actions" :width="120" cellTemplate="actionsTemplate" />

    <template #statusTemplate="{ data }">
      <div>
        {{ data.value }}
      </div>
    </template>

    <template #actionsTemplate="{ data }">
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1 rounded-md transition-colors duration-200"
          @click="openEditPopup(data.data)"
          title="Edit Record"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="#000000"
            viewBox="0 0 256 256"
          >
            <path
              d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM51.31,160,136,75.31,152.69,92,68,176.68ZM48,179.31,76.69,208H48Zm48,25.38L79.31,188,164,103.31,180.69,120Zm96-96L147.31,64l24-24L216,84.68Z"
            />
          </svg>
        </button>
      </div>
    </template>
  </DxDataGrid>

  <!-- Modal -->
  <AttendanceModal
    :visible="popupVisible"
    :initialFormData="formData"
    :type="formType"
    @close="popupVisible = false"
    @save="handleSaveFromModal"
  />

  <!-- Confirmation Dialog -->
  <!-- <DxPopup
    :visible="confirmDialogVisible"
    :show-title="true"
    title="Confirm Delete"
    :hide-on-outside-click="true"
    :show-close-button="true"
    :width="400"
    height="auto"
    @hiding="confirmDialogVisible = false"
  >
    <p class="p-6">Are you sure you want to delete this record?</p>
    <div class="px-6 pb-6 flex justify-end gap-3">
      <DxButton
        text="Cancel"
        @click="confirmDialogVisible = false"
        type="normal"
        stylingMode="outlined"
      />
      <DxButton text="Delete" @click="confirmDelete" type="danger" stylingMode="contained" />
    </div>
  </DxPopup> -->
</template>

<script setup lang="ts">
import {
  DxColumn,
  DxDataGrid,
  DxHeaderFilter,
  DxPager,
  DxPaging,
  DxScrolling,
  DxSearchPanel,
  DxSelection,
} from "devextreme-vue/data-grid";

import { useEmployeeStore } from "../../stores/employee"; // Importing the Pinia store
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import AttendanceModal from "./Modal.vue";
import type { Employee } from "../../stores/employee"; // Import Employee interface as a type-only import

// Define interfaces to match with Modal.vue
interface SavePayload {
  id?: number;
  identification_number: string;
  employee_name: string;
  date_time_get_to_work: string;
  date_time_out_of_office: string;
  date_time_reenter_office: string;
  date_time_back_to_work: string;
  status_presence: string;
  type_noncompliance: string;
}

const employeeStore = useEmployeeStore();
const { filteredEmployees } = storeToRefs(employeeStore);

onMounted(() => {
  employeeStore.loadEmployees();
});

// Modal control
const popupVisible = ref(false);
const formData = ref({});
const formType = ref("add");

function openAddPopup() {
  formData.value = {}; // Empty object for new record
  formType.value = "add";
  popupVisible.value = true;
}

function openEditPopup(employee: Employee) {
  formData.value = {
    id: employee.id,
    reasonType: getReasonTypeFromNoncompliance(employee.type_noncompliance),
    reason: employee.employee_name,
    newStartDate: new Date(employee.date_time_get_to_work),
    newOfficeOpenDate: new Date(employee.date_time_out_of_office),
    newOfficeReEntryDate: new Date(employee.date_time_reenter_office),
    newReturnWorkDate: new Date(employee.date_time_back_to_work),
    notes: employee.identification_number,
  };
  formType.value = "edit";
  popupVisible.value = true;
}

function getReasonTypeFromNoncompliance(noncompliance: string): number {
  switch (noncompliance) {
    case "Vacation":
      return 1;
    case "Sick Leave":
      return 2;
    case "Personal Leave":
      return 3;
    case "Business Trip":
      return 4;
    default:
      return 1;
  }
}

function handleSaveFromModal(employeePayload: SavePayload) {
  try {
    if (formType.value === "edit" && employeePayload.id) {
      employeeStore.updateEmployee({
        id: employeePayload.id,
        identification_number: employeePayload.identification_number,
        employee_name: employeePayload.employee_name,
        date_time_get_to_work: employeePayload.date_time_get_to_work,
        date_time_out_of_office: employeePayload.date_time_out_of_office,
        date_time_reenter_office: employeePayload.date_time_reenter_office,
        date_time_back_to_work: employeePayload.date_time_back_to_work,
        status_presence: employeePayload.status_presence,
        type_noncompliance: employeePayload.type_noncompliance,
      });
    } else {
      employeeStore.createEmployee({
        identification_number: employeePayload.identification_number,
        employee_name: employeePayload.employee_name,
        date_time_get_to_work: employeePayload.date_time_get_to_work,
        date_time_out_of_office: employeePayload.date_time_out_of_office,
        date_time_reenter_office: employeePayload.date_time_reenter_office,
        date_time_back_to_work: employeePayload.date_time_back_to_work,
        status_presence: employeePayload.status_presence,
        type_noncompliance: employeePayload.type_noncompliance,
      });
    }
    // Use a toast notification instead of alert in the future
    alert("Employee saved successfully!");
    popupVisible.value = false;
  } catch {
    alert("Error saving employee. Please try again.");
  }
}
</script>
<style scoped>
.dx-datagrid-rowsview .dx-select-checkboxes-hidden > tbody > tr > td > .dx-select-checkbox {
  display: block;
  border: 2px solid black !important;
}
#employees {
  --dx-border-radius: 0.5rem;
  --dx-background-color: #ffffff;
  --dx-header-background-color: #f8fafc;
  --dx-header-text-color: #2d3748;
  --dx-row-hover-color: #edf2f7;
}

#employees :deep(.dx-datagrid) {
  border-radius: var(--dx-border-radius);
  background-color: var(--dx-background-color);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

#employees :deep(.dx-header-row) {
  background-color: var(--dx-header-background-color);
  color: var(--dx-header-text-color);
  font-weight: 600;
}

#employees :deep(.dx-row):hover {
  background-color: var(--dx-row-hover-color);
}

#employees :deep(.dx-button) {
  border-radius: 0.25rem;
  background-color: #3182ce;
  color: #ffffff;
}

#employees :deep(.dx-button):hover {
  background-color: #63b3ed;
}

#employees :deep(.dx-button):active {
  background-color: #2b6cb0;
}

/* Styles for the pager and paging components */
.dx-pager {
  background-color: #f7fafc; /* Light background for the pager */
  padding: 10px;
  border-top: 1px solid #e2e8f0; /* Light border for separation */
}

.dx-pager .dx-pages,
.dx-pager .dx-page-sizes,
.dx-pager .dx-info {
  color: #2d3748; /* Darker text for better visibility */
  font-size: 14px; /* Slightly larger font size */
}

.dx-pager .dx-page {
  min-width: 35px;
  min-height: 35px;
  line-height: 33px;
  margin-right: 5px;
  text-align: center;
  border-radius: 5px; /* Rounded corners for the page numbers */
  border: 1px solid #cbd5e1; /* Subtle border for page numbers */
  color: #4a5568; /* Dark gray color for the numbers */
  background-color: #ffffff; /* White background for the numbers */
  transition:
    background-color 0.3s,
    color 0.3s; /* Smooth transition for hover effects */
}

.dx-pager .dx-page:hover,
.dx-pager .dx-selection {
  background-color: #3182ce; /* Change background on hover to primary color */
  color: #ffffff; /* White text on hover */
  border-color: #3182ce; /* Border color matches background */
}

.dx-pager .dx-page-size {
  padding: 4px 10px;
  border-radius: 5px; /* Rounded corners for page size selectors */
  background-color: #edf2f7; /* Slightly different background for differentiation */
  margin-left: 5px; /* Spacing between page size options */
  transition: background-color 0.3s; /* Smooth transition for hover */
}

.dx-pager .dx-page-size:hover {
  background-color: #e2e8f0; /* Darker background on hover for page size options */
}

/* Styling for the information text in the pager */
.dx-pager .dx-info {
  font-weight: 500; /* Making the info text slightly bolder */
}
</style>
